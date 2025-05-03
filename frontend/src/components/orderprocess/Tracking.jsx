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
  const [menuItems, setMenuItems] = useState({});
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        if (orders.length > 0) {
          const restaurantIds = [...new Set(orders.map((order) => order.restaurantId))]; // Get unique restaurant IDs
          const fetchedRestaurants = {};

          for (const id of restaurantIds) {
            const response = await fetch(`http://food-app.127.0.0.1.nip.io/api/restaurants/${id}`);
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

    const interval = setInterval(fetchRestaurants, 1000);
    return () => clearInterval(interval);

  }, [orders]);

  const fetchMenuItemName = async (menuItemId) => {
    try {
      if (!menuItems[menuItemId]) {
        const response = await fetch(`http://food-app.127.0.0.1.nip.io/api/menu/menuname/${menuItemId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu item name");
        }
        const data = await response.json();
        setMenuItems((prev) => ({ ...prev, [menuItemId]: data.name })); // Store the name in state
      }
    } catch (error) {
      console.error("Error fetching menu item name:", error);
    }
  };


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://food-app.127.0.0.1.nip.io/api/orders/user-orders/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();

        // Sort orders by createdAt in descending order
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);

        const menuItemIds = [...new Set(data.flatMap((order) => order.items.map((item) => item.menuItemId)))];
        menuItemIds.forEach((id) => fetchMenuItemName(id));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 1000);
    return () => clearInterval(interval);

  }, [userId]);



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
              <div className="bg-gray-100 border border-gray-400 rounded-lg p-4 shadow-md mb-4 flex justify-between">
                {/* Left: Order Details */}
                <div className="flex flex-col space-y-2 w-1/2">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-800">Restaurant:</span> {restaurants[order.restaurantId]?.name || "Unknown Restaurant"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-800">Total Amount:</span> Rs: {order.totalAmount}.00
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-800">Payment Method:</span> {order.paymentOption}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-800">Delivery Address:</span> {order.address}
                  </p>
                </div>

                {/* Right: Order Items */}
                <div className="flex flex-col w-1/2">
                  <h4 className="text-lg font-bold mb-2">Order Items:</h4>
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.menuItemId} className="text-sm text-gray-600">
                        <span className="font-bold">{menuItems[item.menuItemId] || "Loading..."}</span> - Qty: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <ProgressLine steps={steps} currentStep={currentStep} />
              <div className="mt-4">
                {currentStep === 0 && <PendingCard
                  isVisible={currentStep === 0}
                  orderId={order._id}
                  onOrderCancelled={(cancelledOrderId) => {
                    setOrders((prevOrders) => prevOrders.filter((o) => o._id !== cancelledOrderId));
                  }}
                />}
                {currentStep === 1 && <ProcessingCard isVisible={true} />}
                {currentStep === 2 && <PreparingCard isVisible={true} orders={orders} />}
                {currentStep === 3 && <DeliveryCard isVisible={true} orders={orders} />}
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