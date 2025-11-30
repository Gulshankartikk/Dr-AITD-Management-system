import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../constants/api"
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/BackButton";

const ForgetPass = () => {
  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const firstPart = pathParts[1];
  console.log(firstPart);

  const [role, setRole] = useState("");

  useEffect(() => {
    if (firstPart == "student") {
      setRole("student");
    } else {
      setRole("teacher");
    }
  }, []);

  // let role = useSelector((state) => state.User.role);

  let { id } = useParams();

  const [email, setEmail] = useState("");

  let navigate = useNavigate("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res =
        role === "teacher"
          ? await axios.post(`${BASE_URL}/teacher/forgetPassword`, {
            email,
          })
          : await axios.post(`${BASE_URL}/student/forgetPassword`, {
            email,
          });

      if (res.data.success) {
        setEmail("");
        toast.success(res.data.msg);
        role === "teacher"
          ? navigate(`/teacher/${id}/forgetPassword/verifyotp`)
          : navigate(`/student/${id}/forgetPassword/verifyotp`);
      }
    } catch (err) {
      console.log("Something went wrong", err);
      toast.error(err.response.data.msg);
    }
  };

  return (
    <div className="flex font-oswald min-h-screen" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      {/* Decorative Side Panel */}
      <div className="w-[40%] h-screen hidden lg:flex flex-col items-center justify-center relative" style={{ background: 'linear-gradient(180deg, rgba(225, 179, 130, 0.15) 0%, rgba(200, 150, 102, 0.15) 100%)' }}>
        <div className="text-center px-8">
          <h1 className="text-6xl font-extrabold mb-6" style={{ color: '#e1b382' }}>Reset</h1>
          <p className="text-2xl font-semibold mb-4" style={{ color: 'white' }}>Password Recovery</p>
          <div className="w-32 h-1 mx-auto mb-6" style={{ backgroundColor: '#c89666' }}></div>
          <p className="text-lg font-medium" style={{ color: '#e1b382' }}>We'll help you get back in</p>
        </div>
      </div>

      {/* Form area */}
      <div className="w-screen lg:w-[60%] min-h-screen flex items-center justify-center flex-col gap-5 px-4">
        <div className="mt-5 ms-5 lg:mt-0 lg:ms-0 self-start">
          <BackButton targetRoute={"/"} />
        </div>

        {/* Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold mb-2" style={{ color: '#e1b382' }}>Forgot Password?</h2>
          <p className="text-lg font-semibold" style={{ color: '#c89666' }}>Enter your email to reset your password</p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-2xl px-8 py-8 shadow-2xl backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '3px solid #e1b382' }}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="block font-bold mb-2 text-sm" style={{ color: '#2d545e' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                className="shadow-lg appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none transition-all"
                style={{ border: '2px solid #e1b382', color: '#12343b' }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white font-bold py-3 px-6 rounded-lg focus:outline-none shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: '#2d545e' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#12343b'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2d545e'}
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
