import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { FaUsers, FaBook, FaGraduationCap, FaChalkboardTeacher, FaPlus, FaBell } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import CourseForm from '../../components/CourseForm';
import SubjectForm from '../../components/SubjectForm';
import BackButton from '../../components/BackButton';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (retryCount = 0) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      
      // Retry logic
      if (retryCount < 2 && error.code !== 'ECONNREFUSED') {
        setTimeout(() => fetchDashboardData(retryCount + 1), 1000);
        return;
      }
      
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentRole="admin" />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your college ERP system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboardData?.stats?.totalCourses || 0}
                </p>
              </div>
              <FaBook className="text-blue-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboardData?.stats?.totalSubjects || 0}
                </p>
              </div>
              <FaGraduationCap className="text-green-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboardData?.stats?.totalTeachers || 0}
                </p>
              </div>
              <FaChalkboardTeacher className="text-yellow-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboardData?.stats?.totalStudents || 0}
                </p>
              </div>
              <FaUsers className="text-purple-500 text-3xl" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/add-course"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FaPlus className="text-blue-500 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Add Course</h3>
            <p className="text-gray-600 text-sm">Create new course</p>
          </Link>

          <Link
            to="/admin/add-subject"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FaPlus className="text-green-500 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Add Subject</h3>
            <p className="text-gray-600 text-sm">Create new subject</p>
          </Link>

          <Link
            to="/admin/create-teacher"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FaPlus className="text-yellow-500 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Add Teacher</h3>
            <p className="text-gray-600 text-sm">Create teacher profile</p>
          </Link>

          <Link
            to="/admin/create-student"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FaPlus className="text-purple-500 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Add Student</h3>
            <p className="text-gray-600 text-sm">Create student profile</p>
          </Link>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/notifications"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FaBell className="text-red-500 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Activity Summary</h3>
            <p className="text-gray-600 text-sm">Track all teacher activities</p>
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Add Course</h3>
            <CourseForm userRole="admin" onSuccess={fetchDashboardData} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Add Subject</h3>
            <SubjectForm userRole="admin" onSuccess={fetchDashboardData} />
          </div>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Teachers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Teachers</h2>
            <div className="space-y-3">
              {dashboardData?.teachers?.slice(0, 5).map((teacher) => (
                <div key={teacher._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Students</h2>
            <div className="space-y-3">
              {dashboardData?.students?.slice(0, 5).map((student) => (
                <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.rollNo} - {student.courseId?.courseName}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Sem {student.semester}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;