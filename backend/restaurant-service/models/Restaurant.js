const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  isAvailable: { type: Boolean, default: true },
  ownerId: String, //the user who registered
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
