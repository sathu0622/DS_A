import React, { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Pending from "../../assets/lottie/pending.json";
import Toast from "../main_components/Toast";

const PendingCard = ({ isVisible, orderId, onOrderCancelled }) => {
  const countdownDuration = 100; // 10 min
  const [remainingTime, setRemainingTime] = useState(countdownDuration);
  const [toast, setToast] = useState(null);

  useEffect(() => {
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

    updateRemainingTime();
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
      const response = await fetch(`http://food-app.127.0.0.1.nip.io/api/orders/pending-orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel the order");
      }

      setToast({ type: "success", message: "Order cancelled successfully!" });
      localStorage.removeItem(`order_${orderId}_startTime`);
      onOrderCancelled(orderId);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setToast({ type: "error", message: "Failed to cancel the order. Please try again." });
    }
  };

  return (
    <div>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)} // Clear the toast when closed
        />
      )}
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