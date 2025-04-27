import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../main_components/NavBar";
import ProgressLine from "../tracking_components/ProgressLine";
import PendingCard from "../tracking_components/PendingCard";
import ProcessingCard from "../tracking_components/ProcessingCard";
import PreparingCard from "../tracking_components/PreparingCard";
import DeliveryCard from "../tracking_components/DeliveryCard";
import CompleteCard from "../tracking_components/CompleteCard";

const Tracking = () => {
  const [orders, setOrders] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        if (orders.length > 0) {
          const restaurantIds = [...new Set(orders.map(order => order.restaurantId))]; // Get unique restaurant IDs
          const fetchedRestaurants = {};
  
          for (const id of restaurantIds) {
            const response = await fetch(`http://localhost:8002/api/restaurants/${id}`);
            if (!response.ok) throw new Error("Failed to fetch restaurant " + id);
            const data = await response.json();
            fetchedRestaurants[id] = data;
          }
  
          setRestaurants(fetchedRestaurants);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
  
    fetchRestaurants();
  }, [orders]);
  

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

  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:8002/api/restaurants/${orders.restaurantId}`);
  //       if (!response.ok) throw new Error("Failed to fetch restaurants");
  //       const data = await response.json();
  //       setRestaurants(data);
  //     } catch (error) {
  //       console.error("Error fetching restaurants:", error);
  //     }
  //   };

  //   fetchRestaurants();
  // }, []);
  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>
        {orders.map((order) => {
          const steps = [
            { label: "Pending", description: "Order received" },
            { label: "Processing", description: "Processing your order" },
            { label: "Preparing", description: "Preparing your order" },
            { label: "Delivery", description: "Out for delivery" },
            { label: "Complete", description: "Delivered successfully" },
          ];

          const currentStep = steps.findIndex((step) => step.label === order.status);

          return (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
              <h3 className="text-md font-semibold mb-2">Order ID: {order._id.slice(-10)}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Restaurant: {restaurants[order.restaurantId]?.name || "Unknown Restaurant"}
              </p>


              <p className="text-sm text-gray-600 mb-4">Total Amount: Rs: {order.totalAmount}.00</p>
              <p className="text-sm text-gray-600 mb-4">Payment Method: {order.paymentOption}</p>
              <p className="text-sm text-gray-600 mb-4">Delivery Address: {order.address}</p>
              <ProgressLine steps={steps} currentStep={currentStep} />
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