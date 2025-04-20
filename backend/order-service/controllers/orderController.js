const Order = require("../models/Order");

// Create an order
const createOrder = async (req, res) => {
  const { userId, items } = req.body;

  try {
    const totalAmount = items.reduce((total, item) => total + item.quantity * item.price, 0);

    const order = new Order({
      userId,
      items,
      totalAmount,
    });

    const savedOrder = await order.save();
    res.status(201).send({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ error: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ error: error.message });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.status(200).send(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
};