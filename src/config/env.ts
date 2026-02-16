import dotenv from "dotenv"
dotenv.config()
const requiredEnvVars =["PORT", "MONGODB_URI", "NODE_ENV"]
requiredEnvVars.forEach((key) => {
    if(!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
})
export const congif = {
    PORT :  Number(process.env.PORT),
    MONGO_URI: process.env.MONGO_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
}