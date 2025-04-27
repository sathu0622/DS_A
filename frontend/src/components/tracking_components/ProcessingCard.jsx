import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Process from "../../assets/lottie/process.json"

const ProcessingCard = ({ isVisible }) => {
  return (
    <div>
      <Player
        autoplay
        loop
        src={Process}
        style={{ height: "200px", width: "200px" }}
      />
      <div
        className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 flex items-center justify-center ${
        isVisible ? "block" : "hidden"
          }`}
      >
        <p className="text-gray-600 text-center font-bold text-lg">Processing Your Order</p>
      </div>
    </div>
  );
};

export default ProcessingCard;