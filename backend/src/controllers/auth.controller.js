const userModel = require("../models/user.model");//import user model
const foodPartnerModel = require("../models/foodpartner.model");//import food partner model
const bcrypt = require("bcryptjs");//import bcrypt for password hashing
const jwt = require("jsonwebtoken");//import jwt for token generation
const ROLES = require("../../constants/roles");//import roles
const asyncHandler = require("../utils/asyncHandler");//import async handler
const ApiError = require("../utils/ApiError");//import api error handler

const registerUser = asyncHandler(async (req, res) => {//register user function
    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });//check if user already exists

    if (isUserAlreadyExists) {
        throw new ApiError(409, "User account already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);//hash password

    const user = await userModel.create({//create user
        fullName,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({
        id: user._id,
        role: ROLES.USER
    }, process.env.JWT_SECRET,
        { expiresIn: "1h" });//generate token

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });//set cookie

    res.status(201).json({//send response
        message: "user registered successfully",
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
        }
    })
});

const loginUser = asyncHandler(async (req, res) => {//login user function
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });//find user by email

    if (!user) {
        throw new ApiError(401, "Invalid email and password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);//compare password

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email and password");
    }

    const token = jwt.sign({
        id: user._id,
        role: ROLES.USER
    }, process.env.JWT_SECRET,
        { expiresIn: "1h" });//generate token

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });//set cookie

    res.status(200).json({//send response
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            token
        }
    })
});

const logoutUser = asyncHandler(async (req, res) => {//logout user function
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });//clear cookie
    res.status(200).json({
        message: "User logged out successfully"
    });
});

const registerFoodPartner = asyncHandler(async (req, res) => {//register food partner function
    const { name, email, contact, address, password } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });

    if (isAccountAlreadyExists) {
        throw new ApiError(409, "Food partner account already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);//hash password

    const foodPartner = await foodPartnerModel.create({//create food partner
        name,
        email,
        contact,
        address,
        password: hashedPassword,
    });

    const token = jwt.sign({
        id: foodPartner._id,
        role: ROLES.FOOD_PARTNER
    }, process.env.JWT_SECRET,
        { expiresIn: "1h" })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });//set cookie

    res.status(201).json({//send response
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            contact: foodPartner.contact,
            address: foodPartner.address,
            name: foodPartner.name,
        }
    });
});

const loginFoodPartner = asyncHandler(async (req, res) => {//login food partner function
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email });//find food partner by email

    if (!foodPartner) {
        throw new ApiError(401, "Invalid email and password");
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);//compare password

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email and password");
    }
    const token = jwt.sign({
        id: foodPartner._id,
        role: ROLES.FOOD_PARTNER
    }, process.env.JWT_SECRET,
        { expiresIn: "1h" });//generate token

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });//set cookie

    res.status(200).json({//send response
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            token
        }
    });
});

const logoutFoodPartner = asyncHandler(async (req, res) => {//logout food partner function
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });//clear cookie
    res.status(200).json({
        message: "Food partner logged out successfully"
    });
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}