import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/main_components/NavBar";
import { IoTrashBin } from "react-icons/io5";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";

const CartSlider = ({ isOpen, cartItems, onClose }) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.totalAmount, 0);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"
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
                      src={item.image || "https://via.placeholder.com/50"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    {/* Item Details */}
                    <div className="flex-1 ml-4">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Rs. {item.price}</p>
                    </div>

                    {/* Total Price */}
                    <p className="font-bold">Rs. {item.quantity * item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Subtotal and Checkout */}
        <div className="mt-4 border-t pt-4">
          <p className="text-lg font-bold">Subtotal: Rs. {calculateSubtotal()}</p>
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

const NewTemp = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [quantity, setQuantity] = useState(1); 

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `http://localhost:8002/api/menu?restaurantId=${restaurantId}`
        );
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const addToCart = async (item) => {
    const userId = localStorage.getItem("userId");
    const menuItemId = item._id; 
    const totalAmount = item.price * quantity;

    try {
      const response = await fetch("http://localhost:8000/api/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          restaurantId,
          menuItemId,
          quantity,
          totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      console.log("Item added to cart:", data);

      // Update the cart state and open the CartSlider
      setCart((prevCart) => [...prevCart, { ...item, quantity, totalAmount }]);
      setIsCartOpen(true); // Open the CartSlider
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-8">Menu Items</h1>

        {/* Menu Item Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-lg rounded-lg p-6 relative cursor-pointer"
              onClick={() => openModal(item)} 
            >
              <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-gray-500 mt-2">Price: Rs. {item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Slider */}
      <CartSlider
        isOpen={isCartOpen}
        cartItems={cart}
        onClose={() => setIsCartOpen(false)}
      />

      {/* popup window*/}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-96 p-6 relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>
            <img
              src={selectedItem.image || "https://via.placeholder.com/150"}
              alt={selectedItem.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
            <p className="text-gray-600 mb-4">{selectedItem.description}</p>
            <p className="text-gray-800 font-bold mb-4">Price: Rs. {selectedItem.price}.00</p>

            {/* Quantity Selector */}
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-4 text-gray-600">
                Quantity:
              </label>
              <select
                id="quantity"
                className="border border-gray-300 rounded px-2 py-1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Order Button */}
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full mb-4"
              onClick={() => {
                addToCart(selectedItem);
                closeModal();
              }}
            >
              Add {quantity} to Order - Rs. {selectedItem.price * quantity}.00
            </button>

            <button
              className="bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 w-full"
              onClick={() => {
                console.log("See details clicked");
              }}
            >
              See Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTemp;