import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddRestaurantForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    isAvailable: true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('isAvailable', formData.isAvailable);
    if (image) data.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://food-app.127.0.0.1.nip.io/api/restaurants', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('🎉 Restaurant added successfully!');
      setError('');
      setFormData({
        name: '',
        description: '',
        location: '',
        isAvailable: true,
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to add restaurant.');
      setSuccess('');
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-300 via-yellow-100 to-red-300"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg?t=st=1745704445~exp=1745708045~hmac=413fd340f795a1731be385ce055a5896bae98381ea03b6ef85bc96e86c869286&w=1380")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        className="backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-3xl p-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center drop-shadow-lg">
          🍽️ Add New Restaurant
        </h2>

        <AnimatePresence>
          {success && (
            <motion.div
              className="bg-green-100 text-green-700 text-center p-3 rounded-md mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none backdrop-blur-sm"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none backdrop-blur-sm"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none backdrop-blur-sm"
          />
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="isAvailable"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="mr-2 accent-red-500"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-800">
              Available
            </label>
          </div>

          {/* File Upload */}
          <div className="flex flex-col items-center border-2 border-dashed border-red-300 p-4 rounded-lg bg-white/30 backdrop-blur-sm cursor-pointer">
            <label className="flex flex-col items-center w-full cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mb-3"
                />
              ) : (
                  <UploadCloud className="w-12 h-12 text-red-400 mb-2" />
              )}
              <p className="text-sm text-gray-800">Click to upload an image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Hide the actual input
              />
            </label>
          </div>


          <button
            type="submit"
            className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
          >
            Add Restaurant
          </button>
        </form>
      </motion.div>
    </div>
  );
}
