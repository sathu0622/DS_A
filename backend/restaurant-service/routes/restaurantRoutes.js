const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/authMiddleware');

// Add a new restaurant
router.post('/', auth.verifyToken, restaurantController.addRestaurant);

// Update a restaurant
router.put('/:id', auth.verifyToken, restaurantController.updateRestaurant);

// Delete a restaurant
router.delete('/:id', auth.verifyToken, restaurantController.deleteRestaurant);

// Get all restaurants
router.get('/', restaurantController.getAllRestaurants);

// Get restaurants by logged-in owner
router.get('/owner', auth.verifyToken, restaurantController.getRestaurantsByOwner);


router.patch('/:id/availability', auth.verifyToken, restaurantController.toggleAvailability);



module.exports = router;
