const express = require('express');
const router = express.Router();
const { applyPromoCode } = require('../controllers/promoController');

// Apply a promo code
router.post('/apply-promo', applyPromoCode);

module.exports = router;
