//centralized error handling middleware
const errorMiddleware = (err, req, res, next) => {
    let statusCode = Number(err.statusCode) || 500;
    let message = err.message || "Internal Server Error";

    // Ensure valid HTTP status code
    if (statusCode < 400 || statusCode > 599) {
        statusCode = 500;
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        message = "A resource with this value already exists";
    }

    // Mongoose invalid ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }

    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authentication token";
    }

    // Expired JWT
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authentication token has expired";
    }

    // Multer file upload errors
    if (err instanceof require("multer").MulterError) {
        statusCode = 400;

        if (err.code === "LIMIT_FILE_SIZE") {
            message = "Video file size exceeds the allowed limit";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected file field";
        } else {
            message = err.message;
        }
    }

    // Malformed JSON
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        statusCode = 400;
        message = "Invalid JSON request body";
    }

    // Log error details
    console.error({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        statusCode,
        message: err.message,
    });

    // Send response
    res.status(statusCode).json({
        success: false,
        message: err.details
            ? err.details.map((detail) => detail.message).join(", ")
            : message,
    });

};

module.exports = errorMiddleware;
