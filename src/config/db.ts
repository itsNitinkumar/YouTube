import mongoose from "mongoose";
import {config} from "./env";
import {logger} from "./logger";
export const connectDB = async (): Promise<void> =>{
    try {
        const conn = await mongoose.connect(config.MONGODB_URI)
        logger.info(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        logger.error(`MongoDB connection error: ${error}`)
        process.exit(1)
    }
}