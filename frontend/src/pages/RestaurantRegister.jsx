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
      className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-300 via-yellow-100 to-red-300"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-photo/authentic-italian-pasta_24972-892.jpg?t=st=1745727939~exp=1745731539~hmac=30ae503c77f93545441e807ef0b93b2ba4ffe977fe88ee6e7fca1426e0964ed5&w=1380")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center drop-shadow-lg">
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
          className="w-full mt-6 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
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
