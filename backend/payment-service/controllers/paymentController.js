const Payment = require('../models/Payment');
const { sendEmail, sendSMS} = require('../utils/notification');
const PromoCode = require('../models/PromoCode');
const crypto = require('crypto');
const axios = require('axios');



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

let user = null;
try {
  const response = await axios.get(`http://localhost:5000/api/auth/users/all/${userId}`);
  user = response.data; 
} catch (error) {
  console.error('Failed to fetch user:', error.message);
}

if (user) {
  await sendEmail(user.email, 'Payment Confirmation', `Hi ${user.name}, your payment of ${amount} was successful.`);

  // Send SMS confirmation
  if (user.phone) { 
    await sendSMS(user.phone, `Hi ${user.name}, your payment of $${amount / 100} was successful!`);
  } else {
    console.log('⚠️ No phone number found for user, skipping SMS.');
  }

  if (promoCode) {
    await sendEmail(user.email, 'You earned a promo code!', `Congrats ${user.name}, use code ${promoCode.code} to get 20% off on your next order!`);
    
    if (user.phone) {
      await sendSMS(user.phone, `Congrats ${user.name}! Use code ${promoCode.code} to get 20% off your next order!`);
    }
  }
}


    res.status(201).json({
      message: 'Payment saved successfully',
      payment,
      promoCode: promoCode ? promoCode.code : null,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
