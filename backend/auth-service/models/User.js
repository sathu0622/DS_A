const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  phone: { type: String, required: true, unique: true },
  location:{type: String},
  role: { type: String, enum: ['driver', 'restaurant', 'customer'], required: true },
});

module.exports = mongoose.model('User', userSchema);
