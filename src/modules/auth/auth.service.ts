// create user

import { pool } from "../../config/db";
import { Role } from "../../types/app/types";
import bcrypt from "bcryptjs";

interface CreateUserProps {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role
}

const createUser = async (payload: CreateUserProps) => {
    if (!payload) {
        return null;
    }
    const { name, email, password, phone, role } = payload;

    const hashedPassword = bcrypt.hashSync(password, 12);

    const result = await pool.query(`
        INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5)
        `, [name, email, hashedPassword, phone, role]);

    return result;

}


export const authServices = {
    createUser
}