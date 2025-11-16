import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../constants/baseUrl';

const TeacherHeader = ({ currentRole = 'teacher' }) => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    fetchStudentId();
  }, []);

  const fetchStudentId = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/admin/students`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (response.data.students?.length > 0) {
        setStudentId(response.data.students[0]._id);
      }
    } catch (error) {
      console.error('Error fetching student ID:', error);
    }
  };

  const handleRoleSwitch = (role) => {
    if (role === 'student' && studentId) {
      navigate(`/student/${studentId}/dashboard`);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">Teacher Portal</h1>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-green-500 text-white"
            >
              <FaChalkboardTeacher className="mr-2" />
              Teacher
            </button>
            <button
              onClick={() => handleRoleSwitch('student')}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <FaUserGraduate className="mr-2" />
              Student View
            </button>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default TeacherHeader;