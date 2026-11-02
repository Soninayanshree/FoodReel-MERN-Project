const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = require("./config/cors");
const apiRoutes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Security and request configuration
app.disable("x-powered-by");

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb",
}));

app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FoodReel API is running",
    });
});

// API routes
app.use("/api", apiRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Centralized error handler (must be last)
app.use(errorMiddleware);

module.exports = app;