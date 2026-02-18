import dotenv from "dotenv"
dotenv.config()
const requiredEnvVars =["PORT", "MONGO_URI", "NODE_ENV"]
requiredEnvVars.forEach((key) => {
    if(!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
})
export const config = {
    PORT :  Number(process.env.PORT),
    MONGO_URI: process.env.MONGO_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_SECRET: process.env.JWT_SECRET as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
}