import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FaExclamationTriangle className="mx-auto text-6xl text-yellow-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaHome />
            <span>Go to Login</span>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try one of these:</p>
            <div className="mt-2 space-x-4">
              <Link to="/admin/dashboard" className="text-blue-500 hover:underline">
                Admin Dashboard
              </Link>
              <span>•</span>
              <button 
                onClick={() => window.history.back()} 
                className="text-blue-500 hover:underline"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
