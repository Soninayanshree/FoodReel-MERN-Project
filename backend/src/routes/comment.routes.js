const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { addComment, getComments } = require("../controllers/comment.controller");
const validateRequest = require("../middlewares/validateRequest.middleware");

const {
  addCommentSchema,
  foodIdParamsSchema,
} = require("../validations/request.validation");

// POST /api/comment
router.post("/comment", authMiddleware.authUserMiddleware,validateRequest(addCommentSchema), addComment);

// GET /api/comments/:foodId
router.get("/comments/:foodId", validateRequest(foodIdParamsSchema), getComments);

module.exports = router;
