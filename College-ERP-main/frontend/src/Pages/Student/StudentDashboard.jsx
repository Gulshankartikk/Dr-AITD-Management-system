import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  FaCheckCircle
} from 'react-icons/fa';
import { MdAssignment, MdNotifications } from 'react-icons/md';
import Cookies from 'js-cookie';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentDashboard = () => {
  const { studentId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        `${BASE_URL}/api/student/${studentId}/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDashboardData(response.data.dashboard);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchDashboardData();
    }
  }, [studentId]);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const { student, subjectAttendance, assignments, notices, notes, studyMaterials, overallStats } = dashboardData || {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {student?.name}!
        </h1>
        <p className="text-gray-600">
          Course: {student?.courseId?.courseName} | Roll No: {student?.rollNo}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBook size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats?.totalSubjects || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <MdAssignment size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats?.totalAssignments || 0}</p>
              <p className="text-xs text-green-600">
                {overallStats?.submittedAssignments || 0} submitted
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaExclamationTriangle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats?.overdueAssignments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <MdNotifications size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notices</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats?.totalNotices || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Attendance Overview</h2>
            <FaChartBar className="text-blue-500" size={20} />
          </div>
          <div className="space-y-4">
            {subjectAttendance?.slice(0, 5).map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{subject.subject.subjectName}</p>
                  <p className="text-sm text-gray-600">
                    {subject.present}/{subject.total} classes
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className={`h-2 rounded-full ${
                        subject.percentage >= 75 ? 'bg-green-500' : 
                        subject.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.percentage}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${
                    subject.percentage >= 75 ? 'text-green-600' : 
                    subject.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {subject.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Assignments</h2>
            <MdAssignment className="text-green-500" size={20} />
          </div>
          <div className="space-y-4">
            {assignments?.slice(0, 5).map((assignment, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{assignment.title}</p>
                    <p className="text-sm text-gray-600">{assignment.subjectId.subjectName}</p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {assignment.isSubmitted ? (
                      <FaCheckCircle className="text-green-500" size={20} />
                    ) : assignment.isOverdue ? (
                      <FaExclamationTriangle className="text-red-500" size={20} />
                    ) : (
                      <FaCalendarAlt className="text-yellow-500" size={20} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Notices</h2>
            <FaBell className="text-purple-500" size={20} />
          </div>
          <div className="space-y-4">
            {notices?.slice(0, 5).map((notice, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                <p className="font-medium text-gray-800">{notice.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{notice.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notice.createdAt).toLocaleDateString()} by {notice.teacherId?.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Study Materials & Notes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Study Materials</h2>
            <FaStickyNote className="text-orange-500" size={20} />
          </div>
          <div className="space-y-4">
            {studyMaterials?.slice(0, 3).map((material, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                <p className="font-medium text-gray-800">{material.title}</p>
                <p className="text-sm text-gray-600">{material.subjectId.subjectName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(material.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {notes?.slice(0, 2).map((note, index) => (
              <div key={`note-${index}`} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium text-gray-800">{note.title}</p>
                <p className="text-sm text-gray-600">{note.subjectId.subjectName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <FaClipboardList className="text-blue-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">View Attendance</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <MdAssignment className="text-green-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Assignments</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <FaBell className="text-purple-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">All Notices</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <FaStickyNote className="text-orange-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Study Materials</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;