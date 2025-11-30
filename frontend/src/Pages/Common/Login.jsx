import React, { useState } from "react";
import { BASE_URL } from "../../constants/api";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addUserDetails } from "../../features/UserSlice";
import { jwtDecode } from "jwt-decode";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { GraduationCap, ArrowLeft, Eye, EyeOff, Lock, User, Shield } from "lucide-react";
import collegeImg from "../../assets/dr-ambedkar-institute-of-technology-for-handicapped-kanpur.jpeg.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let endpoint = "/api/student/login";
      if (role === "teacher") endpoint = "/api/teacher/login";
      if (role === "admin") endpoint = "/api/admin/login";

      const response = await axios.post(`${BASE_URL}${endpoint}`, {
        username,
        password,
      });

      const { token } = response.data;
      Cookies.set("token", token);
      localStorage.setItem("token", token);
      dispatch(addUserDetails({ token: token }));

      let decodedToken = jwtDecode(token);
      localStorage.setItem("userId", decodedToken.id);
      localStorage.setItem("userRole", decodedToken.role);

      toast.success(`Welcome back, ${decodedToken.role}!`);

      if (decodedToken.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        const path = role === "student"
          ? `/student/${decodedToken.id}/dashboard`
          : `/teacher/${decodedToken.id}/dashboard`;
        navigate(path);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (r) => {
    switch (r) {
      case 'student': return <User size={18} />;
      case 'teacher': return <GraduationCap size={18} />;
      case 'admin': return <Shield size={18} />;
      default: return <User size={18} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative bg-white shadow-2xl z-10">
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8 mt-16 lg:mt-0">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-800 p-3 rounded-xl shadow-lg shadow-blue-200">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">College ERP</span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Management System</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-gray-600 text-lg">Please sign in to continue to your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector */}
          <div className="p-1.5 bg-gray-100/80 rounded-2xl mb-8 border border-gray-200">
            <div className="grid grid-cols-3 gap-2">
              {['student', 'teacher', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${role === r
                    ? 'bg-white text-blue-700 shadow-md transform scale-[1.02]'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
                >
                  <span className="mr-2">{getRoleIcon(r)}</span>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label={role === "student" ? "Email or Roll Number" : "Username / Email"}
              type="text"
              placeholder={role === "student" ? "e.g. 2023001" : "Enter your username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <Link
              to="/forgetPassword"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full py-3.5 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200 transform transition-all active:scale-[0.98]"
            isLoading={isLoading}
          >
            Sign in to Dashboard
          </Button>

          {role === 'student' && (
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Create an account
              </Link>
            </p>
          )}
        </form>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">© 2024 College ERP System. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/60 z-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-blue-600/10 z-10"></div>
        <img
          src={collegeImg}
          alt="College Campus"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[20s]"
        />
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-bold mb-4 leading-tight">Empowering Education Through Technology</h2>
            <p className="text-lg text-blue-50 leading-relaxed max-w-lg">
              Streamline your academic journey with our comprehensive management system. Access resources, track progress, and stay connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

