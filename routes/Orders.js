const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Middleware to parse request body
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Place an Order
router.post('/', async (req, res) => {
  //console.log('Request Body:', req.body); // Debug log
  const { userId, totalAmount, deliveryAddress } = req.body;

  // Log individual fields to debug
  // console.log('userId:', userId);
  // console.log('totalAmount:', totalAmount);
  // console.log('deliveryAddress:', deliveryAddress);

  

  try {
    //console.log(req.payload);
    
    const newOrder = new Order({
      userId: req.payload,
      totalAmount,
      deliveryAddress,
    });

    const order = await newOrder.save();

    // Send a confirmation (for now, we'll just log it)
    //console.log(`Order confirmation sent for order ID: ${order._id}`);

    res.redirect('/');
    //res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
