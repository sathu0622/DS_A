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

exports.updatePendingOrderStatus = async (req, res) => {
  const orderId = req.params.id;

  try {
    const updatedOrder = await PendingOrder.findByIdAndUpdate(
      orderId,
      { status: "Processing" }, // still hardcoded
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated to Processing",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
