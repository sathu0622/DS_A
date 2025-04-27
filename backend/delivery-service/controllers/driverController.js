// controllers/driverController.js
const Driver = require('../models/Driver');

const updateDriverLocation = async (req, res) => {
	try {
		const { driverId, location } = req.body;

		if (!driverId || !location) {
			return res.status(400).json({ error: 'driverId and location are required' });
		}

		const updatedDriver = await Driver.findByIdAndUpdate(
			driverId,
			{ currentLocation: location, updatedAt: new Date() },
			{ new: true }
		);

		if (!updatedDriver) return res.status(404).json({ error: 'Driver not found' });

		res.json({ message: 'Location updated successfully', driver: updatedDriver });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getDriverLocation = async (req, res) => {
	try {
		const { driverId } = req.params;

		const driver = await Driver.findById(driverId);

		if (!driver) return res.status(404).json({ error: 'Driver not found' });

		res.json({ location: driver.currentLocation, updatedAt: driver.updatedAt });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = {
	updateDriverLocation,
	getDriverLocation
};
