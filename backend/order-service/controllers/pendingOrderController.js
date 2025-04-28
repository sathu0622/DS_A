const PendingOrder = require("../models/PendingOrder");
const AddToCart = require("../models/addtocart");

exports.createPendingOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, address, paymentOption, totalAmount, status } = req.body;

    const pendingOrder = new PendingOrder({
      userId,
      restaurantId,
      items,
      address,
      paymentOption,
      totalAmount,
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

exports.updateProcessingOrderStatus = async (req, res) => {
  const orderId = req.params.id;

  try {
    const updatedOrder = await PendingOrder.findByIdAndUpdate(
      orderId,
      { status: "Preparing" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated to Preparing",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrderPreparingStatus = async (req, res) => {
  const orderId = req.params.id;

  try {
    const updatedOrder = await PendingOrder.findByIdAndUpdate(
      orderId,
      { status: "Delivery" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated to Delivery",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrderDeliveryStatus = async (req, res) => {
  const orderId = req.params.id;

  try {
    const updatedOrder = await PendingOrder.findByIdAndUpdate(
      orderId,
      { status: "Complete" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated to Complete",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await PendingOrder.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching user order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPendingOrders = async (req, res) => {
  try {
    // Define the status as an array for the two possible status values
    const statuses = ['Preparing', 'Delivery'];

    // Find orders where the status is either 'Preparing' or 'Delivery'
    const orders = await PendingOrder.find({ status: { $in: statuses } });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found with the status 'Preparing' or 'Delivery'" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getResturentById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await PendingOrder.find({ restaurantId: restaurantId,  status: 'Processing', });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching user order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getResturentDashboard = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await PendingOrder.find({ restaurantId: restaurantId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching user order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

