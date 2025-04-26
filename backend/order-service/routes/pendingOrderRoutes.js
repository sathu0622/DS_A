const express = require("express");
const router = express.Router();


const { createPendingOrder, getUserOrders } = require("../controllers/pendingOrderController");


router.post("/pending-order", createPendingOrder);
router.get("/user-orders/:userId", getUserOrders);

module.exports = router;