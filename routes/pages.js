const express = require('express');
const router = express.Router();
const FoodItem = require('../models/fooditem'); // Ensure the model is correctly named

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  console.log('ok');
  try {
    const foodItems = await FoodItem.find().skip(skip).limit(limit).exec();
    const count = await FoodItem.countDocuments();

    res.render('index', {
      allfood: foodItems,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      limit: limit // Pass the limit variable here
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
