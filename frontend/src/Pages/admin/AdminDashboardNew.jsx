import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { 
  FaUsers, FaChalkboardTeacher, FaBook, FaClipboardList, FaDollarSign,
  FaBell, FaCalendarAlt, FaChartBar, FaCog, FaFileAlt, FaBus, FaHome,
  FaUserShield, FaGraduationCap, FaBuilding, FaMoneyBillWave, FaEnvelope,
  FaUserPlus, FaEdit, FaTrash, FaDownload, FaUpload, FaCheckCircle,
  FaExclamationTriangle, FaClock, FaUserCog, FaBookOpen, FaClipboardCheck
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const AdminDashboardNew = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Mock data for comprehensive features
  const summaryCards = [
    { title: 'Total Students', value: '1,245', icon: FaUsers, color: '#10b981', bg: '#d1fae5', change: '+12%' },
    { title: 'Total Teachers', value: '87', icon: FaChalkboardTeacher, color: '#3b82f6', bg: '#dbeafe', change: '+5%' },
    { title: 'Total Courses', value: '24', icon: FaBook, color: '#f59e0b', bg: '#fef3c7', change: '+2' },
    { title: 'Fee Collection', value: '₹45.2L', icon: FaDollarSign, color: '#8b5cf6', bg: '#ede9fe', change: '+18%' },
    { title: 'Attendance Rate', value: '87%', icon: FaClipboardList, color: '#ec4899', bg: '#fce7f3', change: '+3%' },
    { title: 'Active Assignments', value: '156', icon: FaFileAlt, color: '#14b8a6', bg: '#ccfbf1', change: '+24' }
  ];

  const quickActions = [
    { title: 'Add Student', icon: FaUserPlus, color: '#10b981', link: '/admin/create-student' },
    { title: 'Add Teacher', icon: FaChalkboardTeacher, color: '#3b82f6', link: '/admin/create-teacher' },
    { title: 'Add Course', icon: FaBook, color: '#f59e0b', link: '/admin/add-course' },
    { title: 'Add Subject', icon: FaBookOpen, color: '#8b5cf6', link: '/admin/add-subject' },
    { title: 'Manage Fees', icon: FaMoneyBillWave, color: '#ec4899', link: '/admin/fees' },
    { title: 'Send Notice', icon: FaBell, color: '#14b8a6', link: '/admin/notices' },
    { title: 'View Reports', icon: FaChartBar, color: '#f97316', link: '/admin/reports' },
    { title: 'Settings', icon: FaCog, color: '#6366f1', link: '/admin/settings' }
  ];

  const managementModules = [
    { 
      title: 'Student Management', 
      icon: FaUsers, 
      color: '#10b981',
      items: ['Add/Edit Students', 'Promote Students', 'ID Card Generation', 'Alumni Management'],
      link: '/admin/students'
    },
    { 
      title: 'Teacher Management', 
      icon: FaChalkboardTeacher, 
      color: '#3b82f6',
      items: ['Add/Edit Teachers', 'Assign Subjects', 'Leave Approvals', 'Performance Review'],
      link: '/admin/teachers'
    },
    { 
      title: 'Course Management', 
      icon: FaBook, 
      color: '#f59e0b',
      items: ['Create Courses', 'Add Subjects', 'Syllabus Update', 'Department Setup'],
      link: '/admin/courses'
    },
    { 
      title: 'Fee Management', 
      icon: FaDollarSign, 
      color: '#8b5cf6',
      items: ['Fee Structure', 'Collection Reports', 'Due Tracking', 'Scholarships'],
      link: '/admin/fees'
    },
    { 
      title: 'Attendance Control', 
      icon: FaClipboardList, 
      color: '#ec4899',
      items: ['View Reports', 'Modify Records', 'Analytics', 'Monthly Reports'],
      link: '/admin/attendance'
    },
    { 
      title: 'Exam Management', 
      icon: FaClipboardCheck, 
      color: '#14b8a6',
      items: ['Schedule Exams', 'Seating Plan', 'Result Publishing', 'Marks Entry'],
      link: '/admin/exams'
    },
    { 
      title: 'Library Management', 
      icon: FaBookOpen, 
      color: '#f97316',
      items: ['Add Books', 'Issue/Return', 'Fine Tracking', 'Reports'],
      link: '/admin/library'
    },
    { 
      title: 'Timetable', 
      icon: FaCalendarAlt, 
      color: '#6366f1',
      items: ['Create Timetable', 'Assign Teachers', 'Conflict Detection', 'Lab Schedules'],
      link: '/admin/timetable'
    }
  ];

  const recentActivities = [
    { action: 'New student enrolled', user: 'Rahul Kumar', time: '10 mins ago', type: 'student' },
    { action: 'Fee payment received', user: 'Priya Sharma', time: '25 mins ago', type: 'fee' },
    { action: 'Leave approved', user: 'Dr. Amit Singh', time: '1 hour ago', type: 'leave' },
    { action: 'Assignment created', user: 'Prof. Sneha Patel', time: '2 hours ago', type: 'assignment' },
    { action: 'Exam schedule published', user: 'Admin', time: '3 hours ago', type: 'exam' }
  ];

  const pendingApprovals = [
    { type: 'Leave Request', count: 5, color: '#f59e0b' },
    { type: 'Document Requests', count: 12, color: '#3b82f6' },
    { type: 'Fee Concessions', count: 3, color: '#8b5cf6' },
    { type: 'Student Complaints', count: 7, color: '#ec4899' }
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
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white fixed h-full overflow-y-auto">
        <div className="p-6">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <FaUserShield className="text-3xl" />
            </div>
            <h2 className="font-bold text-xl">Admin Panel</h2>
            <p className="text-sm text-gray-400">College ERP System</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="flex items-center space-x-3 p-3 rounded bg-gray-700 transition">
              <FaChartBar />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/students" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaUsers />
              <span>Students</span>
            </Link>
            <Link to="/admin/teachers" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaChalkboardTeacher />
              <span>Teachers</span>
            </Link>
            <Link to="/admin/courses" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaBook />
              <span>Courses</span>
            </Link>
            <Link to="/admin/attendance" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaClipboardList />
              <span>Attendance</span>
            </Link>
            <Link to="/admin/fees" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaDollarSign />
              <span>Fees</span>
            </Link>
            <Link to="/admin/exams" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaClipboardCheck />
              <span>Exams</span>
            </Link>
            <Link to="/admin/library" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaBookOpen />
              <span>Library</span>
            </Link>
            <Link to="/admin/timetable" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaCalendarAlt />
              <span>Timetable</span>
            </Link>
            <Link to="/admin/reports" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaFileAlt />
              <span>Reports</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition">
              <FaCog />
              <span>Settings</span>
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded hover:bg-red-600 transition">
              <FaUserShield />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Complete control and management of your institution</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4" style={{ borderTop: `4px solid ${card.color}` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 rounded-full" style={{ backgroundColor: card.bg }}>
                  <card.icon className="text-xl" style={{ color: card.color }} />
                </div>
                <span className="text-xs font-semibold text-green-600">{card.change}</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="flex flex-col items-center p-4 rounded-lg hover:shadow-lg transition border border-gray-200"
              >
                <div className="p-3 rounded-full mb-2" style={{ backgroundColor: `${action.color}20` }}>
                  <action.icon className="text-2xl" style={{ color: action.color }} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Management Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Management Modules */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Management Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {managementModules.map((module, index) => (
                  <Link
                    key={index}
                    to={module.link}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:shadow-lg transition"
                    style={{ borderLeftColor: module.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${module.color}20` }}>
                        <module.icon className="text-xl" style={{ color: module.color }} />
                      </div>
                      <h3 className="font-bold text-gray-800">{module.title}</h3>
                    </div>
                    <ul className="space-y-1">
                      {module.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'student' ? 'bg-green-500' :
                        activity.type === 'fee' ? 'bg-blue-500' :
                        activity.type === 'leave' ? 'bg-yellow-500' :
                        activity.type === 'assignment' ? 'bg-purple-500' :
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending Approvals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h2>
              <div className="space-y-3">
                {pendingApprovals.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${item.color}10` }}>
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    <span className="px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: item.color }}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                View All Approvals
              </button>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <FaCheckCircle className="mr-1" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server</span>
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <FaCheckCircle className="mr-1" /> Running
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup</span>
                  <span className="flex items-center text-yellow-600 text-sm font-medium">
                    <FaClock className="mr-1" /> 2 days ago
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm font-medium text-gray-700">65% Used</span>
                </div>
              </div>
              <button className="w-full mt-4 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
                System Settings
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">Today's Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Present Students</span>
                  <span className="font-bold">1,082</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Present Teachers</span>
                  <span className="font-bold">78</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Fee Collected</span>
                  <span className="font-bold">₹2.5L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">New Admissions</span>
                  <span className="font-bold">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardNew;
