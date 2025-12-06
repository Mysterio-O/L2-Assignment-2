import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import { bookingHelpers } from "../../helper/bookingHelper";
import { UserPayload } from "../../types/app/types";


const createBooking = async (payload: Record<string, any>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // get vehicle info first ->
    const vehicleData = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);

    if (vehicleData.rowCount === 0) return { success: false, status: 404, message: "vehicle not found" };


    const vehicle = vehicleData.rows[0];

    // check if the vehicle available or not
    if (vehicle.availability_status !== 'available') return { success: false, status: 400, message: "the vehicle is already booked" };


    // calculate total bill

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    const difMs = end.getTime() - start.getTime();
    const difDays = difMs / (1000 * 60 * 60 * 24);

    if (difDays <= 0 || Number.isNaN(difDays)) {
        return {
            success: false,
            status: 400,
            message: "rent_start_date must be before rent_end_date"
        }
    }

    const totalRent = difDays * Number(vehicle.daily_rent_price);

    // update status to booked
    const updateVehicleStatus = await pool.query(`
    UPDATE vehicles
    SET availability_status = $1
    WHERE id = $2
    RETURNING id
    `, ['booked', vehicle_id]);

    if (updateVehicleStatus.rowCount === 0) {
        return { success: false, status: 400, message: "failed to update vehicle status" }
    }


    const createBooking = await pool.query(`
        INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
        `, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalRent, 'active']);

    console.log(createBooking);


    if (createBooking.rowCount === 0) {
        return { success: false, status: 400, message: "failed to create new booking" }
    }

    const row = createBooking.rows[0]

    const result = {
        ...row,
        rent_start_date: bookingHelpers.formatYMD(row.rent_start_date),
        rent_end_date: bookingHelpers.formatYMD(row.rent_end_date),
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    }

    return result

};




const getBookings = async (user: JwtPayload) => {
    let query = `
                SELECT 
                  id,
                  customer_id,
                  vehicle_id,
                  to_char(rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
                  to_char(rent_end_date,   'YYYY-MM-DD') AS rent_end_date,
                  total_price,
                  status
                FROM bookings
                `;

    const params: any[] = [];

    if (user.role === "customer") {
        query += ` WHERE customer_id = $1`;
        params.push(user.id);
    };

    const result = await pool.query(query, params);

    return result
};


const updateBooking = async (id: string, status: "cancelled" | "returned") => {
    const booking = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);

    if (booking.rowCount === 0) {
        return { success: false, status: 400, message: "booking not found" };
    }

    if (status === "cancelled") {
        const hasBookingStarted = bookingHelpers.hasBookingStarted(
            booking.rows[0].rent_start_date
        );

        if (hasBookingStarted) {
            return {
                success: false,
                status: 400,
                message: "booking has already started. cannot change status now.",
            };
        }

        const updated = await pool.query(
            `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        customer_id,
        vehicle_id,
        to_char(rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
        to_char(rent_end_date,   'YYYY-MM-DD') AS rent_end_date,
        total_price,
        status
      `,
            [status, id]
        );

        const vehicle_id = booking.rows[0].vehicle_id;

        await pool.query(
            `
      UPDATE vehicles
      SET availability_status = $1
      WHERE id = $2
      `,
            ["available", vehicle_id]
        );

        return {
            success: true,
            status: 200,
            message: "Booking cancelled successfully",
            data: updated.rows[0],
        };
    }

    // status === 'returned' (admin)
    const vehicleRes = await pool.query(
        `
    UPDATE vehicles
    SET availability_status = $1
    WHERE id = $2
    RETURNING availability_status
    `,
        ["available", booking.rows[0].vehicle_id]
    );

    const updated = await pool.query(
        `
    UPDATE bookings
    SET status = $1
    WHERE id = $2
    RETURNING
      id,
      customer_id,
      vehicle_id,
      to_char(rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
      to_char(rent_end_date,   'YYYY-MM-DD') AS rent_end_date,
      total_price,
      status
    `,
        [status, id]
    );

    if (updated.rowCount === 0) {
        return { success: false, status: 400, message: "failed to update booking" };
    }

    return {
        success: true,
        status: 200,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
            ...updated.rows[0],
            vehicle: {
                availability_status: vehicleRes.rows[0].availability_status,
            },
        },
    };
};




export const bookingServices = {
    createBooking,
    getBookings,
    updateBooking
}