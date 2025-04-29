import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/main_components/NavBar";
import Toast from "../components/main_components/Toast";

const loginHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [toast, setToast] = useState(null); // State for toast notifications
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
        setFilteredRestaurants(data); // Initialize filtered restaurants
        setToast({ type: "success", message: "Restaurants loaded successfully!" }); // Show success toast
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setToast({ type: "error", message: "Failed to load restaurants." }); // Show error toast
      }
    };

    fetchRestaurants();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query) || // Search by restaurant name
        (restaurant.menuItems && // Ensure menuItems exists
          restaurant.menuItems.some((item) =>
            item.name.toLowerCase().includes(query) // Search by menu item name
          ))
    );
    setFilteredRestaurants(filtered);

    setToast({ type: "info", message: `Search updated: "${query}"` }); // Show info toast
  };

  // Handle Filter
  const handleFilter = (filter) => {
    setSelectedFilter(filter);

    if (filter === "all") {
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredRestaurants(
        restaurants.filter((restaurant) =>
          restaurant.menuItems.some((item) =>
            item.category.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }

    setToast({ type: "info", message: `Filter applied: "${filter}"` }); // Show info toast
  };

  return (
    <div>
      <NavBar />

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Restaurants</h1>

        {/* Search Bar */}
        <div className="flex items-center justify-center mb-6">
          <input
            type="text"
            placeholder="Search for restaurants or menu items..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full max-w-lg px-4 py-2 border border-white bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white shadow-md rounded-2xl overflow-hidden relative cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => {
                navigate(`/restaurants/${restaurant._id}`);
                setToast({ type: "success", message: `Navigating to ${restaurant.name}` }); // Show success toast
              }}
            >
              {/* Offer Tag (If Offer Exists) */}
              {restaurant.offer && (
                <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                  {restaurant.offer}
                </div>
              )}

              {/* Restaurant Image */}
              <img
                src={`http://localhost:8002/uploads/${restaurant.image}`}
                alt={restaurant.image}
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
      </div>
    </div>
  );
};

export default loginHome;