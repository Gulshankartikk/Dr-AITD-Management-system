import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-navy mb-2">Access Denied</h1>
        <p className="text-text-grey mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/login')}
          className="ml-4 px-6 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
