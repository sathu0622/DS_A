import { useState } from 'react';
import InputField from '../components/InputField';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    role: 'restaurant',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
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
          'url("https://img.freepik.com/free-photo/various-vegetables-black-table-with-space-message_1220-616.jpg?t=st=1745705361~exp=1745708961~hmac=41d2957943cc4393bf417980751ea11aba4af170748b05646e5616344af16d2e&w=1380")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center drop-shadow-lg">
          Register Your Account
        </h2>
        <p className="text-center text-white mb-8">
          Become a <span className="font-semibold">{form.role}</span> today!
        </p>

        <InputField
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          name="email"
        />
        <InputField
          label="Phone"
          type="text"
          value={form.phone}
          onChange={handleChange}
          name="phone"
        />
        <InputField
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          name="password"
        />
        {/* Uncomment if you want role selection */}
        {/* <RoleSelect value={form.role} onChange={handleChange} name="role" /> */}

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300 shadow-md"
        >
          Register
        </button>

        <p className="text-center text-sm text-white mt-4">
          Already registered?{' '}
          <span
            className="text-white font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
