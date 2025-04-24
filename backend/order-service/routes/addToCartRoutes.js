const express = require("express");
const router = express.Router();
const { addToCart, getCartItemCount, getCartDetails, updateCartItemQuantity, deleteCartItem } = require("../controllers/addtocartController");

router.post("/", addToCart);
router.get("/:userId/count", getCartItemCount);
router.get("/:userId/details", getCartDetails);
router.put("/:itemId/quantity", updateCartItemQuantity);
router.delete("/:itemId", deleteCartItem);

module.exports = router;