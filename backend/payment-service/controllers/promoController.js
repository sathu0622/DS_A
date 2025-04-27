const PromoCode = require('../models/PromoCode');

exports.applyPromoCode = async (req, res) => {
  try {
    const { userId, promoCode } = req.body;

    const promo = await PromoCode.findOne({ code: promoCode });

    if (!promo) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    if (promo.used) {
      return res.status(400).json({ error: 'Promo code already used' });
    }

    if (promo.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Promo code does not belong to this user' });
    }

    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return res.status(400).json({ error: 'Promo code expired' });
    }

    // ✅ Mark as used
    promo.used = true;
    await promo.save();

    res.status(200).json({
      message: 'Promo code is valid and marked as used',
      discountPercentage: promo.discountPercentage,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPromoCodesByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a route parameter

    // Find all promo codes for this user
    const promoCodes = await PromoCode.find({ userId: userId });

    if (promoCodes.length === 0) {
      return res.status(404).json({ error: 'No promo codes found for this user' });
    }

    res.status(200).json({
      message: 'Promo codes retrieved successfully',
      promoCodes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};