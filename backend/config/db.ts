import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectToDB = async () => {
    try {
        if(!process.env.DB_CONNECTION) process.exit(1);
        await mongoose.connect(process.env.DB_CONNECTION);
            console.log('mongodb connected');
    }
    catch (error) {
        console.error('error with mongodb connection:', error);
    }
}
