import React, { useEffect, useState, useRef } from "react";
import { IoTrashBin } from "react-icons/io5";
import { AiOutlineCaretLeft, AiOutlineCaretRight, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import cartAnimation from "../../assets/lottie/cartanim.json";

const CartSlider = ({ isOpen, userId, onClose, restaurantId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");
  const navigate = useNavigate();
  const sliderRef = useRef(null); 

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems, restaurantName, restaurantLocation, subtotal: calculateSubtotal() } });
  };

  useEffect(() => {
    const fetchCartData = async () => {
      if (userId && restaurantId) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/addtocart/${userId}/details?restaurantId=${restaurantId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch cart data");
          }
          const data = await response.json();

          setCartItems(data);

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
  }, [isOpen, userId, restaurantId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.totalAmount, 0);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const item = cartItems.find((item) => item._id === itemId);

    try {
      const response = await fetch(`http://localhost:8000/api/addtocart/${itemId}/quantity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const updatedItem = await response.json();

      // Update the cart items in the state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId
            ? { ...item, quantity: updatedItem.quantity, totalAmount: updatedItem.totalAmount }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/addtocart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 w-96 z-50`}
    >
      <div ref={sliderRef} className="p-4 h-full flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <AiOutlineClose />
        </button>

        {/* Restaurant Details */}
        {cartItems.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-bold">{restaurantName}</h2>
            <p className="text-sm text-gray-500">{restaurantLocation}</p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Player
                autoplay
                loop
                src={cartAnimation}
                style={{ height: "200px", width: "200px" }}
              />
              <p className="text-gray-500 text-lg font-bold">Add items to start a cart</p>
              <p className="text-gray-400 text-sm text-center">
                Once you add items from a restaurant or store, your cart will appear here.
              </p>
              <button
                className="mt-4 bg-red-500 hover:bg-red-600 cursor-pointer text-white py-2 px-4 rounded hover:bg-gray-800"
                onClick={() => navigate("/loghome")}
              >
                Start Order Item
              </button>
            </div>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item._id} className="mb-4">
                  <div className="flex items-center justify-between">
                    {/* Item Image */}
                    <img
                      src={`http://localhost:8002/uploads/${item.image}`}
                      alt={item.menuItemName.image}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    {/* Item Details */}
                    <div className="flex-1 ml-4">
                      <p className="font-bold">{item.menuItemName}</p>
                      <p className="text-sm text-gray-500">LKR {item.totalAmount}.00</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded-4xl cursor-pointer hover:bg-gray-300"
                          onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                        >
                          <AiOutlineCaretLeft />
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="px-2 py-1 bg-gray-200 cursor-pointer rounded-4xl hover:bg-gray-300"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          <AiOutlineCaretRight />
                        </button>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      className="text-red-500 hover:text-red-700 text-2xl cursor-pointer"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      <IoTrashBin />
                    </button>
                  </div>
                  <hr className="mt-2"></hr>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Subtotal and Checkout */}
        {cartItems.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="text-lg font-bold flex justify-between">
              <span>Subtotal:</span>
              <span>LKR {calculateSubtotal()}.00</span>
            </div>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 cursor-pointer text-white py-2 px-4 rounded hover:bg-gray-800 w-full"
              onClick={handleCheckout}
            >
              Go to checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSlider;