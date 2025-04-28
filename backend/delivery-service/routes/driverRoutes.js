const express = require('express');
const router = express.Router();
const {
	updateDriverLocation,
	getDriverLocation,
	getPendingOrders
} = require('../controllers/driverController');

router.post('/update-location', updateDriverLocation);
router.get('/:driverId/location', getDriverLocation);
router.get('/getOrders', getDriverLocation);

module.exports = router;
