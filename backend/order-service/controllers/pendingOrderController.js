const PendingOrder = require("../models/PendingOrder");
const AddToCart = require("../models/addtocart");

exports.createPendingOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, address } = req.body; 

    // Save the pending order
    const pendingOrder = new PendingOrder({ userId, restaurantId, items, address });
    await pendingOrder.save();

    // Delete the cart items for the user
    await AddToCart.deleteMany({ userId });

    res.status(201).json({ message: "Order placed successfully", pendingOrder });
  } catch (error) {
    console.error("Error creating pending order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};