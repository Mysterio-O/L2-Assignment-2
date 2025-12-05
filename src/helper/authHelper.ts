import { Response } from "express";

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

type ValidationError = {
    status: number;
    message: string;
} | null;

const helpCreate = (payload: Record<string, any>): ValidationError => {
    const { name, email, password, phone, role } = payload;

    if (!name) {
        return { status: 404, message: "name not found" };
    }

    if (!email) {
        return { status: 404, message: "email not found" };
    }

    if (!emailRegex.test(email)) {
        return { status: 400, message: "email is not valid" };
    }

    if (!password) {
        return { status: 404, message: "password not found" };
    }

    if (password.length < 6) {
        return { status: 400, message: "password must be at least 6 characters" };
    }

    if (!phone) {
        return { status: 404, message: "phone number not found" };
    };

    if (!role) {
        return { status: 404, message: "role not found" }
    }

    if (role !== "admin" && role !== "customer") {
        return { status: 400, message: "invalid role" };
    }

    return null;
};

const helpLogin = ({ email, password }: { email: string, password: string }) => {
    if (!email) return { status: 404, message: "email not found" };
    if (!emailRegex.test(email)) return { status: 400, message: "invalid email" };
    if (!password) return { status: 404, message: "password not found" };
    return null;
}

export const authHelpers = {
    helpCreate,
    helpLogin
};
