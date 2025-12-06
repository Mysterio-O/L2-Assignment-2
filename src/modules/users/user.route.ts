import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();


// get all users
router.get("/", userControllers.getUsers);


// update user
router.put("/:id", userControllers.updateUser);


// delete user
router.delete("/:id", userControllers.deleteUser)





export const userRoutes = router;