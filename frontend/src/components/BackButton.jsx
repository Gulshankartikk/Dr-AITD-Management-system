import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is admin
  const isAdmin = () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      if (!token) return false;
      const decoded = jwtDecode(token);
      return decoded.role === 'admin';
    } catch {
      return false;
    }
  };

  // Only show back button for admin users
  if (!isAdmin()) {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors ${className}`}
    >
      <FaArrowLeft />
      <span>Back</span>
    </button>
  );
};

export default BackButton;