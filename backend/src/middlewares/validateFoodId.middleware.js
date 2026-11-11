const mongoose = require("mongoose");

function validateFoodId(req, res, next) {
    const foodId = req.body.foodId || req.params.foodId;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
        return res.status(400).json({
            message: "Invalid Food ID"
        });
    }

    next();
}

module.exports = validateFoodId;