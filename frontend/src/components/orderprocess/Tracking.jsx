import React, { useState, useEffect } from "react";
import NavBar from "../main_components/NavBar";
import ProgressLine from "../tracking_components/ProgressLine";
import PendingCard from "../tracking_components/PendingCard";
import ProcessingCard from "../tracking_components/ProcessingCard";
import DeliveryCard from "../tracking_components/DeliveryCard";
import CompleteCard from "../tracking_components/CompleteCard";

const Tracking = () => {
	const [orders, setOrders] = useState([]); 

	const userId = localStorage.getItem("userId"); 

	useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/user-orders/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
		  setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-8">Order Tracking</h1>

        {/* Separate Progress Lines for Each Order */}
        {orders.map((order, orderIndex) => {
          const steps = [
            { label: "Pending", description: "Order received" },
            { label: "Processing", description: "Preparing your order" },
            { label: "Delivery", description: "Out for delivery" },
            { label: "Complete", description: "Delivered successfully" },
          ];

          const currentStep = steps.findIndex((step) => step.label === order.status);

          return (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
              <h3 className="text-md font-semibold mb-2">Order ID: {order._id}</h3>
              <ProgressLine
                steps={steps}
                currentStep={currentStep}
              />
				  <div className="mt-4">
                {currentStep === 0 && <PendingCard isVisible={true} />}
                {currentStep === 1 && <ProcessingCard isVisible={true} />}
                {currentStep === 2 && <DeliveryCard isVisible={true} />}
                {currentStep === 3 && <CompleteCard isVisible={true} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracking;