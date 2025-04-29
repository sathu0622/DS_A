import { useState } from 'react';
import Toast from '../components/main_components/Toast';

export default function UpdateLocation() {
  const [addressNo, setAddressNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [toast, setToast] = useState(null);

  const handleUpdate = async () => {
    if (!addressNo || !streetName || !city) {
      setToast({ type: "error", message: "Please fill in all fields" });
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
      if (!res.ok) {
        setToast({ type: "error", message: data.msg || "Failed to update location" });
      } else {
        setToast({ type: "success", message: data.msg });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error updating location" });
    }
  };

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <h2 className="text-xl font-bold text-red-600 mb-4 text-center">Update Location</h2>
      <input
        type="text"
        placeholder="Address No"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-red-500"
        value={addressNo}
        onChange={(e) => setAddressNo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Street Name"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-red-500"
        value={streetName}
        onChange={(e) => setStreetName(e.target.value)}
      />
      <input
        type="text"
        placeholder="City"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-red-500"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        onClick={handleUpdate}
        className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
      >
        Update Location
      </button>
    </div>
  );
}
