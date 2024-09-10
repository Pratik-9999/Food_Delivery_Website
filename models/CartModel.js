const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    fooditemId: {
        type: String,
        //required: true
    },
    paymentStatus: {
        type: Boolean,
        required: true
    },
    timeStamp: {
        type: Date
    },

});

const CartModel = mongoose.model("cart",CartSchema);

module.exports = CartModel;