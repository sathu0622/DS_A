const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

exports.getAllMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const filter = restaurantId ? { restaurantId } : {};
    const menuItems = await MenuItem.find(filter);
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, availability, restaurantId } = req.body;

    const newItem = new MenuItem({
      name,
      description,
      price,
      availability,
      restaurantId,
      image: req.file ? req.file.filename : null, // store the filename
    });

    await newItem.save();

    res.status(201).json({
      ...newItem._doc,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null, // send URL if needed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOwnerMenuItems = async (req, res) => {
  try {
    const ownerId = req.user.userId; 

    // Find all restaurants owned by the logged-in user
    const ownedRestaurants = await Restaurant.find({ ownerId });

    
    const restaurantIds = ownedRestaurants.map(r => r._id);

    
    const menuItems = await MenuItem.find({ restaurantId: { $in: restaurantIds } });

    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

