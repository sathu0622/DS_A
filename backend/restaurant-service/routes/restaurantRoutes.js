const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth.verifyToken, controller.addRestaurant);
router.patch('/:id/availability', auth.verifyToken, controller.updateAvailability);

router.get('/', controller.getAllRestaurants);
module.exports = router;
