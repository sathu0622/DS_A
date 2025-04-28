const express = require("express");
const router = express.Router();


const { createPendingOrder, getUserOrders, updatePendingOrderStatus, updateProcessingOrderStatus,updateOrderPreparingStatus,updateOrderDeliveryStatus, getUserOrderById, getPendingOrders } = require("../controllers/pendingOrderController");


router.post("/pending-order", createPendingOrder);
router.get("/user-orders/:userId", getUserOrders);
router.patch("/pending-orders/:id/status", updatePendingOrderStatus);
router.patch("/processing-orders/:id/status", updateProcessingOrderStatus);
router.patch("/preparing-orders/:id/status", updateOrderPreparingStatus);
router.patch("/delivery-orders/:id/status", updateOrderDeliveryStatus);
router.get("/order/:orderId", getUserOrderById);
router.get("/order", getPendingOrders);

module.exports = router;