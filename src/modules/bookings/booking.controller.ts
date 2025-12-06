import { Request, Response } from "express";
import { bookingHelpers } from "../../helper/bookingHelper";
import { bookingServices } from "./booking.service";


const createBooking = async (req: Request, res: Response) => {
    try {
        const validationError = bookingHelpers.helpCreate(req.body);

        if (validationError) {
            return res.status(validationError.status).json({
                success: false,
                message: validationError.message
            })
        };

        const result = await bookingServices.createBooking(req.body);

        if (result.success === false) {
            return res.status(result.status).json({
                success: result.success,
                message: result.message
            })
        };

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        })

    }
    catch (err: any) {
        console.error("error creating new booking", err);
        res.status(500).json({
            success: false,
            message: "internal server error",
            error: err.message
        })
    }
};

const getBookings = async (req: Request, res: Response) => {
    try {

        const result = await bookingServices.getBookings(req?.user!);

        if (result.rowCount === 0) {
            return res.status(200).json({
                success: true,
                message: "no booking found",
                data: []
            })
        };


        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result.rows
        })

    }
    catch (err: any) {
        console.error('error getting all users', err);
        res.status(500).json({
            success: false,
            message: "internal server error",
            error: err.message
        })
    }
};


const updateBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "booking id not found"
        })
    };

    if (!req.body.status) {
        return res.status(400).json({
            success: false,
            message: "no status found"
        })
    };

    // check permission according to role
    if (req.user && req?.user.role === 'customer' && req.body.status === 'returned') {
        return res.status(400).json({
            success: false,
            message: "you're not allowed to make this action"
        })
    };

    const validationError = bookingHelpers.helpUpdate(req.body.status);

    if (validationError) {
        return res.status(validationError.status).json({
            success: validationError.success,
            message: validationError.message
        });
    };

    const result = await bookingServices.updateBooking(id, req.body.status);

    if (result.success === false) {
        return res.status(result.status).json({
            success: result.success,
            message: result.message
        })
    }

    res.status(result.status).json({
        success: result.success,
        message: result.message,
        data: result.data
    })

}



export const bookingControllers = {
    createBooking,
    getBookings,
    updateBooking
}