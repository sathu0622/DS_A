import { useState } from 'react';
import InputField from '../components/InputField';
import RoleSelect from '../components/RoleSelect';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', phone: '', password: '', role: '' });
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
        // Navigate to verification page and pass email
        navigate(`/verify?email=${encodeURIComponent(form.email)}`);
        // window.location.href = `/verify?email=${encodeURIComponent(form.email)}`;
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };
  

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Register</h2>
        <InputField label="Email" type="email" value={form.email} onChange={(e) => handleChange(e)} name="email" />
        <InputField label="Phone" type="text" value={form.phone} onChange={(e) => handleChange(e)} name="phone" />
        <InputField label="Password" type="password" value={form.password} onChange={(e) => handleChange(e)} name="password" />
        <RoleSelect value={form.role} onChange={handleChange} name="role" />
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600"
        >
          Register
        </button>
      </div>
    </div>
  );
}
