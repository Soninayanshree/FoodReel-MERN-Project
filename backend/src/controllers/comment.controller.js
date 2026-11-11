
const commentModel = require("../models/comment.model");
const foodModel = require("../models/food.model");

async function addComment(req, res, next) {
  try {
    const { foodId, text } = req.body;
    const user = req.user;

    // Check if comment text is empty
    if (!text || !text.trim()) {
      const error = new Error("Comment cannot be empty");
      error.statusCode = 400;
      return next(error);
    }

    // Check if food exists in database
    const food = await foodModel.findById(foodId);

    if (!food) {
      const error = new Error("Food not found");
      error.statusCode = 404;
      return next(error);
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

  } catch (error) {
    next(error);
  }
}

async function getComments(req, res, next) {
  try {
    const { foodId } = req.params;

    // Check if food exists in database
    const food = await foodModel.findById(foodId);

    if (!food) {
      const error = new Error("Food not found");
      error.statusCode = 404;
      return next(error);
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

  } catch (error) {
    next(error);
  }
}

module.exports = {
  addComment,
  getComments
};
