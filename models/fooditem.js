const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    
    Description: {
        type: String,
        required: true,
    },
    fooditemId:{ 
        type: String,
    },
    price: {
        type: Number
    },
    imgBuffer: {
        type: String,
        required: true
    },
    category: {
        type: String
    },

});

const fooditem = mongoose.model("fooditem", foodItemSchema);

module.exports = fooditem;