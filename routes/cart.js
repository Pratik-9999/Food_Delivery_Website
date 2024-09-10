const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const CartModel = require('../models/CartModel');
const fooditem = require('../models/fooditem');
const addfood = require('./addfood');
const cart = require('../models/CartModel');
const CouponModel = require('../models/CouponModel');
const mongoose = require('mongoose');  

const router = express.Router();





router.get('/', async (req, res) => {
    let allfood = [];
    let totalPrice = 0;
    let discount = 0;
    let totalAmount = 0;

    try {
        const userId = req.payload;
        console.log('User ID:', userId);

        // Fetch all items in the cart for the current user
        const cartAllData = await CartModel.find({ userId: userId });
        console.log('Cart Data:', cartAllData);

        // For each cart item, fetch the corresponding food item details
        const promises = cartAllData.map(async (cartItem) => {
            const fooditemId = cartItem.fooditemId;
            console.log('Processing fooditemId:', fooditemId);

            // Query fooditem using fooditemId
            const foodItem = await fooditem.findOne({ fooditemId: fooditemId });

            if (!foodItem) {
                console.error(`Food item not found for ID: ${fooditemId}`);
            } else {
                console.log('Retrieved food item:', foodItem);
                allfood.push(foodItem);
            }
        });

        // Wait for all the food items to be fetched
        await Promise.all(promises);

        // Filter out any null or undefined food items
        allfood = allfood.filter(item => item !== null && item !== undefined);

        // Calculate the total price after filtering
        allfood.forEach((food) => {
            totalPrice += food.price;
        });

    } catch (error) {
        console.error('Error fetching cart data:', error);
        return res.render('cart', { allfood, totalPrice, discount, totalAmount });
    }

    // Render the cart page with the fetched data
    res.render('cart', { allfood, totalPrice, discount, totalAmount });
});

router.post('/AddToCart', async (req, res) => {
    const result = await CartModel.create({
        userId: req.payload,
        fooditemId: req.body.productId,
        paymentStatus: false,
        timestamp: new Date(),
    });
    res.status(200).redirect('/cart');
});

router.post('/remove', async (req, res) => {
    try {
        await cart.deleteOne({ fooditemId: req.body.fooditemId, userId: req.payload });
    } catch (e) {
        return res.status(500).json({
            status: "failed",
            message: e.message
        });
    }
    res.status(200).redirect('/cart');
});


module.exports = router;


