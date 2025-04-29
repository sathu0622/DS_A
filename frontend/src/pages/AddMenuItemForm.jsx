import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Toast from "../components/main_components/Toast";

const AddMenuItemForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    availability: true,
    restaurantId: "",
  });
  const [image, setImage] = useState(null);
  const [toast, setToast] = useState(null); // State for toast notifications
  const [restaurants, setRestaurants] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:8002/api/restaurants/owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
        setToast({ type: "error", message: "Failed to fetch restaurants." });
      }
    };

    fetchRestaurants();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const res = await axios.post("http://localhost:8002/api/menu", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setToast({ type: "success", message: "Menu item added successfully!" }); // Show success toast
      setFormData({
        name: "",
        description: "",
        price: "",
        availability: true,
        restaurantId: "",
      });
      setImage(null);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to add menu item." }); // Show error toast
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-300 via-yellow-100 to-red-300"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg?t=st=1745704445~exp=1745708045~hmac=413fd340f795a1731be385ce055a5896bae98381ea03b6ef85bc96e86c869286&w=1380")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Add New Menu Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            required
          />
          <select
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select a Restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <label htmlFor="availability" className="text-sm">Available</label>
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
          >
            Add Item
          </button>
        </form>
        <Link to="/viewMenuItems">
          <button
            className="mt-6 w-full bg-gray-800 text-white font-semibold py-2 rounded hover:bg-red-600"
          >
            View Menu Items
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AddMenuItemForm;
