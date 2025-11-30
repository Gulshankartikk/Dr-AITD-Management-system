import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FaExclamationTriangle className="mx-auto text-6xl text-yellow-500 mb-4" />
          <h1 className="text-4xl font-bold text-navy mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-text-grey mb-4">Page Not Found</h2>
          <p className="text-text-grey mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80 transition-colors"
          >
            <FaHome />
            <span>Go to Login</span>
          </Link>

          <div className="text-sm text-text-grey">
            <p>Or try one of these:</p>
            <div className="mt-2 space-x-4">
              <Link to="/login" className="text-sky-blue hover:underline">
                Login Page
              </Link>
              <span>•</span>
              <button
                onClick={() => window.history.back()}
                className="text-sky-blue hover:underline"
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
