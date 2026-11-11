const mongoose = require("mongoose");
const commentModel = require("../models/comment.model");
const foodModel = require("../models/food.model");

async function addComment(req, res){
  try {
    const { foodId, text } = req.body;
    const user = req.user;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    // Add comment to DB
    const comment = await commentModel.create({
      user: user._id,
      food: foodId,
      text,
    });

    // Increase comment count on food
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { commentCount: 1 }
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

async function getComments (req, res){
  try {
    const { foodId } = req.params;

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    const comments = await commentModel
      .find({ food: foodId })
      .populate("user", "fullName email")  // only send safe user fields
      .sort({ createdAt: -1 });       // latest first

    res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
    addComment,
    getComments
}