import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/main_components/Toast";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });
  const [toast, setToast] = useState(null); // State for toast notifications
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://food-app.127.0.0.1.nip.io/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.msg || "Something went wrong" }); // Show error toast
      } else {
        setToast({ type: "success", message: data.msg || "Registration successful!" }); // Show success toast

        // Wait for 3 seconds before navigating
        setTimeout(() => {
          navigate(`/verify?email=${encodeURIComponent(form.email)}`);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Server error. Please try again." }); // Show error toast
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-300 via-yellow-100 to-red-300"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-photo/people-ramadan-celebration_23-2151344679.jpg?t=st=1745704665~exp=1745708265~hmac=7d4b5bdee15144ace7f40a3f40c6ef49ccea4a81b82160400ca69aec180d4bd9&w=1380")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center drop-shadow-lg">
          Create Your Account ✨
        </h2>
        <p className="text-center text-gray-700 mb-8">
          Register as a <span className="font-semibold">{form.role}</span>
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 backdrop-blur-sm"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full px-4 py-3 mb-4 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 backdrop-blur-sm"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 backdrop-blur-sm"
          value={form.password}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-red-500 cursor-pointer text-white font-bold py-3 rounded-lg curser-pointer hover:bg-red-600 transition duration-300 shadow-md"
        >
          Register
        </button>
        <p className="text-center text-sm text-white mt-4">
          Already have an account?{" "}
          <span
            className="text-black font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
