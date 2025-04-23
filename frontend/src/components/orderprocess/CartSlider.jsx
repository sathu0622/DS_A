import React from "react";

const CartSlider = ({ isOpen, cartItems, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 w-80 z-50`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center mb-4">
                <span>{item.name}</span>
                <span>Rs. {item.price}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CartSlider;