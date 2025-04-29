import React, { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Pending from "../../assets/lottie/pending.json";

const PendingCard = ({ isVisible, orderId, onOrderCancelled }) => {
  const countdownDuration = 100; // 10 minutes in seconds
  const [remainingTime, setRemainingTime] = useState(countdownDuration);

  useEffect(() => {
    // Retrieve the start time from localStorage or set it if not present
    const storedStartTime = localStorage.getItem(`order_${orderId}_startTime`);
    const startTime = storedStartTime ? parseInt(storedStartTime, 10) : Date.now();

    if (!storedStartTime) {
      localStorage.setItem(`order_${orderId}_startTime`, startTime);
    }

    const updateRemainingTime = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const newRemainingTime = countdownDuration - elapsedTime;
      setRemainingTime(newRemainingTime > 0 ? newRemainingTime : 0);
    };

    updateRemainingTime(); // Update immediately
    const timer = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [orderId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
      localStorage.removeItem(`order_${orderId}_startTime`); // Clear the start time
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
        {remainingTime > 0 ? (
          <p className="text-gray-500 text-sm mt-2">
            You can cancel your order within: {formatTime(remainingTime)}
          </p>
        ) : (
          <p className="text-gray-500 text-sm mt-2">Waiting for your order.</p>
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