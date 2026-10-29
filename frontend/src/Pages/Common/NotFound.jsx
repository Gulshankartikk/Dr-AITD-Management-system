import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaExclamationTriangle, FaArrowLeft, FaCompass } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Cookies from 'js-cookie';

const NotFound = () => {
  const navigate = useNavigate();

  // Try to decode current user role from token
  const getDestination = () => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (!token) return { label: 'Go to Home', path: '/' };
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') return { label: 'Return to Admin Dashboard', path: '/admin/dashboard' };
      if (payload.role === 'teacher') return { label: 'Return to Faculty Dashboard', path: `/teacher/${payload.id || payload.user_id}/dashboard` };
      if (payload.role === 'student') return { label: 'Return to Student Dashboard', path: `/student/${payload.id || payload.user_id}/dashboard` };
    } catch (e) {
      // Ignore parse failure
    }
    return { label: 'Go to Login', path: '/login' };
  };

  const dest = getDestination();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <div className="mb-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaCompass className="text-3xl" />
          </div>
          <h1 className="text-5xl font-extrabold text-secondary mb-1 font-heading">404</h1>
          <h2 className="text-xl font-bold text-secondary mb-2 font-heading">Page Not Found</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            The ERP page or record you are looking for does not exist, has been archived, or you may not have authorization to view it.
          </p>
        </div>

        <div className="space-y-3">
          <Link to={dest.path} className="block">
            <Button className="w-full flex items-center justify-center gap-2">
              <FaHome />
              <span>{dest.label}</span>
            </Button>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-text-secondary hover:text-secondary hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <FaArrowLeft />
            <span>Go Back to Previous Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
