const AddToCart = require("../models/addtocart");

exports.addToCart = async (req, res) => {
  try {
    const { userId, restaurantId, menuItemId, quantity, totalAmount } = req.body;
    if (!userId || !restaurantId || !menuItemId || !quantity || !totalAmount) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const cartItem = new AddToCart({
      userId,
      restaurantId,
      menuItemId,
      quantity,
      totalAmount,
    });
    const savedCartItem = await cartItem.save();
    res.status(201).json({ message: "Item added to cart", cartItem: savedCartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCartItemCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await AddToCart.find({ userId });

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({ totalQuantity });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};