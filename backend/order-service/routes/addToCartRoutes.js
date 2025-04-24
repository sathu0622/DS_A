const express = require("express");
const router = express.Router();
const { addToCart, getCartItemCount, getCartDetails } = require("../controllers/addtocartController");

router.post("/", addToCart);
router.get("/:userId/count", getCartItemCount);
router.get("/:userId/details", getCartDetails); // New route for fetching cart details

module.exports = router;