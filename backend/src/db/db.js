const mongoose = require("mongoose");
const env = require("../config/env");

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URL);

        console.log("MongoDB connected successfully");

        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        throw error;
    }
};

module.exports = connectDB;