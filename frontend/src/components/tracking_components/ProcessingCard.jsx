import React from "react";

const ProcessingCard = ({ isVisible }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <h2 className="text-xl font-bold mb-2">Processing</h2>
      <p className="text-gray-600">Preparing your order</p>
    </div>
  );
};

export default ProcessingCard;