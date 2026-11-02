//This file will be responsible for loading and validating environment variables.
const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = ["MONGODB_URL"];

const missingEnvVars = requiredEnvVars.filter(
    (key) => !process.env[key]
);

if (missingEnvVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
}

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
        .filter(Boolean),
};

module.exports = env;