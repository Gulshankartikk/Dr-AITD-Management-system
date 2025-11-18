import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserShield, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';
import Cookies from 'js-cookie';

const AdminHeader = ({ currentRole = 'admin' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const switchRole = (role) => {
    if (role === 'teacher') {
      navigate('/teacher/admin/dashboard');
    } else if (role === 'student') {
      navigate('/student/admin/dashboard');
    }
  };

  return (
    <header className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard" className="text-2xl font-bold text-blue-600">
              College ERP
            </Link>
            <span className="text-sm text-gray-500">Admin Panel</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/admin/add-course" className="text-gray-700 hover:text-blue-600 font-medium">
              Courses
            </Link>
            <Link to="/admin/create-teacher" className="text-gray-700 hover:text-blue-600 font-medium">
              Teachers
            </Link>
            <Link to="/admin/create-student" className="text-gray-700 hover:text-blue-600 font-medium">
              Students
            </Link>
            <Link to="/admin/notifications" className="text-gray-700 hover:text-blue-600 font-medium">
              Reports
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => switchRole('teacher')}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                title="Switch to Teacher View"
              >
                <FaChalkboardTeacher />
                <span>Teacher</span>
              </button>
              <button
                onClick={() => switchRole('student')}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                title="Switch to Student View"
              >
                <FaGraduationCap />
                <span>Student</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <FaUserShield className="text-red-500" />
              <span className="text-sm font-medium text-gray-700">GulshankarTikk</span>
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

export default AdminHeader;