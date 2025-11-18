import React, { useState } from "react";
import { BASE_URL } from "../../constants/baseUrl";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton";
import collegeImage from "../../assets/dr-ambedkar-institute-of-technology-for-handicapped-kanpur.jpeg.jpg";
import logo from "../../assets/logo.jpeg";

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    department: "",
    designation: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/teacher/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        department: formData.department,
        designation: formData.designation
      });

      toast.success("Registration successful! You can now login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.msg || "Registration failed");
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
      <div className="w-screen lg:w-[50%] h-screen bg-white flex items-center justify-center flex-col gap-5 overflow-y-auto">
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
            <div className="text-center mb-4">
              <BackButton className="mb-4" />
              <h2 className="text-2xl font-bold text-blue-500">Teacher Registration</h2>
            </div>
            <hr className="border-t-2 border-black" />

            {/* Input fields */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="department">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter your department"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="designation">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter your designation"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-center mt-4 w-[100%]">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Register
              </button>
            </div>

            <div className="text-center mt-4">
              <Link to="/login" className="text-blue-500 hover:text-blue-700">
                Already have an account? Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;