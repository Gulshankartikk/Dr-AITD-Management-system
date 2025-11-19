import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addUserDetails } from "../../features/UserSlice";
import { jwtDecode } from "jwt-decode";
import Loader from "./loader/Loader";
import collegeImage from "../../assets/dr-ambedkar-institute-of-technology-for-handicapped-kanpur.jpeg.jpg";
import logo from "../../assets/logo.jpeg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const navigate = useNavigate();

  let dispatch = useDispatch();

  const [imageLoaded, setImageLoaded] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request
      let response;
      if (role === "student") {
        response = await axios.post(`${BASE_URL}/api/student/login`, {
          username,
          password,
        });
      } else if (role === "teacher") {
        response = await axios.post(`${BASE_URL}/api/teacher/login`, {
          username,
          password,
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/admin/login`, {
          username,
          password,
        });
      }

      console.log(response.data);

      const { token } = response.data;

      Cookies.set("token", token);
      localStorage.setItem("token", token);

      dispatch(addUserDetails({ token: token }));

      let decodedToken = jwtDecode(token);
      localStorage.setItem("userId", decodedToken.id);
      localStorage.setItem("userRole", decodedToken.role);
      console.log(decodedToken);

      if (decodedToken.role === "admin") {
        window.location.href = "/admin/dashboard";
        return;
      } else {
        return role === "student"
          ? navigate(`/student/${decodedToken.id}/dashboard`)
          : navigate(`/teacher/${decodedToken.id}/dashboard`);
      }
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err);
      toast.error("Invalid Credentials");
    }
  };



  return (
    <div className="flex font-oswald min-h-screen" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      {/* Decorative Side Panel */}
      <div className="w-[40%] h-screen hidden lg:flex flex-col items-center justify-center relative" style={{ background: 'linear-gradient(180deg, rgba(225, 179, 130, 0.15) 0%, rgba(200, 150, 102, 0.15) 100%)' }}>
        <div className="text-center px-8">
          <h1 className="text-6xl font-extrabold mb-6" style={{ color: '#e1b382' }}>College</h1>
          <p className="text-2xl font-semibold mb-4" style={{ color: 'white' }}>Management System</p>
          <div className="w-32 h-1 mx-auto mb-6" style={{ backgroundColor: '#c89666' }}></div>
          <p className="text-lg font-medium" style={{ color: '#e1b382' }}>Streamlining Educational Excellence</p>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-4">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e1b382' }}></div>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#c89666' }}></div>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e1b382' }}></div>
        </div>
      </div>

      {/* Form area */}
      <div className="w-screen lg:w-[60%] h-screen flex items-center justify-center flex-col gap-5 px-4">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2" style={{ color: '#e1b382' }}>Welcome Back</h2>
          <p className="text-lg font-semibold" style={{ color: '#c89666' }}>Sign in to continue to your portal</p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md">
          <form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col justify-between gap-6 rounded-2xl px-8 py-8 shadow-2xl backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '3px solid #e1b382' }}
          >
            {/* Role options */}
            <div className="w-full flex gap-3 mb-6">
              <button
                type="button"
                className="flex-1 py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105"
                style={{ 
                  backgroundColor: role === "student" ? "#2d545e" : "transparent",
                  color: role === "student" ? "white" : "#2d545e",
                  border: `2px solid ${role === "student" ? "#2d545e" : "#c89666"}`
                }}
                onClick={() => setRole("student")}
              >
                Student
              </button>
              <button
                type="button"
                className="flex-1 py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105"
                style={{ 
                  backgroundColor: role === "teacher" ? "#2d545e" : "transparent",
                  color: role === "teacher" ? "white" : "#2d545e",
                  border: `2px solid ${role === "teacher" ? "#2d545e" : "#c89666"}`
                }}
                onClick={() => setRole("teacher")}
              >
                Teacher
              </button>
              <button
                type="button"
                className="flex-1 py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105"
                style={{ 
                  backgroundColor: role === "admin" ? "#2d545e" : "transparent",
                  color: role === "admin" ? "white" : "#2d545e",
                  border: `2px solid ${role === "admin" ? "#2d545e" : "#c89666"}`
                }}
                onClick={() => setRole("admin")}
              >
                Admin
              </button>
            </div>

            {/* Input fields */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label
                  className="block font-bold mb-2 text-sm"
                  htmlFor="username"
                  style={{ color: '#2d545e' }}
                >
                  {role === "student" ? "Email/Username/Phone/Roll No" : role === "teacher" ? "Email/Username" : "Username"}
                </label>
                <input
                  type="text"
                  id="username"
                  className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                  style={{ border: '2px solid #e1b382', color: '#12343b' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === "student" ? "Enter email, username, phone or roll number" : role === "teacher" ? "Enter email or username" : "Enter username"}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  className="block font-bold mb-2 text-sm"
                  htmlFor="password"
                  style={{ color: '#2d545e' }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                  style={{ border: '2px solid #e1b382', color: '#12343b' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to={
                  role === "student"
                    ? "/student/00151561ada/forgetPassword"
                    : "/teacher/ddfsd45/forgetPassword"
                }
              >
                <u className="cursor-pointer">Forget Password</u>
              </Link>
              {role === "student" && (
                <Link to="/register">
                  <u className="cursor-pointer text-blue-500">Create Account</u>
                </Link>
              )}
              {role === "teacher" && (
                <Link to="/teacher-register">
                  <u className="cursor-pointer text-blue-500">Create Account</u>
                </Link>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-center mt-4 w-[100%]">
              <button
                type="submit"
                className="w-full text-white font-bold py-3 px-6 rounded-lg focus:outline-none shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: '#2d545e' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#12343b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2d545e'}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
