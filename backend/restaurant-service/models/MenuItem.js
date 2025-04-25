const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  name: String,
  description: String,
  price: Number,
  availability: { type: Boolean, default: true },
  image: { type: String },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
