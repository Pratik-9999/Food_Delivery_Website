const mongoose = require('mongoose');

const ItalianSchema = new mongoose.Schema({
    
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

const ItalianModel = mongoose.model("Italiancategory", ItalianSchema);

module.exports = ItalianModel;