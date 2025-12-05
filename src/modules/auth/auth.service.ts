// create user

import { pool } from "../../config/db";
import { Role } from "../../types/app/types";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import config from "../../config";

interface CreateUserProps {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role
}

interface LoginUserProps {
    email: string;
    password: string;
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

const loginUser = async (payload: LoginUserProps) => {
    const { email, password } = payload;
    const result = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email]);

    if (result.rowCount === 0) {
        return { status: 404, message: "user not found with this email" }
    }

    const user = result.rows[0];

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) return { status: 400, message: "password didn't match" };

    const userPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    }

    const token = jwt.sign(userPayload, config.jwt_secret as string, {
        expiresIn: "7d"
    });

    return {
        success: true,
        token: token,
        user: userPayload
    }
}


export const authServices = {
    createUser,
    loginUser
}