import React from "react";

const DeliveryCard = ({ isVisible }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <h2 className="text-xl font-bold mb-2">Delivery</h2>
      <p className="text-gray-600">Out for delivery</p>
    </div>
  );
};

export default DeliveryCard;