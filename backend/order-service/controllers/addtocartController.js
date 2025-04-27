const mongoose = require("mongoose");
const AddToCart = require("../models/addtocart");

// Connect to the `test` database
const testDbConnection = mongoose.createConnection(process.env.TEST_DB_URI);

// Import the `Restaurant` and `MenuItem` models from the `test` database
const Restaurant = testDbConnection.model(
  "Restaurant",
  new mongoose.Schema({
    name: String,
    description: String,
    location: String,
  })
);

const MenuItem = testDbConnection.model(
  "MenuItem",
  new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    name: String,
    description: String,
    price: Number,
  })
);

exports.addToCart = async (req, res) => {
  try {
    const { userId, restaurantId, menuItemId, quantity, totalAmount, image } = req.body;
    if (!userId || !restaurantId || !menuItemId || !quantity || !totalAmount || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const cartItem = new AddToCart({
      userId,
      restaurantId,
      menuItemId,
      quantity,
      totalAmount,
      image,
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
    const { restaurantId } = req.query; // Get restaurantId from query parameters

    const filter = { userId };
    if (restaurantId) {
      filter.restaurantId = restaurantId; // Filter by restaurantId if provided
    }

    const cartItems = await AddToCart.find(filter);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({ totalQuantity });
  } catch (error) {
    console.error("Error fetching cart item count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCartDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { restaurantId } = req.query;

    // Fetch cart items for the user and filter by restaurantId
    const filter = { userId };
    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }

    const cartItems = await AddToCart.find(filter);

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    // Enrich cart items with restaurant and menu item details
    const enrichedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menuItemId);
        const restaurant = await Restaurant.findById(item.restaurantId);

        return {
          ...item.toObject(),
          menuItemName: menuItem?.name || "Unknown",
          restaurantName: restaurant?.name || "Unknown",
          restaurantLocation: restaurant?.location || "Unknown",
        };
      })
    );

    res.status(200).json(enrichedCartItems);
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    console.log("Received request to update item:", itemId, "to quantity:", quantity); // Debugging log

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity min 1" });
    }

    const cartItem = await AddToCart.findById(itemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }


    const menuItem = await MenuItem.findById(cartItem.menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const price = menuItem.price;
    if (!price || isNaN(price)) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    const totalAmount = quantity * price;

    cartItem.quantity = quantity;
    cartItem.totalAmount = totalAmount;

    const updatedCartItem = await cartItem.save();

    console.log("Updated item in database:", updatedCartItem);
    res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params


    const deletedItem = await AddToCart.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart is not founsd" })
    }
    res.status(200).json({ message: "Cart item deleted successfully", deletedItem });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}