const express = require("express");
const authController = require("../controllers/auth.controller");
const validateRequest = require("../middlewares/validateRequest.middleware");
const {
  registerFoodPartnerSchema,
  loginFoodPartnerSchema,
} = require("../validations/request.validation");

const router =express.Router();

//user auth api
router.post("/user/register",authController.registerUser);
router.post("/user/login",authController.loginUser);
router.post("/user/logout",authController.logoutUser);

//food partner auth api
router.post("/food-partner/register",validateRequest(registerFoodPartnerSchema),authController.registerFoodPartner);
router.post("/food-partner/login",validateRequest(loginFoodPartnerSchema),authController.loginFoodPartner);
router.post("/food-partner/logout",authController.logoutFoodPartner);
module.exports = router;