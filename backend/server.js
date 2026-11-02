const app = require("./src/app");
const connectDB = require("./src/db/db");
const env = require("./src/config/env");

const mongoose = require("mongoose");

let server;

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Start HTTP server only after successful DB connection
        server = app.listen(env.PORT, () => {
            console.log(
                `FoodReel server running on port ${env.PORT}`
            );

            console.log(`Environment: ${env.NODE_ENV}`);
        });
    } catch (error) {
        console.error("Failed to start application:", error.message);
        process.exit(1);
    }
};

// Graceful shutdown
const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);

    if (server) {
        server.close(async () => {
            try {
                await mongoose.connection.close();

                console.log("MongoDB connection closed");
                process.exit(0);
            } catch (error) {
                console.error("Shutdown error:", error.message);
                process.exit(1);
            }
        });
    } else {
        process.exit(0);
    }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();