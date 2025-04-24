const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
} = require("../controllers/orderController");

const { createPendingOrder } = require("../controllers/pendingOrderController");


router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);

router.post("/pending-order", createPendingOrder);

module.exports = router;