import express, { Request, Response } from 'express'
import config from './config'
import initDB from './config/db';
const app = express()
const port = config.port;

app.use(express.json());

initDB();



app.get('/', (req: Request, res: Response) => {
    res.send("Hello World")
})






// not found route
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: false,
        message: "route not found",
        requested_path: req.path
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
