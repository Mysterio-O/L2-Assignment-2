import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import allowSelfOrAdmin from "../../middleware/allowSelfOrAdmin";

const router = Router();


// get all users
router.get("/", auth('admin'), userControllers.getUsers);


// update user
router.put("/:id", auth(), allowSelfOrAdmin, userControllers.updateUser);


// delete user
router.delete("/:id", auth('admin'), userControllers.deleteUser)





export const userRoutes = router;