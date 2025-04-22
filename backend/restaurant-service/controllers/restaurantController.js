const Restaurant = require('../models/Restaurant');

exports.addRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant({ ...req.body, ownerId: req.user.id });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { isAvailable: req.body.isAvailable }, { new: true });
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
