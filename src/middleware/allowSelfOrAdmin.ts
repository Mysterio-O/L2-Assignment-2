import { NextFunction, Request, Response } from "express";


const allowSelfOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const { id } = req.params;

    console.log('entered')

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "unauthorized access"
        })
    };

    const isAdmin = user.role === 'admin';
    const isSelf = String(user.id) === id;

    console.log(isAdmin,isSelf)

    if (!isAdmin && !isSelf) {
        return res.status(403).json({
            success: false,
            message: "forbidden: you can only update your own profile!"
        })
    };

    next();

};

export default allowSelfOrAdmin;