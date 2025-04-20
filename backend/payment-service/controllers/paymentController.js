const Payment = require('../models/Payment');
const User = require('../models/User');
const { sendEmail, sendSMS } = require('../utils/notification');

exports.savePaymentDetails = async (req, res) => {
  try {
    const {
      userId,
      stripePaymentId,
      stripeCustomerId,
      amount,
      status,
    } = req.body;

    const payment = new Payment({
      userId,
      stripePaymentId,
      stripeCustomerId,
      amount,
      status,
    });

    await payment.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send email
    await sendEmail(
      user.email,
      'Payment Confirmation',
      `Hi ${user.name}, your payment of ${amount / 100}`
    );

    // Send SMS
    await sendSMS(
      user.phone,
      `Hi ${user.name}, your payment of ${amount / 100}`
    );

    res.status(201).json(payment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// controllers/paymentController.js

// Get all payments (for admin or internal dashboard)
exports.getAllPayments = async (req, res) => {
    try {
      const payments = await Payment.find().populate('userId', 'name email');
      res.status(200).json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Get payments for a specific user
  exports.getUserPayments = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  