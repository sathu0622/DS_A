const express = require('express');
const router = express.Router();
const { applyPromoCode, getPromoCodesByUserId } = require('../controllers/promoController');
// const { auth, authorize } = require ("../middleware/roleMiddleware")

// Apply a promo code
router.post('/apply-promo',applyPromoCode);
router.get('/promo-codes/:userId',getPromoCodesByUserId);

module.exports = router;
