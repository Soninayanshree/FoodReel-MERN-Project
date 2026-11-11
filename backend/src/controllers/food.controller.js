const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid"); // Generate unique identifiers

async function createFood(req, res, next) {
  // console.log(req.foodPartner);
  // console.log(req.body);
  // console.log(req.file); // Access the uploaded video file
  try {
    // Get idempotency key from request header
    const idempotencyKey = req.headers["idempotency-key"];

    // Check if idempotency key is provided
    if (!idempotencyKey) {
      const error = new Error("Idempotency-Key header is required");
      error.statusCode = 400;
      return next(error);
    }

    // Check if this request was already processed
    const existingFood = await foodModel.findOne({
    foodPartner: req.foodPartner._id,
    idempotencyKey
});

    if (existingFood) {
      return res.status(200).json({
        message: "Food item already created",
        food: existingFood,
      });
    }

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
    idempotencyKey,
  });

  res.status(201).json({
    message: "Food item created successfully",
    food: foodItem, // Return the created food item
  });}catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({}); // Fetch all food items from the database
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}


async function likeFood(req, res, next) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    // Check if food exists in database
    const food = await foodModel.findById(foodId);

    if (!food) {
      const error = new Error("Food not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if user has already liked this food
    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    // If already liked, remove the like
    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        user: user._id,
        food: foodId,
      });

      // Decrease like count
      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });

      return res.status(200).json({
        message: "Food unliked successfully",
        liked: false,
      });
    }

    // Create a new like
    await likeModel.create({
      user: user._id,
      food: foodId,
    });

    // Increase like count
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: 1 },
    });

    return res.status(201).json({
      message: "Food liked successfully",
      liked: true,
    });

  } catch (err) {
    next(err);
  }
}



async function saveFood(req, res, next) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    // Check if food exists in database
    const food = await foodModel.findById(foodId);

    if (!food) {
      const error = new Error("Food not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if user has already saved this food
    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId,
    });

    // If already saved, remove it from saved foods
    if (isAlreadySaved) {
      await saveModel.deleteOne({
        user: user._id,
        food: foodId,
      });

      // Decrease save count
      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: -1 },
      });

      return res.status(200).json({
        message: "Food unsaved successfully",
        saved: false,
      });
    }

    // Create a new save
    await saveModel.create({
      user: user._id,
      food: foodId,
    });

    // Increase save count
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { savesCount: 1 },
    });

    return res.status(201).json({
      message: "Food saved successfully",
      saved: true,
    });

  } catch (err) {
    next(err);
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
