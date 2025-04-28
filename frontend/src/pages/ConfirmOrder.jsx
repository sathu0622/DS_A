import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfirmOrderPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  
  const userId = localStorage.getItem('userId');
  console.log("userId", userId);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`http://localhost:8002/api/restaurants/owner/${userId}`);
      setRestaurants(res.data);
      console.log('Fetched restaurants:', res.data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    console.log('Updated restaurants state:', restaurants);
  }, [restaurants]);

  // Fetch orders along with their menu details
  useEffect(() => {
    const fetchRestaurantOrders = async () => {
      try {
        console.log('Fetching orders for restaurants:', restaurants);

        const orderResults = await Promise.all(
          restaurants.map(async (restaurant) => {
            try {
              const res = await axios.get(`http://localhost:8000/api/orders/restaurant/${restaurant._id}`);
              console.log(`Fetched orders for restaurant ${restaurant._id}:`, res.data);
              
              // Now for each order, fetch the menu details
              const ordersWithMenu = await Promise.all(
                res.data.map(async (order) => {
                  const menuItems = await Promise.all(
                    order.items.map(async (item) => {
                      const menuRes = await axios.get(`http://localhost:8002/api/menu/menuId/${item.menuItemId}`);
                      return menuRes.data; // Assuming menu details are returned here
                    })
                  );
                  return { ...order, menuItems }; // Add menu items to the order
                })
              );

              return ordersWithMenu;
            } catch (err) {
              console.error(`Error fetching orders for restaurant ${restaurant._id}:`, err);
              return []; // If error, return empty array
            }
          })
        );

        const flattenedOrders = orderResults.flat(); // Flatten the array of orders with menu data
        console.log('Flattened Orders with Menu:', flattenedOrders);
        setOrders(flattenedOrders);
      } catch (err) {
        console.error('Error fetching restaurant orders:', err);
      }
    };

    if (restaurants.length > 0) {
      fetchRestaurantOrders();
    }
  }, [restaurants, orders]);

  const handleConfirm = async (orderId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/orders/processing-orders/${orderId}/status`
      ); 
    } catch (err) {
      console.error("Failed to update order status:", err.response?.data || err.message);
    }
  };

  // Cancel order handler
  const handleCancel = (orderId) => {
    alert(`Order ${orderId} canceled.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Confirm Your Orders</h2>

        <div className="space-y-4 mb-6">
          {restaurants.length === 0 ? (
            <div className="text-gray-500 text-center">No restaurants found.</div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="border-b pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <span className="text-gray-900">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="text-gray-900">{order.status}</span>
                </div>

                {/* Display Menu Items */}
                <div className="mt-3">
                  <h3 className="text-lg font-semibold">Menu Items:</h3>
                  <ul>
                    {order.menuItems.map((menuItem, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-gray-700">{menuItem.name}</span>
                        <span className="text-gray-500">{menuItem.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="w-1/2 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirm(order._id)}
                    className="w-1/2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-200"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">Loading orders...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;
