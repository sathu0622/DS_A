import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/main_components/NavBar";

const loginHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (userRole !== "customer") {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:8002/api/restaurants");
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Restaurants</h1>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white shadow-md rounded-2xl overflow-hidden relative cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => navigate(`/restaurants/${restaurant._id}`)}
            >
              {/* Offer Tag (If Offer Exists) */}
              {restaurant.offer && (
                <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                  {restaurant.offer}
                </div>
              )}

              {/* Restaurant Image */}
              <img
                src={restaurant.image || "https://via.placeholder.com/300"}
                alt={restaurant.name}
                className="w-full h-40 object-cover"
              />

              {/* Restaurant Details */}
              <div className="p-4">
                {/* Name */}
                <h2 className="text-lg font-bold text-gray-800 mb-1">{restaurant.name}</h2>

                {/* Ratings & Delivery Info Row */}
                <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
                  <span>⭐ {restaurant.rating || "4.5"}</span>
                  <span>🚚 {restaurant.deliveryFee || "150"}.00</span>
                  <span>⏱️ {restaurant.deliveryTime || "30 min"}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {restaurant.description}
                </p>
              </div>
            </div>
          ))}
        </div>


        {/* Places You Might Like Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Places You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {restaurants.slice(0, 4).map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white shadow-md rounded-2xl overflow-hidden relative cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
              >
                {/* Offer Tag */}
                {restaurant.offer && (
                  <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                    {restaurant.offer}
                  </div>
                )}

                {/* Restaurant Image */}
                <img
                  src={restaurant.image || "https://via.placeholder.com/300"}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover"
                />

                {/* Restaurant Details */}
                <div className="p-4">
                  {/* Name */}
                  <h2 className="text-lg font-bold text-gray-800 mb-1">{restaurant.name}</h2>

                  {/* Ratings & Delivery Info */}
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
                    <span>⭐ {restaurant.rating || "4.5"}</span>
                    <span>🚚 {restaurant.deliveryFee || "150"}.00</span>
                    <span>⏱️ {restaurant.deliveryTime || "30 min"}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {restaurant.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default loginHome;