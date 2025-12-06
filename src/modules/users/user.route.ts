import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();


// get all users
router.get("/", userControllers.getUsers);


// update user
router.put("/:id", userControllers.updateUser);





export const userRoutes = router;