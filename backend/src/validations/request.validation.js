
const { z } = require("zod");

// Reusable MongoDB Food ID validation
const foodIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid Food ID");

// Food upload validation
const foodUploadSchema = z.object({
  body: z.object({
    name: z.string().refine(
      (value) => value.trim().length > 0,
      "Food name is required"
    ),

    description: z.string().refine(
      (value) => value.trim().length > 0,
      "Food description is required"
    ),
  }),
});

// Like and Save validation
const foodIdBodySchema = z.object({
  body: z.object({
    foodId: foodIdSchema,
  }),
});

// Add comment validation
const addCommentSchema = z.object({
  body: z.object({
    foodId: foodIdSchema,

    text: z.string().refine(
      (value) => value.trim().length > 0,
      "Comment cannot be empty"
    ),
  }),
});

// Get comments validation
const foodIdParamsSchema = z.object({
  params: z.object({
    foodId: foodIdSchema,
  }),
});

module.exports = {
  foodUploadSchema,
  foodIdBodySchema,
  addCommentSchema,
  foodIdParamsSchema,
};
