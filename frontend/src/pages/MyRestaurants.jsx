import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', description: '' });
  const token = localStorage.getItem('token');

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:8002/api/restaurants/owner', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8002/api/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRestaurants();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await axios.patch(`http://localhost:8002/api/restaurants/${id}/availability`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRestaurants();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (restaurant) => {
    setEditing(restaurant._id);
    setForm({
      name: restaurant.name,
      location: restaurant.location,
      description: restaurant.description,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8002/api/restaurants/${editing}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(null);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage My Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {restaurants.map((r) => (
    <div
      key={r._id}
      className="bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
    >
      {/* Restaurant Image */}
      <img
        src={`http://localhost:8002/uploads/${r.image}`} // Assuming 'logo' field in restaurant has the image filename
        alt={r.name}
        className="w-full h-40 object-cover"
      />

      {/* Restaurant Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{r.name}</h2>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{r.description}</p>
        <p className="text-gray-600 text-sm mb-2">{r.location}</p>

        {/* Availability */}
        <p className={`text-sm font-semibold mb-2 ${r.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
          {r.isAvailable ? 'Available' : 'Not Available'}
        </p>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleEdit(r)}
            className="bg-yellow-400 px-3 py-1 rounded text-white text-sm hover:bg-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(r._id)}
            className="bg-red-500 px-3 py-1 rounded text-white text-sm hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toggleAvailability(r._id)}
            className="bg-blue-500 px-3 py-1 rounded text-white text-sm hover:bg-blue-600"
          >
            Toggle
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Restaurant</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                placeholder="Name"
                className="w-full mb-2 px-3 py-2 border rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full mb-2 px-3 py-2 border rounded"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full mb-2 px-3 py-2 border rounded"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="bg-gray-300 px-3 py-1 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRestaurants;
