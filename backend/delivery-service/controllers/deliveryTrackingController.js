const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Driver = require('../models/Driver');

const getDeliveryTrackingInfo = async (req, res) => {
	try {
	  const { userId, restaurantId } = req.query;
  
	  if (!userId && !restaurantId) {
		return res.status(400).json({ error: 'At least one of userId or restaurantId is required' });
	  }
  
	  let customerLocation = null;
	  let restaurantLocation = null;
  
	  // Check if userId is provided and fetch customer location
	  if (userId) {
		const user = await User.findById(userId);
		if (!user) {
		  return res.status(404).json({ error: 'User not found' });
		}
		customerLocation = user.location;
	  }
  
	  // Check if restaurantId is provided and fetch restaurant location
	  if (restaurantId) {
		const restaurant = await Restaurant.findById(restaurantId);
		if (!restaurant) {
		  return res.status(404).json({ error: 'Restaurant not found' });
		}
		restaurantLocation = restaurant.location;
	  }
  
	  // Send a combined response with both customer and restaurant locations
	  res.json({
		customerLocation,
		restaurantLocation,
	  });
  
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: 'Internal server error' });
	}
  };
  

module.exports = {
	getDeliveryTrackingInfo
};
