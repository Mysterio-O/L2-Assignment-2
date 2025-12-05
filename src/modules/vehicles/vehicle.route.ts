import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

// create new vehicles
router.post('/', vehicleControllers.createVehicle);


// get all vehicles
router.get("/", vehicleControllers.getAllVehicles);


export const vehicleRoutes = router;