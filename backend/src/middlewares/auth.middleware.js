const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const ROLES = require("../../constants/roles");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({//401 unauthorized access
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);//verify token
        if (decoded.role !== ROLES.FOOD_PARTNER) {
            return res.status(403).json({//403 forbidden access
                message: "Access denied"
            });
        }
        const foodPartner = await foodPartnerModel.findById(decoded.id);//find food partner by id

        // Check if food partner exists
        if (!foodPartner) {
            return res.status(401).json({
                message: "Food partner not found"
            });
        }

        req.foodPartner = foodPartner;//attach food partner to request object
        next();

    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ // 401 unauthorized access
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
        if (decoded.role !== ROLES.USER) {
            return res.status(403).json({//403 forbidden access
                message: "Access denied"
            });
        }
        const user = await userModel.findById(decoded.id); // find user by id

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user; // attach user to request object
        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
};