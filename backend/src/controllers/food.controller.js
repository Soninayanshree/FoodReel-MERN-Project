const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const storageService = require("../services/storage.service");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { v4: uuid } = require("uuid"); // Generate unique identifiers

//create food item
const createFood = asyncHandler(async (req, res) => {
  // Get idempotency key from request header
  const idempotencyKey = req.headers["idempotency-key"];

  // Check if idempotency key is provided
  if (!idempotencyKey) {
    throw new ApiError(400, "Idempotency key is required in the request header");
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
  // Upload file to storage service
  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid()
  );

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
  });
});

//get all food items
const getFoodItems = asyncHandler(async (req, res) => {
  // Fetch all food items from the database
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
});

//like food item
const likeFood = asyncHandler(async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;

  // Check if food exists in database
  const food = await foodModel.findById(foodId);

  if (!food) {
    throw new ApiError(404, "Food not found");
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
});

//save food item
const saveFood = asyncHandler(async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;

  // Check if food exists in database
  const food = await foodModel.findById(foodId);

  if (!food) {
    throw new ApiError(404, "Food not found");
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
});

//get saved food items
const getSaveFood = asyncHandler(async (req, res) => {
  const user = req.user;
  const savedFoods = await saveModel.find({ user: user._id }).populate('food')

  if (!savedFoods || savedFoods.length === 0) {
    throw new ApiError(404, "No saved foods found");
  }

  res.status(200).json({
    message: "Saved foods retrieve successfully",
    savedFoods
  })

});

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
