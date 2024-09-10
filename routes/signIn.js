const express = require('express');
const User = require('../models/user');
const Food = require('../models/fooditem'); // Assuming you have a Food model
const router = express.Router();
const SECRET_KEY = "pratik@139eu2";
const jwt = require('jsonwebtoken');

// Constants for pagination
const ITEMS_PER_PAGE = 10; // Set the limit value here

// Render the signIn page
router.get('/', (req, res) => {
    res.render('signIn');
});

// Handle the login form submission
router.post("/submit", async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundRecord = await User.findOne({ 'email': email });

        if (!foundRecord) {
            return res.send('User does not exist');
        }

        if (foundRecord.password === password) {
            const originalId = foundRecord._id.toHexString();
            const token = await jwt.sign(originalId, SECRET_KEY);
            res.cookie('fooditem', token);

            // Fetch food items from the database
            const allfood = await Food.find({}); // Replace with your actual query to fetch food items

            // Calculate total pages for pagination
            const totalItems = allfood.length;
            const totalPages = Math.ceil(totalItems / 3);
            const currentPage = 1; // Set default page to 1

            // Render the profile page with the fetched food items and pagination details
            return res.render("profile", {
                allfood: allfood,
                totalPages: totalPages,
                currentPage: currentPage,
                limit: 3 // Pass the limit value to the template
            });
        } else {
            return res.send('Invalid password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
