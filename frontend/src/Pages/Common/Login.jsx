import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/baseUrl";
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
    <div className="flex font-oswald">
      {/* College logo */}
      <div className="w-[50%] h-screen hidden lg:block">
        <img
          className="h-[100%] w-[100%]"
          src={collegeImage}
          alt="college image"
        />
      </div>

      {/* Form area */}
      <div className="w-screen lg:w-[50%] h-screen bg-white flex items-center justify-center flex-col gap-5">
        {/* Logo */}
        <div className="w-[100%] flex items-center justify-center">
          <img
            className="w-[50%]"
            src={logo}
            alt="Dr. Ambedkar Institute of Technology for Handicapped Kanpur"
          />
        </div>

        {/* Form */}
        <div className="w-screen lg:w-[100%] px-10 lg:px-[5rem] xl:px-[10rem]">
          <form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col justify-between gap-2 border-2 border-black rounded-lg px-3 py-3"
          >
            {/* Role options */}
            <div className="w-full flex justify-evenly px-5 mb-4">
              <button
                type="button"
                className={`font-bold ${
                  role === "student" ? "text-blue-500" : "text-gray-500"
                }`}
                onClick={() => setRole("student")}
              >
                Student
              </button>
              <div className="bg-black w-1"></div>
              <button
                type="button"
                className={`font-bold ${
                  role === "teacher" ? "text-blue-500" : "text-gray-500"
                }`}
                onClick={() => setRole("teacher")}
              >
                Teacher
              </button>
              <div className="bg-black w-1"></div>
              <button
                type="button"
                className={`font-bold ${
                  role === "admin" ? "text-blue-500" : "text-gray-500"
                }`}
                onClick={() => setRole("admin")}
              >
                Admin
              </button>
            </div>
            <hr className="border-t-2 border-black" />

            {/* Input fields */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="username"
                >
                  {role === "student" ? "Email/Username/Phone/Roll No" : role === "teacher" ? "Email/Username" : "Username"}
                </label>
                <input
                  type="text"
                  id="username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === "student" ? "Enter email, username, phone or roll number" : role === "teacher" ? "Enter email or username" : "Enter username"}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-1 flex justify-between">
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
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
