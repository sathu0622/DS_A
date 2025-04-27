import { useState } from 'react';

export default function UpdateLocation() {
  const [addressNo, setAddressNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');

  const handleUpdate = async () => {
    if (!addressNo || !streetName || !city) {
      alert('Please fill in all fields');
      return;
    }


    const location = `${addressNo}, ${streetName}, ${city}`;

    try {
      const userId = localStorage.getItem("userId");

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
        placeholder="Address No"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
        value={addressNo}
        onChange={(e) => setAddressNo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Street Name"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
        value={streetName}
        onChange={(e) => setStreetName(e.target.value)}
      />
      <input
        type="text"
        placeholder="City"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
        value={city}
        onChange={(e) => setCity(e.target.value)}
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
