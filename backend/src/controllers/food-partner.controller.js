const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getFoodPartnerById = asyncHandler(async (req, res) => {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    if (!foodPartner) {
        throw new ApiError(404, "Food partner not found");
    }
    const foodItemsByFoodPArtner = await foodModel.find({ foodPartner: foodPartnerId })

    res.status(200).json({
        message: "food partner retrieve successfully",
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
            contact: foodPartner.contact,
            address: foodPartner.address,
            foodItems: foodItemsByFoodPArtner
        }
    });
});

module.exports = {
    getFoodPartnerById
}