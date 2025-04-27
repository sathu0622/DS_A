const express = require('express');
const router = express.Router();
const { getDeliveryTrackingInfo } = require('../controllers/deliveryTrackingController');

router.get('/', getDeliveryTrackingInfo);

module.exports = router;
