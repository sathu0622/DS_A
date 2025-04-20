// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Save payment details (you can call this via webhook or client after confirmation)
router.post('/save-payment', paymentController.savePaymentDetails);
// Get all payments (admin)
router.get('/', paymentController.getAllPayments);

// Get payments for a specific user
router.get('/user/:userId', paymentController.getUserPayments);


module.exports = router;
