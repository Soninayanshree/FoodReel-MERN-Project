//This file will be responsible for loading and validating environment variables.
const dotenv = require("dotenv");

dotenv.config();

//required environment variables
const requiredEnvVars = ["MONGODB_URL", "JWT_SECRET", "IMAGEKIT_PUBLIC_KEY", "IMAGEKIT_PRIVATE_KEY", "IMAGEKIT_URL_ENDPOINT"];

//store missing environment variables in an array
const missingEnvVars = requiredEnvVars.filter(
    (key) => !process.env[key]
);

//if there are missing environment variables, throw an error
if (missingEnvVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
}

//export environment variables
const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 5000,
    MONGODB_URL: process.env.MONGODB_URL,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    CORS_ORIGINS: (
        process.env.CORS_ORIGINS || "http://localhost:5173"
    )
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),//remove empty strings
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};

module.exports = env;