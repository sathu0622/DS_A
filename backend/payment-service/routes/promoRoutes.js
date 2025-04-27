const express = require('express');
const router = express.Router();
const { applyPromoCode, getPromoCodesByUserId } = require('../controllers/promoController');

// Apply a promo code
router.post('/apply-promo', applyPromoCode);
router.get('/promo-codes/:userId', getPromoCodesByUserId);

module.exports = router;
