const express = require('express');
const Coupon = require('../models/CouponModel'); // Adjust the path according to your project structure
const router = express.Router();



router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
    console.log(req.body);
    const { couponCode } = req.body;
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
        req.flash('error', 'Invalid coupon code');
        return res.redirect('/cart');
    }

    if (coupon.expiryDate < Date.now()) {
        req.flash('error', 'Coupon has expired');
        return res.redirect('/cart');
    }

    const discount = coupon.discount;
    const totalAmount = req.session.cart.totalAmount;
    const discountedAmount = totalAmount - (totalAmount * discount / 100);

    req.session.cart.discountedAmount = discountedAmount;
    req.session.cart.couponApplied = couponCode;

    req.flash('success', `Coupon applied! Your discounted amount is $${discountedAmount}`);
    res.redirect('/cart');
});

router.get('/', (req, res) => {
    // Example logic to determine discount and total
    let discountAmount = null;
    let discountedTotal = null;

    const totalAmount = 200; // Example original total
    const applyDiscount = true; // Example condition

    if (applyDiscount) {
        discountAmount = 25; // Example discount
        discountedTotal = totalAmount - discountAmount;
    }

    res.render('cart', {
        discountAmount: discountAmount,
        discountedTotal: discountedTotal,
        totalAmount: totalAmount
    });
});

module.exports = router;