import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserShield, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';
import Cookies from 'js-cookie';
import useAutoLogout from '../hooks/useAutoLogout';

const AdminHeader = ({ currentRole = 'admin' }) => {
  const navigate = useNavigate();
  const logout = useAutoLogout(120000); // 2 minutes

  const handleLogout = () => {
    logout();
  };

  const switchRole = (role) => {
    if (role === 'teacher') {
      alert('Teacher view would require proper authentication');
    } else if (role === 'student') {
      alert('Student view would require proper authentication');
    }
  };

  return (
    <header className="bg-night-blue shadow-lg border-b border-night-blue-shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard" className="text-2xl font-bold text-sand-tan hover:text-white transition-colors font-oswald tracking-wide">
              College ERP
            </Link>
            <span className="text-sm text-gray-300 bg-night-blue-shadow px-2 py-1 rounded">Admin Panel</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/admin/dashboard" className="text-gray-300 hover:text-sand-tan font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/admin/students" className="text-gray-300 hover:text-sand-tan font-medium transition-colors">
              Students
            </Link>
            <Link to="/admin/teachers" className="text-gray-300 hover:text-sand-tan font-medium transition-colors">
              Teachers
            </Link>
            <Link to="/admin/courses" className="text-gray-300 hover:text-sand-tan font-medium transition-colors">
              Courses
            </Link>
            <Link to="/admin/add-subject" className="text-gray-300 hover:text-sand-tan font-medium transition-colors">
              Subjects
            </Link>
            <Link to="/admin/reports" className="text-gray-300 hover:text-sand-tan font-medium transition-colors">
              Reports
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => switchRole('teacher')}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-night-blue-shadow text-sand-tan rounded-lg hover:bg-opacity-80 transition-colors border border-sand-tan border-opacity-20"
                title="Switch to Teacher View"
              >
                <FaChalkboardTeacher />
                <span>Teacher</span>
              </button>
              <button
                onClick={() => switchRole('student')}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-night-blue-shadow text-sand-tan rounded-lg hover:bg-opacity-80 transition-colors border border-sand-tan border-opacity-20"
                title="Switch to Student View"
              >
                <FaGraduationCap />
                <span>Student</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sand-tan">
              <FaUserShield />
              <span className="text-sm font-medium">Gulshankartikk</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-4 py-2 bg-sand-tan text-night-blue-shadow font-bold rounded-lg hover:bg-sand-tan-shadow transition-colors shadow-md"
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
