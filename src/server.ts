import express, { Request, Response } from 'express'
import config from './config'
import initDB from './config/db';
import { authRoutes } from './modules/auth/auth.route';
const app = express()
const port = config.port;

app.use(express.json());

initDB();


const startUrl = config.url_v



app.get('/', (req: Request, res: Response) => {
    res.send("Hello World")
})



// auth routes
app.use(`${startUrl}/auth`, authRoutes)




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
