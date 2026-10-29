import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ className = '', targetRoute, label = 'Back' }) => {
  const navigate = useNavigate();

  return (
    <div className={`inline-block mb-4 ${className}`}>
      <button
        onClick={() => (targetRoute ? navigate(targetRoute) : navigate(-1))}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-secondary hover:bg-gray-100 hover:text-primary shadow-xs transition-colors"
        title="Return to previous page"
      >
        <FaArrowLeft className="text-gray-400 text-xs" />
        <span>{label}</span>
      </button>
    </div>
  );
};

export default BackButton;
