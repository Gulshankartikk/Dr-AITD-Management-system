import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { 
  FaUser, FaBook, FaClipboardList, FaBell, FaCalendarAlt, FaFileAlt, 
  FaChartBar, FaUsers, FaUpload, FaDownload, FaEdit, FaCheckCircle,
  FaClock, FaExclamationTriangle, FaEnvelope, FaGraduationCap, FaTasks,
  FaClipboardCheck, FaChalkboardTeacher, FaPaperPlane, FaFileUpload
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const TeacherDashboardNew = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, [id]);

  const fetchTeacherData = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/teacher/${id}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeacher(response.data.teacher);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data
  const summaryCards = [
    { title: 'Total Students', value: '156', icon: FaUsers, color: '#10b981', bg: '#d1fae5' },
    { title: 'Classes Today', value: '4', icon: FaChalkboardTeacher, color: '#3b82f6', bg: '#dbeafe' },
    { title: 'Pending Assignments', value: '8', icon: FaTasks, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Attendance Rate', value: '87%', icon: FaClipboardCheck, color: '#8b5cf6', bg: '#ede9fe' }
  ];

  const assignedClasses = [
    { class: 'CSE-5A', subject: 'Data Structures', students: 45, attendance: '92%' },
    { class: 'CSE-5B', subject: 'Database Systems', students: 42, attendance: '88%' },
    { class: 'CSE-6A', subject: 'Web Development', students: 38, attendance: '85%' },
    { class: 'CSE-6B', subject: 'Operating Systems', students: 31, attendance: '90%' }
  ];

  const recentAssignments = [
    { title: 'DSA Assignment 3', class: 'CSE-5A', submitted: 38, total: 45, deadline: '2024-01-25' },
    { title: 'DBMS Project', class: 'CSE-5B', submitted: 40, total: 42, deadline: '2024-01-28' },
    { title: 'Web App Development', class: 'CSE-6A', submitted: 25, total: 38, deadline: '2024-01-30' }
  ];

  const todaySchedule = [
    { time: '9:00 AM - 10:00 AM', subject: 'Data Structures', class: 'CSE-5A', room: 'Lab 101' },
    { time: '11:00 AM - 12:00 PM', subject: 'DBMS', class: 'CSE-5B', room: 'Room 205' },
    { time: '2:00 PM - 3:00 PM', subject: 'Web Dev', class: 'CSE-6A', room: 'Lab 102' },
    { time: '3:00 PM - 4:00 PM', subject: 'OS', class: 'CSE-6B', room: 'Room 301' }
  ];

  const notifications = [
    { title: 'Assignment Submission', message: '15 new submissions for DSA Assignment', time: '1 hour ago', type: 'assignment' },
    { title: 'Leave Request', message: '3 students requested leave for tomorrow', time: '3 hours ago', type: 'leave' },
    { title: 'Exam Schedule', message: 'Mid-term exam schedule released', time: '5 hours ago', type: 'exam' }
  ];

  const studentPerformance = [
    { name: 'Rahul Kumar', rollNo: 'CSE001', attendance: '95%', avgMarks: '88', status: 'excellent' },
    { name: 'Priya Sharma', rollNo: 'CSE002', attendance: '92%', avgMarks: '85', status: 'good' },
    { name: 'Amit Singh', rollNo: 'CSE003', attendance: '78%', avgMarks: '72', status: 'warning' },
    { name: 'Sneha Patel', rollNo: 'CSE004', attendance: '88%', avgMarks: '80', status: 'good' }
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
      <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white fixed h-full overflow-y-auto">
        <div className="p-6">
          {/* Profile Section */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
              <FaChalkboardTeacher className="text-5xl text-indigo-900" />
            </div>
            <h3 className="font-bold text-lg">{teacher?.name || 'Demo Teacher'}</h3>
            <p className="text-sm text-indigo-200">Employee ID: T001</p>
            <p className="text-xs text-indigo-300 mt-1">Computer Science Dept.</p>
          </div>

          {/* Quick Info */}
          <div className="bg-indigo-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Designation</span>
              <span className="font-bold text-xs">Asst. Professor</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Experience</span>
              <span className="font-bold">5 Years</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Subjects</span>
              <span className="font-bold">4</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link to={`/teacher/${id}/profile`} className="flex items-center space-x-3 p-3 rounded hover:bg-indigo-700 transition">
              <FaUser />
              <span>Profile</span>
            </Link>
            <Link to={`/teacher/${id}/attendance`} className="flex items-center space-x-3 p-3 rounded hover:bg-indigo-700 transition">
              <FaClipboardList />
              <span>Attendance</span>
            </Link>
            <Link to={`/teacher/${id}/assignments`} className="flex items-center space-x-3 p-3 rounded hover:bg-indigo-700 transition">
              <FaTasks />
              <span>Assignments</span>
            </Link>
            <Link to={`/teacher/${id}/students`} className="flex items-center space-x-3 p-3 rounded hover:bg-indigo-700 transition">
              <FaUsers />
              <span>Students</span>
            </Link>
            <Link to={`/teacher/${id}/materials`} className="flex items-center space-x-3 p-3 rounded hover:bg-indigo-700 transition">
              <FaBook />
              <span>Study Materials</span>
            </Link>
            <Link to={`/teacher/${id}/marks`} className="flex items-center space-x-3 p-3 rounded hover:bg-indigo-700 transition">
              <FaChartBar />
              <span>Marks Entry</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome back, {teacher?.name}!</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            {/* Assigned Classes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaBook className="mr-2 text-indigo-600" />
                  Assigned Classes
                </h2>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm flex items-center">
                  <FaUpload className="mr-2" /> Upload Material
                </button>
              </div>
              <div className="space-y-3">
                {assignedClasses.map((cls, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-white rounded-lg border-l-4 border-indigo-500 hover:shadow-md transition">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{cls.subject}</h3>
                      <p className="text-sm text-gray-600">Class: {cls.class} • {cls.students} Students</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Attendance</p>
                        <p className="font-bold text-green-600">{cls.attendance}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                          <FaClipboardList />
                        </button>
                        <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                          <FaUsers />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaTasks className="mr-2 text-indigo-600" />
                  Assignment Submissions
                </h2>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center">
                  <FaFileUpload className="mr-2" /> Create New
                </button>
              </div>
              <div className="space-y-3">
                {recentAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.class}</p>
                      <p className="text-xs text-gray-500 mt-1">Due: {assignment.deadline}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">{assignment.submitted}/{assignment.total}</p>
                        <p className="text-xs text-gray-600">Submitted</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                          View All
                        </button>
                        <button className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                          Grade
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-600" />
                Today's Schedule
              </h2>
              <div className="space-y-2">
                {todaySchedule.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border-l-4 border-blue-500">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{slot.subject}</p>
                      <p className="text-sm text-gray-600">{slot.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{slot.class}</p>
                      <p className="text-xs text-gray-600">{slot.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaChartBar className="mr-2 text-indigo-600" />
                Top Student Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Marks</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentPerformance.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.rollNo}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.attendance}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.avgMarks}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.status === 'excellent' ? 'bg-green-100 text-green-800' :
                            student.status === 'good' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaBell className="mr-2 text-indigo-600" />
                Notifications
              </h2>
              <div className="space-y-3">
                {notifications.map((notif, index) => (
                  <div key={index} className="p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
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
                  <FaClipboardList className="mr-2" /> Take Attendance
                </button>
                <button className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center">
                  <FaFileUpload className="mr-2" /> Upload Material
                </button>
                <button className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center">
                  <FaPaperPlane className="mr-2" /> Send Announcement
                </button>
                <button className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center">
                  <FaEdit className="mr-2" /> Enter Marks
                </button>
              </div>
            </div>

            {/* Reports & Analytics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Reports</h2>
              <div className="space-y-2">
                <button className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-between">
                  <span className="flex items-center">
                    <FaChartBar className="mr-2" /> Attendance Report
                  </span>
                  <FaDownload />
                </button>
                <button className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-between">
                  <span className="flex items-center">
                    <FaFileAlt className="mr-2" /> Performance Report
                  </span>
                  <FaDownload />
                </button>
                <button className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-between">
                  <span className="flex items-center">
                    <FaTasks className="mr-2" /> Assignment Report
                  </span>
                  <FaDownload />
                </button>
              </div>
            </div>

            {/* Leave Management */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-md">
              <h3 className="font-bold mb-2">Leave Management</h3>
              <p className="text-sm mb-3">3 pending leave requests</p>
              <button className="w-full bg-white text-purple-600 px-3 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                Review Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardNew;
