import React, { useEffect } from "react";

const Toast = ({ type, message, onClose }) => {
  // Automatically close the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  // Define styles for different types of notifications
  const typeStyles = {
    error: "bg-red-600 text-white",
    warning: "bg-orange-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`fixed top-4 right-4 w-80 p-4 mt-20 rounded-lg shadow-lg flex items-center justify-between transition-transform transform ${
        typeStyles[type]
      }`}
    >
      <div>
        <h4 className="font-bold capitalize">{type} Notification</h4>
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-white font-bold ml-4 hover:opacity-80"
      >
        Dismiss
      </button>
    </div>
  );
};

export default Toast;