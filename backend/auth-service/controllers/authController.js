// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   try {
//     const { username, password, phone, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword,phone, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully.' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) return res.status(404).json({ error: 'User not found.' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ error: 'Invalid password.' });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '6h' }
//     );

//     res.json({ token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Make sure this line is at the top

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  try {
    const { email, password, phone, role } = req.body;

    if (!email || !password || !phone || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      phone,
      role,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Verify your Email",
      text: `Your OTP code is ${otp}`,
    });

    res.json({ msg: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ msg: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Please verify your email first" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};


exports.updateLocation = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ msg: 'Location is required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { location },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'Location updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);


    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ location: user.location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);


    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ location: user.location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


