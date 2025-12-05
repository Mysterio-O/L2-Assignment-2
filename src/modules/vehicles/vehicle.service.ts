import { pool } from "../../config/db";
import { AvailableStatus, VehicleTypes } from "../../types/app/types";


interface CreateVehicleProps {
    vehicle_name: string;
    type: VehicleTypes;
    registration_number: string;
    daily_rent_price: number;
    availability_status: AvailableStatus;
}

const createVehicle = async (payload: CreateVehicleProps) => {
    if (!payload) return null;

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload

    const result = await pool.query(`
        INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
        `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

    return result;

};


const getAllVehicles = async () => {
    const result = await pool.query(`
        SELECT * FROM vehicles
        `);
    console.log(result);
    return result;
};


const getSingleVehicle = async (id: string) => {
    const result = await pool.query(`
        SELECT * FROM vehicles WHERE id=$1
        `, [id]);
    return result;
};


const updateVehicle = async (id: string, payload: Record<string, any>) => {
    const allowedFields = ["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status",];

    if (!payload) {
        return null;
    }

    const setFields: string[] = [];
    const values: string[] = [];
    let index = 1;

    for (const field of allowedFields) {
        if (payload[field] !== undefined) {
            setFields.push(`${field} = $${index}`);
            values.push(payload[field]);
            index++;
        }
    };


    // return if no updatable fields available
    if (setFields.length === 0) return null;

    values.push(id);


    const query = `
        UPDATE vehicles
        SET ${setFields.join(", ")}
        WHERE id=$${index}
        RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `;

    const result = await pool.query(query, values);

    return result;

};



const deleteVehicle = async (id: string) => {
    const result =await pool.query(`
        DELETE FROM vehicles WHERE id = $1
        `, [id]);

    return result;
}


export const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
}