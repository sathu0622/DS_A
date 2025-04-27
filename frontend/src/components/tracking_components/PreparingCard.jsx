import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Prepare from "../../assets/lottie/prepare.json"

const PreparingCard = ({ isVisible }) => {
  return (
	  <div>
		  <Player
			  autoplay
			  loop
			  src={Prepare}
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

export default PreparingCard;