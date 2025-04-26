import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../main_components/NavBar";
import ProgressLine from "../tracking_components/ProgressLine";
import PendingCard from "../tracking_components/PendingCard";
import ProcessingCard from "../tracking_components/ProcessingCard";
import PreparingCard from "../tracking_components/PreparingCard";
import DeliveryCard from "../tracking_components/DeliveryCard";
import CompleteCard from "../tracking_components/CompleteCard";

import { Player } from "@lottiefiles/react-lottie-player";
import Noorder from "../../assets/lottie/noorder.json"

const Tracking = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (userRole !== "customer") {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/user-orders/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

        {/* <Player
				  autoplay
				  loop
				  src={Noorder}
				  style={{ height: "200px", width: "200px" }}
			  /> */}
        <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>

        {/* Separate Progress Lines for Each Order */}
        {orders.map((order, orderIndex) => {
          const steps = [
            { label: "Pending", description: "Order received" },
            { label: "Processing", description: "Process your order" },
            { label: "Preparing", description: "Preparing your order" },
            { label: "Delivery", description: "Out for delivery" },
            { label: "Complete", description: "Delivered successfully" },
          ];

          const currentStep = steps.findIndex((step) => step.label === order.status);

          return (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
              <h3 className="text-md font-semibold mb-2">Order ID: {order._id.slice(-10)}</h3>
              <ProgressLine
                steps={steps}
                currentStep={currentStep}
              />
              <div className="mt-4">
                {currentStep === 0 && <PendingCard isVisible={true} />}
                {currentStep === 1 && <ProcessingCard isVisible={true} />}
                {currentStep === 2 && <PreparingCard isVisible={true} />}
                {currentStep === 3 && <DeliveryCard isVisible={true} />}
                {currentStep === 4 && <CompleteCard isVisible={true} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracking;