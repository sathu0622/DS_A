import { useState } from 'react';

export default function UpdateLocation() {
  const [location, setLocation] = useState('');

  const handleUpdate = async () => {
    if (!location) {
      alert('Please enter a location');
      return;
    }

    try {
        const userId = localStorage.getItem("userId")

      const res = await fetch(`http://localhost:5000/api/auth/users/${userId}/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });

      const data = await res.json();
      alert(data.msg);
    } catch (err) {
      console.error(err);
      alert('Error updating location');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-orange-600 mb-4 text-center">Update Location</h2>
      <input
        type="text"
        placeholder="Enter new location"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        onClick={handleUpdate}
        className="w-full bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600"
      >
        Update Location
      </button>
    </div>
  );
}
