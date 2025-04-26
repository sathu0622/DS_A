const express = require("express");
const router = express.Router();


const { createPendingOrder, updatePendingOrderStatus } = require("../controllers/pendingOrderController");


router.post("/pending-order", createPendingOrder);
router.patch("/pending-orders/:id/status", updatePendingOrderStatus);

module.exports = router;