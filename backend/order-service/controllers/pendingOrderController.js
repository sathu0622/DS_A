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

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all orders for the user
    const orders = await PendingOrder.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};