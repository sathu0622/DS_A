import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Complete from "../../assets/successfull.json"

const CompleteCard = ({ isVisible }) => {
  return (
	  <div>
		  <Player
			  autoplay
			  loop
			  src={Complete}
			  style={{ height: "200px", width: "200px" }}
		  />
		  <div
			  className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 flex items-center justify-center ${
        isVisible ? "block" : "hidden"
				  }`}
		  >
			  <p className="text-gray-600 text-center font-bold text-lg">Order Delivered successfully</p>
		  </div>
	  </div>
  );
};

export default CompleteCard;