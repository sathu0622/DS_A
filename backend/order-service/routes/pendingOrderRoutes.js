const express = require("express");
const router = express.Router();


const { createPendingOrder, getUserOrders, updatePendingOrderStatus, deletePendingOrder, updateProcessingOrderStatus, updateOrderPreparingStatus, updateOrderDeliveryStatus, getUserOrderById, getPendingOrders, getResturentById, getResturentDashboard } = require("../controllers/pendingOrderController");


router.post("/pending-order", createPendingOrder);
router.get("/user-orders/:userId", getUserOrders);
router.patch("/pending-orders/:id/status", updatePendingOrderStatus);
router.patch("/processing-orders/:id/status", updateProcessingOrderStatus);
router.patch("/preparing-orders/:id/status", updateOrderPreparingStatus);
router.patch("/delivery-orders/:id/status", updateOrderDeliveryStatus);
router.delete("/pending-orders/:id", deletePendingOrder);
router.get("/order/:orderId", getUserOrderById);
router.get("/order", getPendingOrders);
router.get("/restaurant/:restaurantId", getResturentById);
router.get("/restaurantDashboard/:restaurantId", getResturentDashboard);

module.exports = router;