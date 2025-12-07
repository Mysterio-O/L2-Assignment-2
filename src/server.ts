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
app.post(`${startUrl}/cron/auto-return`, async (req: Request, res: Response) => {
    try {
        // Verify cron secret
        const providedSecret = req.headers['x-cron-secret'];

        if (!providedSecret || providedSecret !== config.cron_secret) {
            console.log('[CRON] Unauthorized cron attempt');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        console.log('[CRON] Starting auto return job...');

        const result = await autoReturnEndedBooking();

        if (result.success && result.updatedCount > 0) {
            console.log(`[CRON] Auto-returned ${result.updatedCount} ended bookings`);
        } else {
            console.log('[CRON] No bookings to return');
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error('[CRON] Job failed:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});



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
