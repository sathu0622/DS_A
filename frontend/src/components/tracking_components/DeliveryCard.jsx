import React from "react";
import DeliveryTracking from "../../pages/DeliveryTracking";

const DeliveryCard = ({ isVisible, orders }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <h2 className="text-xl font-bold mb-2">Delivery</h2>
      <p className="text-gray-600 mb-4">Out for delivery</p>
      {isVisible && <DeliveryTracking orders={orders} />}
    </div>
  );
};

export default DeliveryCard;
