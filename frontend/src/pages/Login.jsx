import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();

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
        login({ token: data.token, userId: data.userId, role: data.role }); // ✅ add role
        alert(`Logged in as ${data.role}`);
        window.location.href = '/'; // or redirect based on role
      } else {
        alert(data.msg);
      }      
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500"
          value={form.password}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}
