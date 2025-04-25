const express = require("express");
const router = express.Router();
const { addToCart, getCartItemCount } = require("../controllers/addtocartController");

router.post("/", addToCart);
router.get("/:userId/count", getCartItemCount);

module.exports = router;