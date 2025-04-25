const Restaurant = require('../models/Restaurant');

// Add a restaurant
exports.addRestaurant = async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const ownerId = req.user.userId; 

    const newRestaurant = new Restaurant({
      name,
      description,
      location,
      ownerId
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get restaurants by owner
exports.getRestaurantsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const restaurants = await Restaurant.find({ ownerId });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
