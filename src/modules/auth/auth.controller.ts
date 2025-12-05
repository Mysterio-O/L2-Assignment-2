import { Request, Response } from "express";
import { authServices } from "./auth.service";
import { authHelpers } from "../../helper/authHelper";

// create user
const createUser = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(404).json({
                success: false,
                message: "no request body found"
            })
        };

        // check the required fields
        const validationError = authHelpers.helpCreate(req.body);

        if (validationError) {
            return res.status(validationError.status).json({
                success: false,
                message: validationError.message
            })
        };

        const result = await authServices.createUser(req.body);

        if (result?.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "failed to signup"
            })
        };

        res.status(201).json({
            success: true,
            message: 'new user created!',
            user: result?.rows[0]
        })

    } catch (err: any) {
        console.error("error adding new user", err);
        res.status(500).json({
            success: false,
            message: err?.message || 'internal server error'
        })
    }
};




export const authControllers = {
    createUser
}