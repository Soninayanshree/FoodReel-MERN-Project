const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    food:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        require: true
    }, 
},{
    timestamps: true
})

// Prevent duplicate saves by the same user on the same food
saveSchema.index(
    { user: 1, food: 1 },
    { unique: true }
);

const saveModel = mongoose.model('save',saveSchema);

module.exports = saveModel;