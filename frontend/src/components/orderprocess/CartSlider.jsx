import React, { useEffect, useState } from "react";

const CartSlider = ({ isOpen, userId, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:8000/api/addtocart/${userId}/details`);
          if (!response.ok) {
            throw new Error("Failed to fetch cart data");
          }
          const data = await response.json();
          setCartItems(data);

          // Assuming restaurant details are the same for all items in the cart
          if (data.length > 0) {
            setRestaurantName(data[0].restaurantName);
            setRestaurantLocation(data[0].restaurantLocation);
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    if (isOpen) {
      fetchCartData();
    }
  }, [isOpen, userId]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.totalAmount, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity, totalAmount: newQuantity * item.menuItemId.price } : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 w-96 z-50`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Restaurant Details */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">{restaurantName}</h2>
          <p className="text-sm text-gray-500">{restaurantLocation}</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item._id} className="mb-4">
                  <div className="flex items-center justify-between">
                    {/* Item Image */}
                    <img
                      src={item.menuItemId.image || "https://via.placeholder.com/50"}
                      alt={item.menuItemName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    {/* Item Details */}
                    <div className="flex-1 ml-4">
                      <p className="font-bold">{item.menuItemName}</p>
                      <p className="text-sm text-gray-500">LKR {item.menuItemId.price}</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Order Note */}
        <div className="mt-4">
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Add an order note (e.g., utensils, special instructions)"
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
          />
        </div>

        {/* Subtotal and Checkout */}
        <div className="mt-4 border-t pt-4">
          <p className="text-lg font-bold">Subtotal: LKR {calculateSubtotal()}</p>
          <button
            className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 w-full"
            onClick={() => console.log("Proceed to checkout")}
          >
            Go to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSlider;