import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../services/api';

const TeacherHeader = ({ currentRole = 'teacher' }) => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = Cookies.get('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
      
      // Only fetch student ID if user is teacher or admin
      if (payload.role === 'teacher' || payload.role === 'admin') {
        const response = await axios.get(`${BASE_URL}/api/admin/students`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        if (response.data.students?.length > 0) {
          setStudentId(response.data.students[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleRoleSwitch = (role) => {
    // Only allow role switching for teachers and admins
    if ((userRole === 'teacher' || userRole === 'admin') && role === 'student' && studentId) {
      // Direct navigation to student dashboard
      window.location.href = `/student/${studentId}/dashboard`;
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <div className="shadow-lg px-6 py-4" style={{ background: 'linear-gradient(90deg, #2d545e 0%, #12343b 100%)', borderBottom: '3px solid #e1b382' }}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold" style={{ color: '#e1b382' }}>Teacher Portal</h1>
          {(userRole === 'teacher' || userRole === 'admin') && (
            <div className="flex items-center space-x-2 rounded-lg p-1" style={{ backgroundColor: 'rgba(225, 179, 130, 0.2)' }}>
              <button
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white"
                style={{ backgroundColor: '#e1b382' }}
              >
                <FaChalkboardTeacher className="mr-2" />
                Teacher
              </button>
              <button
                onClick={() => handleRoleSwitch('student')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ color: 'white' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(200, 150, 102, 0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <FaUserGraduate className="mr-2" />
                Student View
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-white rounded-lg transition-all transform hover:scale-105"
          style={{ backgroundColor: '#c89666' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e1b382'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#c89666'}
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default TeacherHeader;
