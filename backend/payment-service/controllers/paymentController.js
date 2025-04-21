const Payment = require('../models/Payment');
// const User = require('../models/User');
const { sendEmail, sendSMS } = require('../utils/notification');


exports.savePaymentDetails = async (req, res) => {
  try {
    const {
      userId,
      restaurantId,
      orderId,
      stripePaymentId,
      stripeCustomerId,
      amount,
      status,
    } = req.body;

    const payment = new Payment({
      userId,
      restaurantId,
      orderId,
      stripePaymentId,
      stripeCustomerId,
      amount,
      status,
    });

    await payment.save();

    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    // await sendEmail(
    //   user.email,
    //   'Payment Confirmation',
    //   `Hi ${user.name}, your payment of ${amount / 100}`
    // );

    // await sendSMS(
    //   user.phone,
    //   `Hi ${user.name}, your payment of ${amount / 100}`
    // );

    res.status(201).json(payment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



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
  
  // Get all payments for a specific restaurant
exports.getRestaurantPayments = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const payments = await Payment.find({ restaurantId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
