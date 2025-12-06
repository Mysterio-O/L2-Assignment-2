export type Role = 'admin' | 'customer';
export type Admin = 'admin';
export type Customer = 'customer';
export type VehicleTypes = 'car' | 'bike' | 'van' | 'SUV';
export type AvailableStatus = 'available' | 'booked';

export interface UserPayload {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: Role
}