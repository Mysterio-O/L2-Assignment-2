import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

// create booking
router.post("/", bookingControllers.createBooking);


// get all bookings
router.get("/", bookingControllers.getBookings);


// updated bookings
router.put("/:id", auth('admin', 'customer'), bookingControllers.updateBooking);

export const bookingRoutes = router;