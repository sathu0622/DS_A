const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
// const { auth, authorize } = require ("../middleware/roleMiddleware")

router.post('/save-payment',paymentController.savePaymentDetails);

router.get('/',paymentController.getAllPayments);

router.get('/user/:userId', paymentController.getUserPayments);

router.get('/restaurant/:restaurantId', paymentController.getRestaurantPayments);


module.exports = router;
