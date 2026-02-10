import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import defaulting from "../assets/logo(1).webp";
import { adminLogin } from "../auth/adminLogin"; // Import service

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // API Call
      const data = await adminLogin(email, password);

      // Save to localStorage (Token and Role)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.admin.role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("id", data.admin.id);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      // Backend error message handle karega
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center shadow-lg mb-4">
            <img src={defaulting} alt="logo" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Digi Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8">
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-orange-200 bg-orange-50 focus:ring-2 focus:ring-orange-200 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-orange-200 bg-orange-50 focus:ring-2 focus:ring-orange-200 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-2xl bg-[#FE702E] hover:bg-orange-600 text-white font-semibold text-lg transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">© 2026 Digi App Admin Panel</p>
      </div>
    </div>
  );
};

export default Login;