import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import loginBg from "../../assets/loginBg.jpg";
import logo from "../../assets/DMK_Party.png";
import type { LoginPayload } from "../../types/auth";
import { loginAPI } from "../../services/service_page/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const payload: LoginPayload = { email, password };

    try {
      const response = await loginAPI(payload);
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("firstName", response.firstName);

      if (response.role === "ADMIN") {
        navigate("/admin/dashboard", {
          state: {
            firstName: response.firstName,
            role: response.role,
            token: response.token,
          },
        });
      } else {
        navigate("/home", {
          state: {
            firstName: response.firstName,
            role: response.role,
            token: response.token,
          },
        });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <img src={loginBg} />
          </div>
        </div>

        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF0000] to-[#000000] rounded-bl-full opacity-40">
            <img src={logo} />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              Welcome to Voter Information Portal
            </h2>
            <p className="text-slate-600 mb-8">
              Sign in to continue to your portal
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email (மின்னஞ்சல்)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password (கடவுச்சொல்)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-medium 
  bg-gradient-to-r from-[#002d73] to-[#002d73] 
  hover:from-[#002d73] hover:to-[#002d73]
  transition-all duration-300 shadow-lg hover:shadow-xl 
  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
