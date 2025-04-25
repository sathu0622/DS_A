import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null); 
  const token = localStorage.getItem('token');

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get('http://localhost:8002/api/menu/owner-items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to fetch menu items', err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8002/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:8002/api/menu/${id}`,
        { availability: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMenuItems(menuItems.map((item) =>
        item._id === id ? { ...item, availability: !currentStatus } : item
      ));
    } catch (err) {
      console.error('Failed to update availability', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item }); 
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const { _id, name, price, description } = editingItem;
      await axios.put(
        `http://localhost:8002/api/menu/${_id}`,
        { name, price, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMenuItems(menuItems.map((item) =>
        item._id === _id ? { ...item, name, price, description } : item
      ));
      setEditingItem(null); // close modal
    } catch (err) {
      console.error('Failed to update item', err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          {item.image && (
            <img
              src={`http://localhost:8002/uploads/${item.image}`}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-600">Price: Rs.{item.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
            <p
              className={`text-sm font-medium mt-2 ${
                item.availability ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {item.availability ? 'Available' : 'Unavailable'}
            </p>
            <div className="flex mt-4 space-x-2">
              <button
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleEdit(item)}
              >
                Update
              </button>
              <button
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => toggleAvailability(item._id, item.availability)}
              >
                Toggle
              </button>
              <button
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.1)] backdrop-brightness-40 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-semibold mb-4">Edit Menu Item</h2>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="name"
                value={editingItem.name}
                onChange={handleEditChange}
                className="w-full px-3 py-1 border rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              Price:
              <input
                type="number"
                name="price"
                value={editingItem.price}
                onChange={handleEditChange}
                className="w-full px-3 py-1 border rounded mt-1"
              />
            </label>
            <label className="block mb-4">
              Description:
              <textarea
                name="description"
                value={editingItem.description}
                onChange={handleEditChange}
                className="w-full px-3 py-1 border rounded mt-1"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={handleEditSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMenuItems;
