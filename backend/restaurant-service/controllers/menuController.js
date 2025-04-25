const MenuItem = require('../models/MenuItem');

exports.getAllMenuItem = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
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
