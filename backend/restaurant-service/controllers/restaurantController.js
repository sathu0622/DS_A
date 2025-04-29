const Restaurant = require('../models/Restaurant');

// Add a restaurant
exports.addRestaurant = async (req, res) => {
  try {
    const { name, description, location, isAvailable } = req.body;
    const ownerId = req.user.userId; 

    const newRestaurant = new Restaurant({
      name,
      description,
      location,
      isAvailable,
      image: req.file ? req.file.filename : null, // store the filename
      ownerId
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json({
      ...savedRestaurant._doc,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null, // send URL if needed
    });
  } catch (error) {
    console.error('Error while adding restaurant:', error); // add this
    res.status(500).json({ error: error.message });}  
};

/*// Update a restaurant
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
*/
// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
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

exports.getRestaurantsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.userId; 

    const restaurants = await Restaurant.find({ ownerId });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/restaurants/:id
exports.updateRestaurant = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/restaurants/:id
exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// controllers/restaurantController.js
exports.toggleAvailability = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Make sure the logged-in owner is the same as the restaurant's owner
    if (restaurant.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    restaurant.isAvailable = !restaurant.isAvailable;
    await restaurant.save();

    res.json({ message: 'Availability updated', isAvailable: restaurant.isAvailable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  res.status(200).json(restaurant);
};

const mongoose = require('mongoose');

exports.getRestaurantsByOwnerId = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.params.ownerId);


    const restaurants = await Restaurant.find({ ownerId });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantimageById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Construct the image URL if an image exists
    const imageUrl = restaurant.image ? `${req.protocol}://${req.get("host")}/uploads/${restaurant.image}` : null;

    // Return the image URL
    res.status(200).json({
      imageUrl,
    });
  } catch (error) {
    console.error("Error fetching restaurant image by ID:", error);
    res.status(500).json({ error: error.message });
  }
};
