
const { z } = require("zod");

// Food Partner registration validation
const registerFoodPartnerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Invalid email address"),
    contact: z
      .string()
      .trim()
      .regex(
        /^(?:\+91[\s-]?)?[6-9]\d{9}$/,
        "Enter a valid 10-digit mobile number with optional +91 country code"
      ),
    address: z.string().trim().min(1, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// Food Partner login validation
const loginFoodPartnerSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

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
  registerFoodPartnerSchema,
  loginFoodPartnerSchema,
  foodIdSchema,
  foodUploadSchema,
  foodIdBodySchema,
  addCommentSchema,
  foodIdParamsSchema,
};
