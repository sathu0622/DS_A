import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:8002/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || 'Something went wrong');
      } else {
        alert(data.msg);
        navigate(`/verify?email=${encodeURIComponent(form.email)}`);
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
          'url("https://img.freepik.com/free-photo/people-ramadan-celebration_23-2151344679.jpg?t=st=1745704665~exp=1745708265~hmac=7d4b5bdee15144ace7f40a3f40c6ef49ccea4a81b82160400ca69aec180d4bd9&w=1380")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center drop-shadow-lg">
          Create Your Account ✨
        </h2>
        <p className="text-center text-gray-700 mb-8">
          Register as a <span className="font-semibold">{form.role}</span>
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full px-4 py-3 mb-4 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
          value={form.password}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300 shadow-md"
        >
          Register
        </button>
        <p className="text-center text-sm text-white mt-4">
          Already have an account?{' '}
          <span
            className="text-black font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
