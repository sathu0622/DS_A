const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
} = require("../controllers/orderController");

// Create an order
router.post("/", createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get a specific order by ID
router.get("/:id", getOrderById);

module.exports = router;