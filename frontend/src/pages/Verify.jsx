import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Verify() {
  const query = useQuery();
  const emailFromUrl = query.get('email'); 

  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const handleVerify = async () => {
    const res = await fetch('http://food-app.127.0.0.1.nip.io/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailFromUrl, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
        navigate(`/login`);
        // window.location.href = `/verify?email=${encodeURIComponent(form.email)}`;
      }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-2 text-center">
          A verification code was sent to <strong>{emailFromUrl}</strong>
        </p>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-red-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          onClick={handleVerify}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
        >
          Verify Email
        </button>
      </div>
    </div>
  );
}
