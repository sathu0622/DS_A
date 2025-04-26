const express = require("express");
const router = express.Router();


const { createPendingOrder } = require("../controllers/pendingOrderController");


router.post("/pending-order", createPendingOrder);

module.exports = router;