import React, { useEffect, useState } from "react";
import axios from "axios";
import DriverMap from "./DriverMap";
import Toast from "../components/main_components/Toast";

const DriverDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the selected order for the modal
  const [toast, setToast] = useState(null); // State for toast notifications

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://food-app.127.0.0.1.nip.io/api/orders/order");
        setOrders(res.data);
        setLoading(false);
        setToast({ type: "success", message: "Orders fetched successfully!" }); // Show success toast
      } catch (err) {
        setError("Error fetching orders");
        setLoading(false);
        setToast({ type: "error", message: "Failed to fetch orders." }); // Show error toast
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        if (orders.length > 0) {
          const restaurantIds = [
            ...new Set(orders.map((order) => order.restaurantId)),
          ];
          const fetchedRestaurants = {};

          for (const id of restaurantIds) {
            const response = await fetch(
              `http://food-app.127.0.0.1.nip.io/api/restaurants/${id}`
            );
            if (!response.ok)
              throw new Error("Failed to fetch restaurant " + id);
            const data = await response.json();
            fetchedRestaurants[id] = data;
          }

          setRestaurants(fetchedRestaurants);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setToast({ type: "error", message: "Failed to fetch restaurants." }); // Show error toast
      }
    };

    fetchRestaurants();
  }, [orders]);

  const handleStatusUpdate = async (order) => {
    try {
      await axios.patch(
        `http://food-app.127.0.0.1.nip.io/api/orders/preparing-orders/${order._id}/status`
      );
      handleAcceptClick(order);
      setToast({ type: "success", message: "Order status updated!" }); // Show success toast
    } catch (err) {
      console.error("Failed to update order status:", err.response?.data || err.message);
      setToast({ type: "error", message: "Failed to update order status." }); // Show error toast
    }
  };

  const handleStatusComplete = async (order) => {
    try {
      await axios.patch(
        `http://food-app.127.0.0.1.nip.io/api/orders/delivery-orders/${order._id}/status`
      );
      setToast({ type: "success", message: "Order marked as completed!" }); // Show success toast
    } catch (err) {
      console.error("Failed to update order status:", err.response?.data || err.message);
      setToast({ type: "error", message: "Failed to mark order as completed." }); // Show error toast
    }
  };

  const handleAcceptClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true); // Open modal when Accept is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
    setSelectedOrder(null); // Clear selected order
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-semibold mb-6">Driver Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => {
          const restaurant = restaurants[order.restaurantId];
          return (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800">
                Order ID: {order._id}
              </h2>
              <p className="text-gray-600 mt-1">
                Customer Address: {order.address}
              </p>
              {restaurant && (
                <p className="text-gray-600 mt-2">
                  Restaurant: {restaurant.name}
                </p>
              )}
              {restaurant && (
                <p className="text-gray-600 mt-2">
                  Restaurant Address: {restaurant.location}
                </p>
              )}
              <p
                className={`mt-2 font-bold ${
                  order.status === "Delivered"
                    ? "text-green-500"
                    : order.status === "In Transit"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                Status: {order.status}
              </p>
              <p className="mt-2 text-gray-600">
                Estimated Delivery Time: {order.deliveryTime}
              </p>

              <div className="mt-4 space-x-4">
                <button
                  onClick={() => handleAcceptClick(order)} // Open modal
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(order, "Collected")}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Collected
                </button>
                <button
                  onClick={() => handleStatusComplete(order, "Delivered")}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Completed
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 h-auto max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">
              Confirm Order Accept
            </h2>

            <div className="flex-1 overflow-y-auto">
              <DriverMap orders={selectedOrder} />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleCloseModal} // Close the modal
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusUpdate(selectedOrder.id, "Accepted");
                  handleCloseModal(); // Close the modal after updating status
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
