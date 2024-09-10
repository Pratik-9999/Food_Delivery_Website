const mongoose = require('mongoose');

const SouthIndianSchema = new mongoose.Schema({
    
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

const SouthIndianModel = mongoose.model("SouthIndiancategory", SouthIndianSchema);

module.exports = SouthIndianModel;