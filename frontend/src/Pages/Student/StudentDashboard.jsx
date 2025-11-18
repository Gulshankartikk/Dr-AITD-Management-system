import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
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

const StudentDashboard = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/student/${studentId}/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudent(response.data.student);
    } catch (error) {
      console.error('Error fetching student data:', error);
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
      title: "Notes",
      description: "Access your class notes",
      icon: <FaFileAlt className="text-3xl text-blue-500" />,
      link: `/student/${studentId}/notes`,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Study Materials",
      description: "Download study materials",
      icon: <FaBook className="text-3xl text-green-500" />,
      link: `/student/${studentId}/materials`,
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Assignments",
      description: "View and submit assignments",
      icon: <FaTasks className="text-3xl text-purple-500" />,
      link: `/student/${studentId}/assignments`,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    },
    {
      title: "Attendance",
      description: "Check your attendance record",
      icon: <FaClipboardList className="text-3xl text-orange-500" />,
      link: `/student/${studentId}/attendance`,
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader studentId={studentId} studentName={student?.name} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaGraduationCap className="text-3xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome, {student?.name || "Student"}
                </h1>
                <p className="text-gray-600">Ready to learn something new today?</p>
              </div>
            </div>
            
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <span className="text-gray-700">Roll No: {student?.rollNo}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Email: {student?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGraduationCap className="text-gray-500" />
                <span className="text-gray-700">Course: {student?.courseId?.courseName}</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} border-2 p-6 rounded-lg transition-all duration-200 hover:shadow-md`}
              >
                <div className="text-center">
                  <div className="mb-4">{action.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
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