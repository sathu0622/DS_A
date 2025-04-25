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
