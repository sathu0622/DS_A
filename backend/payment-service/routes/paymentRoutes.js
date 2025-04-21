const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/save-payment', paymentController.savePaymentDetails);

router.get('/', paymentController.getAllPayments);

router.get('/user/:userId', paymentController.getUserPayments);

router.get('/restaurant/:restaurantId', paymentController.getRestaurantPayments);


module.exports = router;
