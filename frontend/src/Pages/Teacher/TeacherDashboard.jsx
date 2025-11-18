import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { 
  FaUsers, 
  FaClipboardList, 
  FaStickyNote, 
  FaBell, 
  FaChartBar,
  FaCalendarAlt,
  FaPlus,
  FaEye
} from 'react-icons/fa';
import { MdAssignment, MdNotifications, MdGrade } from 'react-icons/md';
import Cookies from 'js-cookie';
import LoadingSpinner from '../../components/LoadingSpinner';
import TeacherHeader from '../../components/TeacherHeader';
import CourseForm from '../../components/CourseForm';
import SubjectForm from '../../components/SubjectForm';
import BackButton from '../../components/BackButton';
import { AttendanceModal, AssignmentModal, NoticeModal, MaterialModal } from '../../components/TeacherModals';

const TeacherDashboard = () => {
  const { id: teacherId } = useParams();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  const fetchDashboardData = async (retryCount = 0) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${BASE_URL}/api/teacher/${teacherId}/dashboard`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );
      setDashboardData(response.data);
      setError('');
    } catch (error) {
      console.error('Dashboard error:', error);
      
      // Retry logic
      if (retryCount < 2 && error.code !== 'ECONNREFUSED') {
        setTimeout(() => fetchDashboardData(retryCount + 1), 1000);
        return;
      }
      
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchDashboardData();
    }
  }, [teacherId]);

  if (loading) {
    return <LoadingSpinner message="Loading teacher dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const { teacher, assignments } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader currentRole="teacher" />
      <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <BackButton className="mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome,gulshan {teacher?.name}!
        </h1>
        <p className="text-gray-600">
          Department: {teacher?.department || 'Not specified'} | 
          Designation: {teacher?.designation || 'Teacher'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaUsers size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned Courses</p>
              <p className="text-2xl font-bold text-gray-900">{teacher?.assignedCourse?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaStickyNote size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{teacher?.assignedSubjects?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <MdAssignment size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{assignments?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaCalendarAlt size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Classes</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowAttendanceModal(true)}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaClipboardList className="text-blue-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Mark Attendance</span>
          </button>
          
          <button 
            onClick={() => setShowAssignmentModal(true)}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaPlus className="text-green-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Add Assignment</span>
          </button>
          
          <button 
            onClick={() => setShowNoticeModal(true)}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <MdNotifications className="text-purple-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Post Notice</span>
          </button>
          
          <button 
            onClick={() => setShowMaterialModal(true)}
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <FaStickyNote className="text-orange-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Upload Material</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assigned Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Assigned Courses</h2>
            <FaUsers className="text-blue-500" size={20} />
          </div>
          <div className="space-y-4">
            {teacher?.assignedCourse?.map((course, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium text-gray-800">{course.courseName}</p>
                <p className="text-sm text-gray-600">Code: {course.courseCode}</p>
                <p className="text-xs text-gray-500">Duration: {course.courseDuration}</p>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No courses assigned</p>
            )}
          </div>
        </div>

        {/* Assigned Subjects */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Assigned Subjects</h2>
            <FaStickyNote className="text-green-500" size={20} />
          </div>
          <div className="space-y-4">
            {teacher?.assignedSubjects?.map((subject, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-medium text-gray-800">{subject.subjectName}</p>
                <p className="text-sm text-gray-600">Code: {subject.subjectCode}</p>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No subjects assigned</p>
            )}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Assignments</h2>
            <MdAssignment className="text-purple-500" size={20} />
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Data Structures Assignment 1</p>
                  <p className="text-sm text-gray-600">Data Structures and Algorithms</p>
                  <p className="text-xs text-gray-500">Due: Feb 15, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">2/3</p>
                  <p className="text-xs text-gray-500">Submitted</p>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Database Project</p>
                  <p className="text-sm text-gray-600">Database Management Systems</p>
                  <p className="text-xs text-gray-500">Due: Mar 1, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">0/3</p>
                  <p className="text-xs text-gray-500">Submitted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Today's Schedule</h2>
            <FaCalendarAlt className="text-orange-500" size={20} />
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <p className="font-medium text-gray-800">Data Structures - CSE201</p>
              <p className="text-sm text-gray-600">10:00 AM - 11:00 AM</p>
              <p className="text-xs text-gray-500">Room: CS-101</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <p className="font-medium text-gray-800">Database Systems - CSE301</p>
              <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
              <p className="text-xs text-gray-500">Room: CS-102</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {teacher?.assignedSubjects?.length || 0}
            </div>
            <p className="text-gray-600">Active Subjects</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {assignments?.length || 0}
            </div>
            <p className="text-gray-600">Total Assignments</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              0
            </div>
            <p className="text-gray-600">Students Taught</p>
          </div>
        </div>
      </div>

      {/* Course and Subject Creation */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Course</h2>
          <CourseForm userRole="teacher" userId={teacherId} onSuccess={fetchDashboardData} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Subject</h2>
          <SubjectForm userRole="teacher" userId={teacherId} onSuccess={fetchDashboardData} />
        </div>
      </div>

      {/* Additional Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={`/teacher/${teacherId}/summary`}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaBell className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="font-medium text-gray-800">Activity Summary</p>
              <p className="text-sm text-gray-600">View all my activities</p>
            </div>
          </a>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <FaChartBar className="text-gray-400 mr-3" size={24} />
            <div>
              <p className="font-medium text-gray-500">Reports</p>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <FaCalendarAlt className="text-gray-400 mr-3" size={24} />
            <div>
              <p className="font-medium text-gray-500">Schedule</p>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Modals */}
      <AttendanceModal isOpen={showAttendanceModal} onClose={() => setShowAttendanceModal(false)} teacherId={teacherId} />
      <AssignmentModal isOpen={showAssignmentModal} onClose={() => setShowAssignmentModal(false)} teacherId={teacherId} />
      <NoticeModal isOpen={showNoticeModal} onClose={() => setShowNoticeModal(false)} teacherId={teacherId} />
      <MaterialModal isOpen={showMaterialModal} onClose={() => setShowMaterialModal(false)} teacherId={teacherId} />
    </div>
  );
};

export default TeacherDashboard;