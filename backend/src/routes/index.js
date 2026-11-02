//Centralize API route registration
const express = require("express");

const authRoutes = require("./auth.routes");
const foodRoutes = require("./food.routes");
const commentRoutes = require("./comment.routes");
const foodPartnerRoutes = require("./food-partner.routes");

const router = express.Router();

// Authentication
router.use("/auth", authRoutes);

// Food management
router.use("/food", foodRoutes);

// Food partners
router.use("/food-partner", foodPartnerRoutes);

// Comments
router.use("/", commentRoutes);

module.exports = router;