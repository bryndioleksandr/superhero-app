import express, { Request, Response } from 'express';
import {connectToDB} from "./config/db";
import cors from "cors";
import router from "./routes/router";

const app = express();
const port = process.env.PORT || 5501;

if(!process.env.ALLOWED_ORIGINS) process.exit(1);
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(router);

app.get('/', (req: Request, res: Response) => {
    res.send('superhero server works');
});

const startServer = async () => {
    try{
        await connectToDB();
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        });
    }
    catch (error) {
        console.error('error during server init:' ,error);
    }
}

startServer();


