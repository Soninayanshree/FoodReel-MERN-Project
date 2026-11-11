const userModel = require("../models/user.model");//import user model
const foodPartnerModel = require("../models/foodpartner.model");//import food partner model
const bcrypt = require("bcryptjs");//import bcrypt for password hashing
const jwt = require("jsonwebtoken");//import jwt for token generation

async function registerUser(req,res){//register user function

    const {fullName,email,password} = req.body;

    const isUserAlreadyExists =await userModel.findOne({email});//check if user already exists
    if(isUserAlreadyExists){
        return res.status(400).json({
            message : "user already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(password,10);//hash password

    const user = await userModel.create({//create user
        fullName,
        email,
        password : hashedPassword,
    });

    const token = jwt.sign({
        id : user._id,
    },process.env.JWT_SECRET)

    res.cookie("token", token);//set cookie

    res.status(201).json({//send response
        message : "user registered successfully",
        user:{
            id: user._id,
            email: user.email,
            fullName: user.fullName,
        }
    })
}

async function loginUser(req,res){//login user function
    const {email,password} = req.body;

    const user = await userModel.findOne({email});//find user by email

    if(!user){
        return res.status(400).json({
            message : "Invalid email and password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);//compare password

    if(!isPasswordValid){
        res.status(400).json({
            message : "Invalid email and password"
        })
    }
    
    const token = jwt.sign({
        id : user._id,
    },process.env.JWT_SECRET)//generate token

    res.cookie("token", token);//set cookie

    res.status(200).json({//send response
        message : "User logged in successfully", 
        user:{
            _id : user._id,
            email : user.email,
            fullName : user.fullName,
            token
        }
        })

}

async function logoutUser(req,res){//logout user function
    res.clearCookie("token");//clear cookie
    res.status(200).json({
        message : "User logged out successfully"
    });
}

async function registerFoodPartner(req,res){//register food partner function
    console.log("Headers:", req.headers);
     console.log("Request body:", req.body);

    const { name , email , contact , address, password } = req.body;

    const isAccountAlreadyExists =await foodPartnerModel.findOne({email});

    if(isAccountAlreadyExists){
        return res.status(400).json({
            message : "Food partner account already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(password,10);//hash password

    const foodPartner = await foodPartnerModel.create({//create food partner
        name,
        email,
        contact,
        address,
        password : hashedPassword,
    });

    const token = jwt.sign({
        id : foodPartner._id,
    },process.env.JWT_SECRET)

    res.cookie("token", token);//set cookie

    res.status(201).json({//send response
        message : "Food partner registered successfully",
        foodPartner:{
            _id: foodPartner._id,
            email: foodPartner.email,
            contact: foodPartner.contact,
            address: foodPartner.address,
            name: foodPartner.name,
        }
    })
}

async function loginFoodPartner(req,res){//login food partner function
    const {email,password} = req.body;

    const foodPartner = await foodPartnerModel.findOne({email});//find food partner by email

    if(!foodPartner){
        return res.status(400).json({
            message : "Invalid email and password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);//compare password

    if(!isPasswordValid){
        res.status(400).json({
            message : "Invalid email and password"
        })
    }
    const token = jwt.sign({
        id : foodPartner._id,
    },process.env.JWT_SECRET)//generate token

    res.cookie("token", token);//set cookie

    res.status(200).json({//send response
        message : "Food partner logged in successfully",
        foodPartner:{
            _id : foodPartner._id,
            email : foodPartner.email,
            name : foodPartner.name
        }
    })
}

async function logoutFoodPartner(req,res){//logout food partner function
    res.clearCookie("token");//clear cookie
    res.status(200).json({
        message : "Food partner logged out successfully"
    });
}
module.exports ={
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}