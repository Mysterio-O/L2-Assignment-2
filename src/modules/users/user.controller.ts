import { Request, Response } from "express";
import { userServices } from "./user.service";


const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers();

        if (result.rowCount === 0) {
            return res.status(200).json({
                success: true,
                message: "no user found",
                data: []
            })
        };


        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })

    } catch (err: any) {
        console.error("error getting all users", err);
        res.status(500).json({
            success: false,
            message: "internal server error",
            error: err.message
        })
    }
};




const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "user id not found"
            })
        };

        if (!req.body) {
            return res.status(200).json({
                success: true,
                message: "nothing to update!"
            })
        };

        const result = await userServices.updateUser(id, req.body)

        console.log(result)

        if (result?.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "failed to update user"
            })
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result?.rows[0]
        })

    } catch (err: any) {
        console.error("error updating user", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
};



const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "user id not found"
            })
        };

        const result = await userServices.deleteUser(id);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        };

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }
    catch (err: any) {
        console.error("error deleting user", err);
        res.status(500).json({
            success: false,
            message: "internal server error",
            error: err.message
        })
    }

}


export const userControllers = {
    getUsers,
    updateUser,
    deleteUser,
}