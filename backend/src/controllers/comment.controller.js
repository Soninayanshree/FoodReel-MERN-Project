
const commentModel = require("../models/comment.model");
const foodModel = require("../models/food.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

//add comment
const addComment = asyncHandler( async(req, res) => {
    const { foodId, text } = req.body;
    const user = req.user;

    // Check if comment text is empty
    if (!text || !text.trim()) {
      throw new ApiError(400, "Comment text cannot be empty");
    }

    // Check if food exists in database
    const food = await foodModel.findById(foodId);

    if (!food) {
      throw new ApiError(404, "Food not found");
    }

    // Add comment to DB
    const comment = await commentModel.create({
      user: user._id,
      food: foodId,
      text: text.trim(),
    });

    // Increase comment count on food
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { commentCount: 1 }
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
});

//get comments
const getComments = asyncHandler(async(req, res) => {
    const { foodId } = req.params;

    // Check if food exists in database
    const food = await foodModel.findById(foodId);

    if (!food) {
      throw new ApiError(404, "Food not found");
    }

    // Fetch comments with user details
    const comments = await commentModel
      .find({ food: foodId })
      .populate("user", "fullName email") // only send safe user fields
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
});

module.exports = {
  addComment,
  getComments
};
