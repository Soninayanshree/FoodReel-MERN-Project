const mongoose = require("mongoose");//import mongoose

const userSchema = new mongoose.Schema({//user schema is created
    fullName : {
        type : String,
        required : true,
        trim: true
    },
    email : {
        type : String,
        required: true,
        unquie : true,
        lowercase: true,
        trim: true
    },
    password : {
        type : String,
        required : true,
    },
},
{  
    timestamps : true//when user is created and updated
}
);

const userModel =mongoose.model("user", userSchema);//user model is created

module.exports = userModel;//export user model