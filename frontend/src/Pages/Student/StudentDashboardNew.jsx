import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { 
  FaUser, FaBook, FaClipboardList, FaBell, FaCalendarAlt, FaFileAlt, 
  FaDollarSign, FaChartBar, FaBus, FaHome, FaEnvelope, FaPhone,
  FaCheckCircle, FaClock, FaExclamationTriangle, FaDownload, FaTimes
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const StudentDashboardNew = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(response.data.student);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const summaryCards = [
    { title: 'Attendance', value: '85%', icon: FaClipboardList, color: '#10b981', bg: '#d1fae5' },
    { title: 'Assignments', value: '12/15', icon: FaFileAlt, color: '#3b82f6', bg: '#dbeafe' },
    { title: 'Library Books', value: '3', icon: FaBook, color: '#f59e0b', bg: '#fef3c7' }
  ];

  const subjects = [
    { name: 'Data Structures', attendance: '90%', status: 'good' },
    { name: 'Database Systems', attendance: '82%', status: 'good' },
    { name: 'Web Development', attendance: '75%', status: 'warning' },
    { name: 'Operating Systems', attendance: '88%', status: 'good' }
  ];

  const assignments = [
    { title: 'DSA Assignment 3', subject: 'Data Structures', dueDate: '2024-01-25', status: 'pending' },
    { title: 'DBMS Project', subject: 'Database Systems', dueDate: '2024-01-28', status: 'submitted' },
    { title: 'Web App Development', subject: 'Web Development', dueDate: '2024-01-30', status: 'pending' }
  ];

  const timetable = [
    { day: 'Monday', time: '9:00 AM', subject: 'Data Structures', room: 'Lab 101' },
    { day: 'Monday', time: '11:00 AM', subject: 'DBMS', room: 'Room 205' },
    { day: 'Tuesday', time: '10:00 AM', subject: 'Web Dev', room: 'Lab 102' },
    { day: 'Wednesday', time: '9:00 AM', subject: 'OS', room: 'Room 301' }
  ];

  const notifications = [
    { title: 'New Assignment Posted', message: 'DSA Assignment 3 has been posted', time: '2 hours ago', type: 'assignment' },
    { title: 'Exam Schedule Released', message: 'Mid-term exams start from Feb 1', time: '5 hours ago', type: 'exam' },
    { title: 'Fee Payment Reminder', message: 'Semester fee due by Jan 31', time: '1 day ago', type: 'fee' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white fixed h-full overflow-y-auto">
        <div className="p-6">
          {/* Profile Section */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
              <FaUser className="text-5xl text-blue-900" />
            </div>
            <h3 className="font-bold text-lg">{student?.name || 'Demo Student'}</h3>
            <p className="text-sm text-blue-200">{student?.rollNo || 'STU001'}</p>
            <p className="text-xs text-blue-300 mt-1">{student?.courseId?.courseName || 'Computer Science'}</p>
          </div>

          {/* Quick Info */}
          <div className="bg-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Semester</span>
              <span className="font-bold">5th</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Section</span>
              <span className="font-bold">A</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">CGPA</span>
              <span className="font-bold">8.5</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link to={`/student/${studentId}/profile`} className="flex items-center space-x-3 p-3 rounded hover:bg-blue-700 transition">
              <FaUser />
              <span>Profile</span>
            </Link>
            <Link to={`/student/${studentId}/attendance`} className="flex items-center space-x-3 p-3 rounded hover:bg-blue-700 transition">
              <FaClipboardList />
              <span>Attendance</span>
            </Link>
            <Link to={`/student/${studentId}/assignments`} className="flex items-center space-x-3 p-3 rounded hover:bg-blue-700 transition">
              <FaFileAlt />
              <span>Assignments</span>
            </Link>
            <Link to={`/student/${studentId}/materials`} className="flex items-center space-x-3 p-3 rounded hover:bg-blue-700 transition">
              <FaBook />
              <span>Study Materials</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {student?.name}!</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6" style={{ borderLeft: `4px solid ${card.color}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                </div>
                <div className="p-4 rounded-full" style={{ backgroundColor: card.bg }}>
                  <card.icon className="text-2xl" style={{ color: card.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject-wise Attendance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaChartBar className="mr-2 text-blue-600" />
                Subject-wise Attendance
              </h2>
              <div className="space-y-3">
                {subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{subject.name}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${subject.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: subject.attendance }}
                        ></div>
                      </div>
                      <span className={`font-bold ${subject.status === 'good' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {subject.attendance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaFileAlt className="mr-2 text-blue-600" />
                Recent Assignments
              </h2>
              <div className="space-y-3">
                {assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {assignment.status === 'submitted' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                          <FaCheckCircle className="mr-1" /> Submitted
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center">
                          <FaClock className="mr-1" /> Pending
                        </span>
                      )}
                      <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Timetable */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-600" />
                This Week's Schedule
              </h2>
              <div className="space-y-2">
                {timetable.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border-l-4 border-blue-500">
                    <div>
                      <p className="font-semibold text-gray-800">{slot.subject}</p>
                      <p className="text-sm text-gray-600">{slot.day} • {slot.time}</p>
                    </div>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">{slot.room}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaBell className="mr-2 text-blue-600" />
                Notifications
              </h2>
              <div className="space-y-3">
                {notifications.map((notif, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center">
                  <FaFileAlt className="mr-2" /> View Results
                </button>
                <button className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center">
                  <FaDollarSign className="mr-2" /> Pay Fees
                </button>
                <button className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center">
                  <FaDownload className="mr-2" /> Download Documents
                </button>
              </div>
            </div>

            {/* Footer Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 shadow-md">
                <h3 className="font-bold mb-1">Exam Results</h3>
                <p className="text-sm">Mid-term results available</p>
                <button className="mt-2 text-xs bg-white text-green-600 px-3 py-1 rounded-full font-medium">View Now</button>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4 shadow-md">
                <h3 className="font-bold mb-1">Fee Status</h3>
                <p className="text-sm">₹5,000 due by Jan 31</p>
                <button className="mt-2 text-xs bg-white text-orange-600 px-3 py-1 rounded-full font-medium">Pay Now</button>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                <h3 className="font-bold mb-1">Documents</h3>
                <p className="text-sm">ID Card, Certificates</p>
                <button className="mt-2 text-xs bg-white text-blue-600 px-3 py-1 rounded-full font-medium">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardNew;
