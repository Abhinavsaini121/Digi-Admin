// import React, { useState } from "react";
// import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import defaulting from "../assets/logo(1).png";
// import { adminLogin } from "../auth/adminLogin"; // Import service

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       // API Call
//       const data = await adminLogin(email, password);

//       // Save to localStorage (Token and Role)
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.admin.role);
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("id", data.admin.id);

//       toast.success("Login successful!");

//       setTimeout(() => {
//         navigate("/");
//       }, 1000);
//     } catch (err) {
//       // Backend error message handle karega
//       toast.error(err.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
//       <Toaster position="top-center" />

//       <div className="w-full max-w-md">
//         <div className="text-center mb-6">
//           <div className="w-20 h-20 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center shadow-lg mb-4">
//             <img src={defaulting} alt="logo" className="w-12 h-12" />
//           </div>
//           <h1 className="text-3xl font-extrabold text-gray-800">
//             Time2Cash Admin Panel Login
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
//         </div>

//         <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8">
//           <form onSubmit={handleLogin}>
//             {/* Email */}
//             <div className="mb-5">
//               <label className="text-sm font-medium text-gray-600 mb-1 block">
//                 Email
//               </label>
//               <div className="relative">
//                 <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="email"
//                   placeholder="example@gmail.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-11 pr-4 py-3 rounded-xl border border-orange-200 bg-orange-50 focus:ring-2 focus:ring-orange-200 outline-none"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="mb-6">
//               <label className="text-sm font-medium text-gray-600 mb-1 block">
//                 Password
//               </label>
//               <div className="relative">
//                 <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => {
//                     if (e.target.value.length <= 6) {
//                       setPassword(e.target.value);
//                     }
//                   }}
//                   className="w-full pl-11 pr-12 py-3 rounded-xl border border-orange-200 bg-orange-50 focus:ring-2 focus:ring-orange-200 outline-none"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
//                 >
//                   {showPassword ? <FiEyeOff /> : <FiEye />}
//                 </button>
//               </div>
//             </div>

//             {/* Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-2xl bg-[#FE702E] hover:bg-orange-600 text-white font-semibold text-lg transition ${
//                 loading ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         </div>
//         <p className="text-center text-xs text-gray-400 mt-6">
//           © Time2Cash App Admin Panel
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useRef, useEffect } from "react";
import { FiPhone, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import defaulting from "../assets/logo(1).png";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);

  const otpRefs = useRef([]);
  const navigate = useNavigate();

  // Countdown for resend button
  useEffect(() => {
    if (!showOtpModal) return;
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showOtpModal, resendTimer]);

  const isValidPhone = (value) => /^[6-9]\d{9}$/.test(value); // 10-digit Indian mobile format, adjust as needed

  // Step 1: "Send" OTP (dummy — no real API call)
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    // Fake network delay
    setTimeout(() => {
      toast.success("OTP sent to your phone (dummy mode)");
      setOtp(Array(OTP_LENGTH).fill(""));
      setResendTimer(RESEND_SECONDS);
      setShowOtpModal(true);
      setLoading(false);
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    }, 800);
  };

  // Step 2: "Verify" OTP — DUMMY: any 6 digits entered logs in successfully
  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the complete OTP");
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      // ---- DUMMY LOGIN: no backend check, always succeeds ----
      localStorage.setItem("token", "dummy-token-123");
      localStorage.setItem("role", "admin");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("id", "dummy-id-001");

      toast.success("Login successful!");
      setVerifying(false);
      setShowOtpModal(false);

      setTimeout(() => {
        navigate("/");
      }, 800);
    }, 600);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    toast.success("OTP resent (dummy mode)");
    setOtp(Array(OTP_LENGTH).fill(""));
    setResendTimer(RESEND_SECONDS);
    otpRefs.current[0]?.focus();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((digit, i) => (newOtp[i] = digit));
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center shadow-lg mb-4">
            <img src={defaulting} alt="logo" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Time2Cash Admin Panel Login
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in with your phone number
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8">
          <form onSubmit={handleSendOtp}>
            {/* Phone */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <span className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  maxLength={10}
                  className="w-full pl-20 pr-4 py-3 rounded-xl border border-orange-200 bg-orange-50 focus:ring-2 focus:ring-orange-200 outline-none"
                  required
                />
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
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          © Time2Cash App Admin Panel
        </p>
      </div>

      {/* OTP Popup Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOtpModal(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                <FiPhone className="text-[#FE702E]" size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Verify OTP</h2>
              <p className="text-gray-500 text-sm mt-1">
                Code sent to{" "}
                <span className="font-medium text-gray-700">+91 {phone}</span>
              </p>
              <p className="text-xs text-orange-400 mt-1">
                (Dummy mode: enter any {OTP_LENGTH} digits)
              </p>
            </div>

            {/* OTP Boxes */}
            <div
              className="flex justify-center gap-2 mb-6"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-semibold rounded-xl border border-orange-200 bg-orange-50 focus:ring-2 focus:ring-orange-300 outline-none"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={verifying}
              className={`w-full py-3 rounded-2xl bg-[#FE702E] hover:bg-orange-600 text-white font-semibold text-lg transition mb-4 ${
                verifying ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {verifying ? "Verifying..." : "Verify & Login"}
            </button>

            <div className="text-center text-sm text-gray-500">
              {resendTimer > 0 ? (
                <span>Resend OTP in {resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-[#FE702E] font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
