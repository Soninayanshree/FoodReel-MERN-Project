const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const foodController = require("../controllers/food.controller");
const router = express.Router();
const multer = require("multer"); //import multer for file upload
const validateFoodId = require("../middlewares/validateFoodId.middleware");


//configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
});

/* POST /api/food/ [protected]*/

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);
//here we are using the authFoodPartnerMiddleware to protect the route and then calling the createFood controller function to handle the request.The upload.single("video") middleware will process the incoming request and store the uploaded file in req.file

router.get(
    "/",
    foodController.getFoodItems);

router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  validateFoodId,
  foodController.likeFood
);

router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  validateFoodId,
  foodController.saveFood
);

router.get(
  "/save",
  authMiddleware.authUserMiddleware,
  validateFoodId,
  foodController.getSaveFood
);

module.exports = router;
