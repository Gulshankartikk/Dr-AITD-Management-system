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
import { GraduationCap, ArrowLeft } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">College ERP</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            {['student', 'teacher', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 px-4 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${role === r
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          <Input
            label={role === "student" ? "Email or Roll Number" : "Username / Email"}
            type="text"
            placeholder="Enter your identifier"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end mt-2">
              <Link
                to="/forgetPassword"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3"
            isLoading={isLoading}
          >
            Sign in
          </Button>

          {role === 'student' && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          )}
        </form>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden lg:block w-1/2 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80"
          alt="University Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-gray-900/80 to-transparent text-white">
          <h2 className="text-3xl font-bold mb-4">Streamline Your Academic Journey</h2>
          <p className="text-lg text-gray-200 max-w-md">
            Access your courses, track attendance, and manage your academic life in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
