import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "../components/main_components/Toast";
import logbg from "../assets/logbg.jpg";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [toast, setToast] = useState(null); // State for toast notifications
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/register");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',  
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.token) {
        login({ token: data.token, userId: data.userId, role: data.role });
        setToast({ type: "success", message: `Logged in as ${data.role}` }); // Show success toast

        setTimeout(() => {
          if (data.role === "restaurant") {
            navigate("/restaurant/dashboard");
          } else if (data.role === "driver") {
            navigate("/driver/dashboard");
          } else if (data.role === "customer") {
            navigate("/loghome");
          } else {
            navigate("/");
          }
        }, 3000);
      } else {
        setToast({ type: "error", message: data.msg || "Login failed!" }); // Show error toast
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
        backgroundImage: `url(${logbg})`,
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

      <div className="backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center drop-shadow-lg">
          Welcome Back
        </h2>
        <p className="text-center text-white mb-8">
          Please login to your account
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none backdrop-blur-sm"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 border border-white/60 bg-white/20 text-gray-800 placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none backdrop-blur-sm"
          value={form.password}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
        >
          Login
        </button>
        <p className="text-center text-sm text-white mt-4">
          Don't have an account?{" "}
          <span
            className="text-black font-bold cursor-pointer hover:underline"
            onClick={handleSignupClick}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
