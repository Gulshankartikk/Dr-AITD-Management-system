import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton";
import collegeImage from "../../assets/dr-ambedkar-institute-of-technology-for-handicapped-kanpur.jpeg.jpg";
import logo from "../../assets/logo.jpeg";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    courseId: ""
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses`);
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

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
      const response = await axios.post(`${BASE_URL}/api/student/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        courseId: formData.courseId
      });

      toast.success("Registration successful! You can now login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex font-oswald min-h-screen" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      {/* Decorative Side Panel */}
      <div className="w-[40%] h-screen hidden lg:flex flex-col items-center justify-center relative" style={{ background: 'linear-gradient(180deg, rgba(225, 179, 130, 0.15) 0%, rgba(200, 150, 102, 0.15) 100%)' }}>
        <div className="text-center px-8">
          <h1 className="text-6xl font-extrabold mb-6" style={{ color: '#e1b382' }}>Join Us</h1>
          <p className="text-2xl font-semibold mb-4" style={{ color: 'white' }}>Student Registration</p>
          <div className="w-32 h-1 mx-auto mb-6" style={{ backgroundColor: '#c89666' }}></div>
          <p className="text-lg font-medium" style={{ color: '#e1b382' }}>Start Your Academic Journey</p>
        </div>
      </div>

      {/* Form area */}
      <div className="w-screen lg:w-[60%] min-h-screen flex items-center justify-center flex-col gap-5 overflow-y-auto py-8 px-4">
        {/* Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold mb-2" style={{ color: '#e1b382' }}>Create Account</h2>
          <p className="text-lg font-semibold" style={{ color: '#c89666' }}>Register as a new student</p>
        </div>

        {/* Form */}
        <div className="w-full max-w-2xl">
          <form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col justify-between gap-6 rounded-2xl px-8 py-8 shadow-2xl backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '3px solid #e1b382' }}
          >
            <div className="mb-2">
              <BackButton className="mb-4" />
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="block font-bold mb-2 text-sm" htmlFor="name" style={{ color: '#2d545e' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                  style={{ border: '2px solid #e1b382', color: '#12343b' }}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-bold mb-2 text-sm" htmlFor="email" style={{ color: '#2d545e' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                  style={{ border: '2px solid #e1b382', color: '#12343b' }}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-bold mb-2 text-sm" htmlFor="phone" style={{ color: '#2d545e' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                  style={{ border: '2px solid #e1b382', color: '#12343b' }}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-bold mb-2 text-sm" htmlFor="courseId" style={{ color: '#2d545e' }}>
                  Course
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                  style={{ border: '2px solid #e1b382', color: '#12343b' }}
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block font-bold mb-2 text-sm" htmlFor="password" style={{ color: '#2d545e' }}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                  style={{ border: '2px solid #e1b382', color: '#12343b' }}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-bold mb-2 text-sm" htmlFor="confirmPassword" style={{ color: '#2d545e' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                  style={{ border: '2px solid #e1b382', color: '#12343b' }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex flex-col gap-4 mt-2">
              <button
                type="submit"
                className="w-full text-white font-bold py-3 px-6 rounded-lg focus:outline-none shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: '#2d545e' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#12343b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2d545e'}
              >
                Create Account
              </button>

              <div className="text-center">
                <Link to="/login" className="font-semibold transition-colors" style={{ color: '#2d545e' }} onMouseEnter={(e) => e.target.style.color = '#e1b382'} onMouseLeave={(e) => e.target.style.color = '#2d545e'}>
                  Already have an account? Sign in here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
