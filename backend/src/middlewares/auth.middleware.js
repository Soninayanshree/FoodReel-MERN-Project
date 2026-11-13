const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const ROLES = require("../../constants/roles");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const authFoodPartnerMiddleware = asyncHandler(async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, "Please login first");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//verify token
    if (decoded.role !== ROLES.FOOD_PARTNER) {
        throw new ApiError(403, "Access denied");
    }
    const foodPartner = await foodPartnerModel.findById(decoded.id);//find food partner by id

    // Check if food partner exists
    if (!foodPartner) {
        throw new ApiError(404, "Food partner not found");
    }

    req.foodPartner = foodPartner;//attach food partner to request object
    next();

});

const authUserMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, "Please login first");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
    if (decoded.role !== ROLES.USER) {
        throw new ApiError(403, "Access denied");
    }
    const user = await userModel.findById(decoded.id); // find user by id

    // Check if user exists
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    req.user = user; // attach user to request object
    next();
});

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
};