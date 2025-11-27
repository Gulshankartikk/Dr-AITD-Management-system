import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { 
  FaBook, 
  FaClipboardList, 
  FaStickyNote, 
  FaBell, 
  FaChartBar,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFileAlt,
  FaTasks,
  FaUser,
  FaGraduationCap
} from 'react-icons/fa';
import { MdAssignment, MdNotifications } from 'react-icons/md';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';


const StudentDashboard = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async (retryCount = 0) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${BASE_URL}/api/student/${studentId}/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );
      setStudent(response.data.student);
    } catch (error) {
      console.error('Error fetching student data:', error);
      
      // Retry logic
      if (retryCount < 2 && error.code !== 'ECONNREFUSED') {
        setTimeout(() => fetchStudentData(retryCount + 1), 1000);
        return;
      }
      
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader studentId={studentId} studentName={student?.name} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "My Profile",
      description: "View your complete profile",
      icon: <FaUser className="text-3xl" style={{ color: '#2d545e' }} />,
      link: `/student/${studentId}/profile`,
      borderColor: '#e1b382'
    },
    {
      title: "Notes",
      description: "Access your class notes",
      icon: <FaFileAlt className="text-3xl" style={{ color: '#2d545e' }} />,
      link: `/student/${studentId}/notes`,
      borderColor: '#c89666'
    },
    {
      title: "Study Materials",
      description: "Download study materials",
      icon: <FaBook className="text-3xl" style={{ color: '#12343b' }} />,
      link: `/student/${studentId}/materials`,
      borderColor: '#e1b382'
    },
    {
      title: "Assignments",
      description: "View and submit assignments",
      icon: <FaTasks className="text-3xl" style={{ color: '#2d545e' }} />,
      link: `/student/${studentId}/assignments`,
      borderColor: '#c89666'
    },
    {
      title: "Attendance",
      description: "Check your attendance record",
      icon: <FaClipboardList className="text-3xl" style={{ color: '#12343b' }} />,
      link: `/student/${studentId}/attendance`,
      borderColor: '#e1b382'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      <StudentHeader studentId={studentId} studentName={student?.name} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8" style={{ borderTop: '4px solid #e1b382' }}>
            <BackButton className="mb-4" />
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#e1b38230' }}>
                <FaGraduationCap className="text-3xl" style={{ color: '#2d545e' }} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold" style={{ color: '#12343b' }}>
                  Welcome, {student?.name || "Student"}
                </h1>
                <p className="font-semibold" style={{ color: '#2d545e' }}>Ready to learn something new today?</p>
              </div>
            </div>
            
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg" style={{ backgroundColor: '#e1b38215' }}>
              <div className="flex items-center space-x-2">
                <FaUser style={{ color: '#2d545e' }} />
                <span className="font-semibold" style={{ color: '#12343b' }}>Roll No: {student?.rollNo}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold" style={{ color: '#12343b' }}>Email: {student?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGraduationCap style={{ color: '#2d545e' }} />
                <span className="font-semibold" style={{ color: '#12343b' }}>Course: {student?.courseId?.courseName}</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white p-6 rounded-lg transition-all duration-200 hover:shadow-2xl transform hover:scale-105 shadow-xl"
                style={{ borderTop: `4px solid ${action.borderColor}` }}
              >
                <div className="text-center">
                  <div className="mb-4">{action.icon}</div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#12343b' }}>{action.title}</h3>
                  <p className="text-sm font-semibold" style={{ color: '#2d545e' }}>{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
