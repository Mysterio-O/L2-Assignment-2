import { pool } from "../../config/db"

export const autoReturnEndedBooking = async () => {
    const client = await pool.connect();

    console.log('cron service started. pool connected')

    try {
        await client.query("BEGIN");

        const { rows } = await client.query(`
            WITH updated_bookings AS(
            UPDATE bookings
            SET status = $1
            WHERE status = $2
            AND rent_end_date < CURRENT_DATE
            RETURNING id, vehicle_id
            )
            UPDATE vehicles v
            SET availability_status = $3
            FROM updated_bookings b
            WHERE v.id = b.vehicle_id
            AND v.availability_status <> 'available'
            RETURNING b.id AS booking_id, v.id AS vehicle_id
            `,['returned','active','available']);

        await client.query("COMMIT");

        if (rows.length > 0) {
            console.log(`[auto_return_ended_booking]:- Updated ${rows.length} booking as returned`)
        };

        return {
            success: true,
            updatedCount: rows.length,
            items: rows
        }

    }
    catch (err) {
        await client.query("ROLLBACK")
        console.error("error auto updating vehicle and booking status", err);
        return {
            success: false,
            updatedCount: 0,
            error: (err as Error).message
        }
    }
    finally {
        console.log('cron job finished. exiting...')
        client.release();
    }

}