const PendingOrder = require("../models/PendingOrder");
const AddToCart = require("../models/addtocart");

exports.createPendingOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, address, paymentOption, status } = req.body;

    const pendingOrder = new PendingOrder({
      userId,
      restaurantId,
      items,
      address,
      paymentOption,
      status,
    });
    await pendingOrder.save();

    await AddToCart.deleteMany({ userId, restaurantId });

    res.status(201).json({ message: "Order placed successfully", pendingOrder });
  } catch (error) {
    console.error("Error creating pending order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};