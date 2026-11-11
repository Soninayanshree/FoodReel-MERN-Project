
const mongoose = require("mongoose");

// Middleware to validate Food ID
function validateFoodId(req, res, next) {

    // Get Food ID from request body or URL params
    const foodId = req.body?.foodId || req.params?.foodId;

    // Check if Food ID is provided
    if (!foodId) {
        const error = new Error("Food ID is required");
        error.statusCode = 400;
        return next(error);
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(foodId)) {
        const error = new Error("Invalid Food ID");
        error.statusCode = 400;
        return next(error);
    }

    // Continue to next middleware or controller
    next();
}

module.exports = validateFoodId;
