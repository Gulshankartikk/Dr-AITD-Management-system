import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import {
  FaUsers, FaChalkboardTeacher, FaBook, FaClipboardList, FaDollarSign,
  FaBell, FaCalendarAlt, FaChartBar, FaCog, FaFileAlt, FaBookOpen,
  FaClipboardCheck, FaMoneyBillWave, FaUserPlus, FaCheckCircle, FaClock
} from 'react-icons/fa';
import Cookies from 'js-cookie';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

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

  // Mock data for comprehensive features
  const summaryCards = [
    { title: 'Total Students', value: '1,245', icon: FaUsers, color: 'text-emerald-600', bg: 'bg-emerald-100', change: '+12%' },
    { title: 'Total Teachers', value: '87', icon: FaChalkboardTeacher, color: 'text-blue-600', bg: 'bg-blue-100', change: '+5%' },
    { title: 'Total Courses', value: '24', icon: FaBook, color: 'text-amber-600', bg: 'bg-amber-100', change: '+2' },
    { title: 'Fee Collection', value: '₹45.2L', icon: FaDollarSign, color: 'text-purple-600', bg: 'bg-purple-100', change: '+18%' },
    { title: 'Attendance Rate', value: '87%', icon: FaClipboardList, color: 'text-pink-600', bg: 'bg-pink-100', change: '+3%' },
    { title: 'Active Assignments', value: '156', icon: FaFileAlt, color: 'text-teal-600', bg: 'bg-teal-100', change: '+24' }
  ];

  const quickActions = [
    { title: 'Add Student', icon: FaUserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/create-student' },
    { title: 'Add Teacher', icon: FaChalkboardTeacher, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/create-teacher' },
    { title: 'Add Course', icon: FaBook, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/add-course' },
    { title: 'Add Subject', icon: FaBookOpen, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/add-subject' },
    { title: 'Manage Fees', icon: FaMoneyBillWave, color: 'text-pink-600', bg: 'bg-pink-50', link: '/admin/fees' },
    { title: 'Send Notice', icon: FaBell, color: 'text-teal-600', bg: 'bg-teal-50', link: '/admin/notices' },
    { title: 'View Reports', icon: FaChartBar, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/reports' },
    { title: 'Settings', icon: FaCog, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/settings' }
  ];

  const managementModules = [
    {
      title: 'Student Management',
      icon: FaUsers,
      color: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      bg: 'bg-emerald-50',
      items: ['Add/Edit Students', 'Promote Students', 'ID Card Generation', 'Alumni Management'],
      link: '/admin/students'
    },
    {
      title: 'Teacher Management',
      icon: FaChalkboardTeacher,
      color: 'text-blue-600',
      borderColor: 'border-blue-500',
      bg: 'bg-blue-50',
      items: ['Add/Edit Teachers', 'Assign Subjects', 'Leave Approvals', 'Performance Review'],
      link: '/admin/teachers'
    },
    {
      title: 'Course Management',
      icon: FaBook,
      color: 'text-amber-600',
      borderColor: 'border-amber-500',
      bg: 'bg-amber-50',
      items: ['Create Courses', 'Add Subjects', 'Syllabus Update', 'Department Setup'],
      link: '/admin/courses'
    },
    {
      title: 'Fee Management',
      icon: FaDollarSign,
      color: 'text-purple-600',
      borderColor: 'border-purple-500',
      bg: 'bg-purple-50',
      items: ['Fee Structure', 'Collection Reports', 'Due Tracking', 'Scholarships'],
      link: '/admin/fees'
    },
    {
      title: 'Attendance Control',
      icon: FaClipboardList,
      color: 'text-pink-600',
      borderColor: 'border-pink-500',
      bg: 'bg-pink-50',
      items: ['View Reports', 'Modify Records', 'Analytics', 'Monthly Reports'],
      link: '/admin/attendance'
    },
    {
      title: 'Exam Management',
      icon: FaClipboardCheck,
      color: 'text-teal-600',
      borderColor: 'border-teal-500',
      bg: 'bg-teal-50',
      items: ['Schedule Exams', 'Seating Plan', 'Result Publishing', 'Marks Entry'],
      link: '/admin/exams'
    },
    {
      title: 'Library Management',
      icon: FaBookOpen,
      color: 'text-orange-600',
      borderColor: 'border-orange-500',
      bg: 'bg-orange-50',
      items: ['Add Books', 'Issue/Return', 'Fine Tracking', 'Reports'],
      link: '/admin/library'
    },
    {
      title: 'Timetable',
      icon: FaCalendarAlt,
      color: 'text-indigo-600',
      borderColor: 'border-indigo-500',
      bg: 'bg-indigo-50',
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
    { type: 'Leave Request', count: 5, color: 'bg-amber-500' },
    { type: 'Document Requests', count: 12, color: 'bg-blue-500' },
    { type: 'Fee Concessions', count: 3, color: 'bg-purple-500' },
    { type: 'Student Complaints', count: 7, color: 'bg-pink-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Overview and controls for the entire institution</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`text-lg ${card.color}`} />
                </div>
                <span className="text-xs font-semibold text-emerald-600">{card.change}</span>
              </div>
              <p className="text-xs font-medium text-gray-500">{card.title}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
              >
                <div className={`p-3 rounded-full mb-2 group-hover:scale-110 transition-transform ${action.bg}`}>
                  <action.icon className={`text-xl ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{action.title}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Management Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Management Modules */}
          <Card>
            <CardHeader>
              <CardTitle>Management Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {managementModules.map((module, index) => (
                  <Link
                    key={index}
                    to={module.link}
                    className={`p-4 border rounded-xl hover:shadow-md transition-all duration-200 border-l-4 ${module.borderColor}`}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg mr-3 ${module.bg}`}>
                        <module.icon className={`text-lg ${module.color}`} />
                      </div>
                      <h3 className="font-bold text-gray-900">{module.title}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {module.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-gray-300 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${activity.type === 'student' ? 'bg-emerald-500' :
                          activity.type === 'fee' ? 'bg-blue-500' :
                            activity.type === 'leave' ? 'bg-amber-500' :
                              activity.type === 'assignment' ? 'bg-purple-500' :
                                'bg-red-500'
                        }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingApprovals.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    <Badge className={`${item.color} text-white border-none`}>
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="primary" className="w-full mt-4">
                View All Approvals
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center text-emerald-600 text-xs font-bold uppercase tracking-wider">
                    <FaCheckCircle className="mr-1" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server</span>
                  <span className="flex items-center text-emerald-600 text-xs font-bold uppercase tracking-wider">
                    <FaCheckCircle className="mr-1" /> Running
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup</span>
                  <span className="flex items-center text-amber-600 text-xs font-bold uppercase tracking-wider">
                    <FaClock className="mr-1" /> 2 days ago
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm font-medium text-gray-900">65% Used</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-4">
                System Settings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
            <CardContent>
              <h3 className="font-bold text-lg mb-4">Today's Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">Present Students</span>
                  <span className="font-bold">1,082</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">Present Teachers</span>
                  <span className="font-bold">78</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">Fee Collected</span>
                  <span className="font-bold">₹2.5L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">New Admissions</span>
                  <span className="font-bold">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardNew;
