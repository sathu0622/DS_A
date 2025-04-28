import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Make sure to import axios

const RestaurantDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0); // State for total orders

  const [isRegistered, setIsRegistered] = useState(true);
  const navigate = useNavigate();

  // Function to fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      // Fetch restaurants
      const res = await axios.get(`http://localhost:8002/api/restaurants/owner/${userId}`);
      setRestaurants(res.data);
      console.log('Fetched restaurants:', res.data);

      // Fetch orders along with their menu details
      const fetchRestaurantOrders = async () => {
        try {
          console.log('Fetching orders for restaurants:', restaurants);
  
          const orderResults = await Promise.all(
            restaurants.map(async (restaurant) => {
              try {
                const res = await axios.get(`http://localhost:8000/api/orders/restaurant/restaurantDashboard/${restaurant._id}`);
                console.log(`Fetched orders for restaurant ${restaurant._id}:`, res.data);
                return res.data;  // return the fetched orders for this restaurant
              } catch (err) {
                console.error(`Error fetching orders for restaurant ${restaurant._id}:`, err);
                return []; // If error, return empty array
              }
            })
          );
  
          const flattenedOrders = orderResults.flat(); // Flatten the array of orders with menu data
          console.log('Flattened Orders with Menu:', flattenedOrders);
          setTotalOrders(flattenedOrders.length);
          console.log("setTotalOrders: ", flattenedOrders.length) // Update the total orders
        } catch (err) {
          console.error('Error fetching restaurant orders:', err);
        }
      };

      if (restaurants.length > 0) {
        fetchRestaurantOrders();
      }

      // Fetch user order history and payment history
      const response2 = await fetch(`http://localhost:8000/api/orders/user-orders/${userId}`);
      if (!response2.ok) throw new Error("Failed to fetch user profile");
      const data2 = await response2.json(); 
      setOrderHistory(data2);

      const response1 = await fetch(`http://localhost:5000/api/auth/users/all/${userId}`);
      if (!response1.ok) throw new Error("Failed to fetch user profile");
      const data1 = await response1.json(); 
      setUserDetails(data1);
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  };

  // Get userId from localStorage and fetch the user profile data
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserProfile(userId);
    }
  }, []);  // Empty dependency array to run once on component mount

  // Calculate total sales and total orders
  useEffect(() => {
    if (paymentHistory.length > 0) {
      const total = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
      setTotalSales(total);
    }

    if (orderHistory.length > 0) {
      setTotalOrders(orderHistory.length); // Update total orders from orderHistory if needed
    }
  }, [paymentHistory, orderHistory]);

  const handleRegister = () => {
    navigate("/register-restaurant");
    setIsRegistered(true);
  };

  const handleRegisterRest = () => {
    navigate("/addRestaurant");
    setIsRegistered(true);
  };

  const handleViewRestaurant = () => {
    navigate("/myRestaurants");
    alert("Viewing your restaurant!");
  };

  const handleAddMenu = () => {
    navigate("/addMenu");
  };

  const handleConfirmOrder = () => {
    navigate("/confirmOrder");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-20">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-pink-600">Good Morning!</h1>
        <div className="flex space-x-4">
          {!isRegistered ? (
            <button
              onClick={handleRegister}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Register Your Restaurant
            </button>
          ) : (
            <>
              <button
                onClick={handleRegisterRest}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Add New Restaurant
              </button>
              <button
                onClick={handleViewRestaurant}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                View my Restaurants
              </button>
              <button
                onClick={handleAddMenu}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
              >
                Add Menu
              </button>
              <button
                onClick={handleConfirmOrder}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
              >
                Confirm Order
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button className="bg-pink-500 text-white p-4 rounded-lg shadow cursor-pointer hover:bg-pink-600">
          <h2 className="text-lg font-bold">Total Sales</h2>
          <p className="text-2xl font-bold">Rs.{totalSales.toFixed(2)}</p>
        </button>
        <button className="bg-blue-500 text-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-600">
          <h2 className="text-lg font-bold">Total Orders</h2>
          <p className="text-2xl font-bold">{totalOrders}</p> {/* Display total orders */}
        </button>
      </div>

      {/* Sales Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold">Sales Summary</h2>
          <div className="mt-4">
            <p className="text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold">Rs.{totalSales.toFixed(2)}</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Avg. Sales Per Day</p>
            <p className="text-2xl font-bold">Rs.{totalSales.toFixed(2)/5}</p>
          </div>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold">Orders Summary</h2>
          {/* Add order summary details as needed */}
        </button>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
