const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  password: {   
    type: String,
    required: true,
  },

});

const foodPartnerModel = mongoose.model('foodpartner', foodPartnerSchema);

module.exports = foodPartnerModel;
