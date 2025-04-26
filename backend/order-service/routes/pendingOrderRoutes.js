const express = require("express");
const router = express.Router();


const { createPendingOrder, getUserOrders, updatePendingOrderStatus } = require("../controllers/pendingOrderController");


router.post("/pending-order", createPendingOrder);
router.get("/user-orders/:userId", getUserOrders);
router.patch("/pending-orders/:id/status", updatePendingOrderStatus);

module.exports = router;