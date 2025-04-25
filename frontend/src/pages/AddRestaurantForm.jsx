import React, { useState } from 'react';
import axios from 'axios';

const AddRestaurantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    isAvailable: true,
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      logo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); 

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('isAvailable', formData.isAvailable);
      

      const response = await axios.post('http://localhost:8002/api/restaurants', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Restaurant added successfully!');
      setError('');
      setFormData({
        name: '',
        description: '',
        location: '',
        isAvailable: true,
       
      });
    } catch (err) {
      console.error(err);
      setError('Failed to add restaurant.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Add New Restaurant
        </h2>
  
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
  
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isAvailable"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">
              Available
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600"
          >
            Add Restaurant
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default AddRestaurantForm;
