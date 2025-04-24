const Payment = require('../models/Payment');
// const User = require('../models/User');
const { sendEmail, sendSMS } = require('../utils/notification');
const PromoCode = require('../models/PromoCode');
const crypto = require('crypto');

// exports.savePaymentDetails = async (req, res) => {
//   try {
//     const {
//       userId,
//       restaurantId,
//       orderId,
//       stripePaymentId,
//       stripeCustomerId,
//       amount,
//       status,
//     } = req.body;

//     const payment = new Payment({
//       userId,
//       restaurantId,
//       orderId,
//       stripePaymentId,
//       stripeCustomerId,
//       amount,
//       status,
//     });

//     await payment.save();

//     // const user = await User.findById(userId);
//     // if (!user) {
//     //   return res.status(404).json({ error: 'User not found' });
//     // }

//     // await sendEmail(
//     //   user.email,
//     //   'Payment Confirmation',
//     //   `Hi ${user.name}, your payment of ${amount / 100}`
//     // );

//     // await sendSMS(
//     //   user.phone,
//     //   `Hi ${user.name}, your payment of ${amount / 100}`
//     // );

//     res.status(201).json(payment);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


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

    let promoCode = null;

    if (amount > 5000) {
      const code = 'SAVE20-' + crypto.randomBytes(3).toString('hex').toUpperCase();
      promoCode = new PromoCode({
        code,
        discountPercentage: 20,
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
      });
      await promoCode.save();
    }

    // const user = await User.findById(userId);
    // if (user) {
    //   await sendEmail(user.email, 'Payment Confirmation', `Hi ${user.name}, your payment of ${amount / 100} was successful.`);
    //   if (promoCode) {
    //     await sendEmail(user.email, 'You earned a promo code!', `Congrats ${user.name}, use code ${promoCode.code} to get 20% off on your next order!`);
    //   }
    // }

    res.status(201).json({
      message: 'Payment saved successfully',
      payment,
      promoCode: promoCode ? promoCode.code : null,
    });

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
