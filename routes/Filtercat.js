const express = require('express');
const VegModel = require('../models/categories/VegModel');
const SouthIndianModel = require('../models/categories/SouthIndianModel');
const ItalianModel = require('../models/categories/ItalianModel');
const NonVegModel = require('../models/categories/NonVegModel');

const router = express.Router();

// Map category names to their corresponding models
const categoryModels = {
    'Veg': VegModel,
    'Non-Veg': NonVegModel,
    'South Indian': SouthIndianModel,
    'Italian': ItalianModel,
    // Add more categories and models as needed
};

router.get('/filter', async (req, res) => {
    console.log(req.query);
    const { category, minPrice, maxPrice, search } = req.query;
    let query = {};
    let searchs = category;

    // Build the price range query
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Add search query for product name and description
    if (typeof searchs === 'string' && searchs.trim() !== '') {
        const searchRegex = new RegExp(searchs.trim(), 'i');
        query.$or = [
            { name: searchRegex }, // Search by name
            { Description: searchRegex } // Search by description
        ];
    }

    console.log(searchs);

    let filteredItems = [];
    try {
        if (category && categoryModels[category]) {
            // If a valid category is found, filter using that model
            console.log(query);
            filteredItems = await categoryModels[category].find(query);
        } else {
            // If category is invalid or not provided, search across all categories
            const models = Object.values(categoryModels);
            const queries = models.map(model => model.find(query));
            filteredItems = (await Promise.all(queries)).flat();
        }

        // Pagination logic
        const limit = 4;
        const totalPages = Math.ceil(filteredItems.length / limit);

        // Render results or send response
        res.render('filtercat', { allfood: filteredItems, totalPages, limit });
        // No need to log `allfood` after rendering
    } catch (error) {
        console.error('Error fetching food items:', error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
});

module.exports = router;


