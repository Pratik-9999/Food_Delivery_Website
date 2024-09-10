const mongoose = require('mongoose');

const VegSchema = new mongoose.Schema({
    
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

const VegModel = mongoose.model("vegcategory", VegSchema);

module.exports = VegModel;