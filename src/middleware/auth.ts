import { NextFunction, Request, Response } from "express";
import { Role } from "../types/app/types";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split('Bearer ')[1];
            console.log(token)
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "unauthorized access"
                })
            };

            const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;

            req.user = decoded;


            // role check
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "forbidden access"
                })
            };

            next();

        }
        catch (err: any) {
            console.error("error while validating token", err);
            res.status(500).json({
                success: false,
                message: "internal server error",
                error: err.message
            })
        }
    }
};

export default auth;