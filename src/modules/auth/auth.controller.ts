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

        // console.log(result)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result?.rows[0]
        })

    } catch (err: any) {
        console.error("error adding new user", err);
        res.status(500).json({
            success: false,
            message: 'internal server error',
            error:err.message
        })
    }
};



// login user
const loginUser = async (req: Request, res: Response) => {
    try {
        // console.log(req.body)
        if (!req.body) {
            return res.status(404).json({
                success: false,
                message: "request body not found"
            });
        };


        const validationError = authHelpers.helpLogin(req.body);

        if (validationError) {
            return res.status(validationError.status).json({
                success: false,
                message: validationError.message
            })
        }

        const result = await authServices.loginUser(req.body);

        if (result.status) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            })
        };

        if (result.success) {
            res.status(200).json(result)
        }
    }
    catch (err: any) {
        console.error("error logging in user", err);
        res.status(500).json({
            success: false,
            message: 'internal server error logging in',
            error:err.message
        })
    }


}




export const authControllers = {
    createUser,
    loginUser
}