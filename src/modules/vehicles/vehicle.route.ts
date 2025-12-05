import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

// create new vehicles
router.post('/', vehicleControllers.createVehicle);


// get all vehicles
router.get("/", vehicleControllers.getAllVehicles);


// get single vehicle
router.get("/:id", vehicleControllers.getSingleVehicle);


export const vehicleRoutes = router;