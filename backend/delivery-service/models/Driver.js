const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	name: String,
	isAvailable: { type: Boolean, default: true },
	currentLocation: {
		lat: Number,
		lng: Number
	},
	updatedAt: Date
});

module.exports = mongoose.model('Driver', driverSchema);
