import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaGraduationCap } from 'react-icons/fa';
import Cookies from 'js-cookie';

const StudentHeader = ({ studentId, studentName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to={`/student/${studentId}/dashboard`} className="text-2xl font-bold text-blue-600">
              College ERP
            </Link>
            <span className="text-sm text-gray-500">Student Portal</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to={`/student/${studentId}/dashboard`} className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to={`/student/${studentId}/notes`} className="text-gray-700 hover:text-blue-600 font-medium">
              Notes
            </Link>
            <Link to={`/student/${studentId}/materials`} className="text-gray-700 hover:text-blue-600 font-medium">
              Materials
            </Link>
            <Link to={`/student/${studentId}/assignments`} className="text-gray-700 hover:text-blue-600 font-medium">
              Assignments
            </Link>
            <Link to={`/student/${studentId}/attendance`} className="text-gray-700 hover:text-blue-600 font-medium">
              Attendance
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaGraduationCap className="text-blue-500" />
              <span className="text-sm font-medium text-gray-700">{studentName || 'Student'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;