import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();

// create new vehicles
router.post('/', auth('admin'), vehicleControllers.createVehicle);


// get all vehicles
router.get("/", vehicleControllers.getAllVehicles);


// get single vehicle
router.get("/:id", vehicleControllers.getSingleVehicle);


// update vehicle
router.put("/:id", auth('admin'), vehicleControllers.updateVehicle);


// delete vehicle
router.delete("/:id", auth('admin'), vehicleControllers.deleteVehicle);


export const vehicleRoutes = router;