import express, { Request, Response } from 'express'
import config from './config'
import initDB from './config/db';
import { authRoutes } from './modules/auth/auth.route';
import { vehicleRoutes } from './modules/vehicles/vehicle.route';
import { userRoutes } from './modules/users/user.route';
import { bookingRoutes } from './modules/bookings/booking.route';
import cron from 'node-cron';
import { autoReturnEndedBooking } from './modules/bookings/cron.service';


const app = express()
const port = config.port;

app.use(express.json());

initDB();


const startUrl = config.url_v



app.get('/', (req: Request, res: Response) => {
    res.send("Hello World")
})



// auth routes
app.use(`${startUrl}/auth`, authRoutes);


// vehicle routes
app.use(`${startUrl}/vehicles`, vehicleRoutes);


// users routes
app.use(`${startUrl}/users`, userRoutes);


// booking routes 
app.use(`${startUrl}/bookings`, bookingRoutes);



// auto update vehicle and booking on end period
cron.schedule("*/10 * * * *", async () => {
    try {
        const result = await autoReturnEndedBooking();
        if (result.success && result.updatedCount > 0) {
            console.log(`[CRON] Auto-returned ${result.updatedCount} ended bookings.`)
        }
    }
    catch (err) {
        console.error("[CRON] autoReturnEndedBookings failed:", err);
    }
})



// not found route
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "route not found",
        requested_path: req.path
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
