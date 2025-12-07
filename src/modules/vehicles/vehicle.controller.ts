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


const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllVehicles();

        if (result.rowCount === 0) {
            return res.status(200).json({
                success: true,
                message: "no vehicle found!",
                data: []
            })
        }

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        })

    }
    catch (err: any) {
        console.error("error getting all vehicles", err);
        res.status(500).json({
            success: false,
            message: err.message || 'internal server error getting all vehicles'
        })
    }
};



const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "vehicle id not found"
            })
        };

        const result = await vehicleServices.getSingleVehicle(id);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'vehicle not found',
                data: {}
            })
        };

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0]
        })
    }
    catch (err: any) {
        console.error('error getting single vehicle', err)
        res.status(500).json({
            success: false,
            message: err.message || 'internal server error getting single user'
        })
    }

}


const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "vehicle id not found"
            })
        };

        const data = req.body;
        console.log(data)

        const result = await vehicleServices.updateVehicle(id, data);

        if (result?.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'vehicle not found'
            })
        };

        if (result === null) {
            return res.status(200).json({
                success: true,
                message: "nothing to update",
            })
        }

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result?.rows[0]
        })
    }
    catch (err: any) {
        console.error("error updating vehicle", err);
        res.status(500).json({
            success: false,
            message: err.message || 'internal server error updating vehicle'
        })
    }

};


const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "vehicle id not found"
            })
        };

        const result = await vehicleServices.deleteVehicle(id);


        res.status(result.status).json({
            success: result.success,
            message: result.message
        })
    }
    catch(err:any){
        console.error("error deleting vehicle",err);
        res.status(500).json({
            success:false,
            message:err.message || 'internal server error deleting user',
            error:err.message || 'internal server error deleting user'
        })
    }

}



export const vehicleControllers = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}