const e = require("express");
const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const commentModel = require("../models/comment.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid"); // Generate unique identifiers

async function createFood(req, res) {
  // console.log(req.foodPartner);
  // console.log(req.body);
  // console.log(req.file); // Access the uploaded video file

  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid()
  ); // Upload file to storage service
  // console.log(fileUploadResult);// Log the result of the file upload
  // Create a new food item in the database
  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "Food item created successfully",
    food: foodItem, // Return the created food item
  });
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({}); // Fetch all food items from the database
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    console.log("req.user:", req.user);
console.log("foodId:", foodId);

    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });


    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        user: user._id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });

      return res.status(200).json({
        message: "Food unliked successfully",
        liked: false,
      });
    }

    await likeModel.create({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: 1 },
    });

    return res.status(201).json({
      message: "Food liked successfully",
      liked: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({
        user: user._id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: -1 },
      });

      return res.status(200).json({
        message: "Food unsaved successfully",
        saved: false,
      });
    }

    await saveModel.create({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { savesCount: 1 },
    });

    return res.status(201).json({
      message: "Food saved successfully",
      saved: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getSaveFood(req,res) {
    const user = req.user;
    const savedFoods = await saveModel.find({user:user._id}).populate('food')

    if(!savedFoods || savedFoods.length === 0){
        return res.status(404).json({
            message:"No saved foods found"
        })
    }

    res.status(200).json({
        message:"Saved foods retrieve successfully",
        savedFoods
    })
    
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
