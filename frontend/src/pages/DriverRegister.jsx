import { useState } from "react";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import Toast from "../components/main_components/Toast";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    role: "driver",
  });
  const [toast, setToast] = useState(null); // State for toast notifications
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
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
          'url("https://img.freepik.com/free-photo/male-courier-mask-holding-file-note-yellow_179666-38469.jpg?t=st=1745704054~exp=1745707654~hmac=edb5a29ba41a47d9e6b263c2a790ad0b10984557b09d40b63c6380d743b7dae6&w=1380")',
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
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center drop-shadow-lg">
          Driver Registration
        </h2>
        <p className="text-center text-gray-700 mb-8 text-lg">
          Join as a <span className="font-semibold">{form.role}</span> today!
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
        {/* <RoleSelect value={form.role} onChange={handleChange} name="role" /> */}

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
        >
          Register
        </button>

        <p className="text-center text-sm text-black mt-4">
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
