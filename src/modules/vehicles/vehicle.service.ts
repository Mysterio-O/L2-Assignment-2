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
}


export const vehicleServices = {
    createVehicle,
    getAllVehicles
}