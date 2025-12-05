import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post('/', vehicleControllers.createVehicle);


export const vehicleRoutes = router;