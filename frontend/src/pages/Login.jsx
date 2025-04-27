import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/register');
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.token) {
        login({ token: data.token, userId: data.userId, role: data.role });
        alert(`Logged in as ${data.role}`);

        if (data.role === 'restaurant') {
          window.location.href = '/restaurant/dashboard';
        } else if (data.role === 'driver') {
          window.location.href = '/driver/dashboard';
        } else if (data.role === 'customer') {
          window.location.href = '/loghome';
        } else {
          window.location.href = '/'; // fallback
        }
      } else {
        alert(data.msg);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-r from-orange-300 via-yellow-100 to-orange-300"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg?t=st=1745704445~exp=1745708045~hmac=413fd340f795a1731be385ce055a5896bae98381ea03b6ef85bc96e86c869286&w=1380")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center drop-shadow-lg">
          Welcome Back
        </h2>
        <p className="text-center text-gray-700 mb-8">
          Please login to your account
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none backdrop-blur-sm"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none backdrop-blur-sm"
          value={form.password}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300 shadow-md"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-700 mt-4">
          Don't have an account?{' '}
          <span className="text-black font-bold cursor-pointer hover:underline"
            onClick={handleSignupClick}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
