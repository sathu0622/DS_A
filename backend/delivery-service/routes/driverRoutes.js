const express = require('express');
const router = express.Router();
const {
	updateDriverLocation,
	getDriverLocation
} = require('../controllers/driverController');

router.post('/update-location', updateDriverLocation);
router.get('/:driverId/location', getDriverLocation);

module.exports = router;
