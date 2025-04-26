import React from "react";

const CompleteCard = ({ isVisible }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <h2 className="text-xl font-bold mb-2">Complete</h2>
      <p className="text-gray-600">Delivered successfully</p>
    </div>
  );
};

export default CompleteCard;