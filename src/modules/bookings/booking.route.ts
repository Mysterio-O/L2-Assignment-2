import { Router } from "express";
import { bookingControllers } from "./booking.controller";

const router = Router();

// create booking
router.post("/", bookingControllers.createBooking);


// get all bookings
router.get("/",bookingControllers.getBookings);


// updated bookings
router.put("/:id",bookingControllers.updateBooking);

export const bookingRoutes = router;