import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from '../components/main_components/NavBar';


const Temp = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/restaurants");
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.description}</p>
            <p className="text-gray-500 mt-2">Location: {restaurant.location}</p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => navigate(`/restaurants/${restaurant._id}`)}
            >
              View Menu
            </button>
          </div>
        ))}
      </div>
    </div>
	</div>
  );
};

export default Temp;