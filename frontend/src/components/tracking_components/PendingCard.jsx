import React, { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Pending from "../../assets/lottie/pending.json";

const PendingCard = ({ isVisible, orderId, onOrderCancelled }) => {
  const [remainingTime, setRemainingTime] = useState(300); // 

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 5 ? "0" : ""}${secs}`;
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/orders/pending-orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel the order");
      }

      alert("Order cancelled successfully!");
      onOrderCancelled(orderId); // Notify parent component
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  return (
    <div>
      <Player
        autoplay
        loop
        src={Pending}
        style={{ height: "200px", width: "200px" }}
      />
      <div
        className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 flex flex-col items-center justify-center ${isVisible ? "block" : "hidden"
          }`}
      >
        <p className="text-gray-600 text-center font-bold text-lg">Pending Your Order</p>
        {remainingTime > 0 && (
          <p className="text-gray-500 text-sm mt-2">
            You can cancel your order within: {formatTime(remainingTime)}
          </p>
        )}
        {remainingTime > 0 && (
          <button
            onClick={handleCancelOrder}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default PendingCard;