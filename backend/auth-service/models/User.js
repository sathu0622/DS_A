const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'restaurant','customer'], required: true }
});

module.exports = mongoose.model('User', userSchema);
