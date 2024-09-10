const mongoose = require('mongoose');

const NonVegSchema = new mongoose.Schema({
    
    Description: {
        type: String,
        required: true,
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

const NonVegModel = mongoose.model("NonVegcategory", NonVegSchema);

module.exports = NonVegModel;