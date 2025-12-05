import { Request, Response } from "express";
import { vehicleHelpers } from "../../helper/vehicleHelper";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(404).json({
                success: false,
                message: "request body not found"
            })
        }

        // validate req body
        const validationError = vehicleHelpers.helpCreate(req.body);

        if (validationError) {
            return res.status(validationError.status).json({
                success: false,
                message: validationError.message
            })
        };

        const result = await vehicleServices.createVehicle(req.body);

        if (result?.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "failed to add new vehicle"
            })
        };

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result?.rows[0]
        })

    }
    catch (err: any) {
        console.error("error adding new vehicle", err);
        res.status(500).json({
            success: false,
            message: err.message || 'internal server error adding new vehicle'
        })
    }
};



export const vehicleControllers = {
    createVehicle
}