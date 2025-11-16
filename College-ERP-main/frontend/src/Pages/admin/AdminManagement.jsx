import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { FaTrash, FaEdit, FaPlus, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [data, setData] = useState({
    courses: [],
    subjects: [],
    teachers: [],
    students: []
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [coursesRes, subjectsRes, teachersRes, studentsRes] = await Promise.all([
        axios.get(`${BASE_URL}/courses`, { headers }),
        axios.get(`${BASE_URL}/subjects`, { headers }),
        axios.get(`${BASE_URL}/teacher`, { headers }),
        axios.get(`${BASE_URL}/student`, { headers })
      ]);

      setData({
        courses: coursesRes.data.courses || [],
        subjects: subjectsRes.data.subjects || [],
        teachers: teachersRes.data.teachers || [],
        students: studentsRes.data.students || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      const token = Cookies.get('token');
      await axios.delete(`${BASE_URL}/api/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`${type} deleted successfully`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading admin data..." />;
  }

  const renderTable = (type, items) => {
    const getColumns = () => {
      switch (type) {
        case 'courses':
          return ['Course Name', 'Course Code', 'Duration', 'Students', 'Actions'];
        case 'subjects':
          return ['Subject Name', 'Subject Code', 'Course', 'Actions'];
        case 'teachers':
          return ['Name', 'Teacher ID', 'Email', 'Department', 'Actions'];
        case 'students':
          return ['Name', 'Student ID', 'Email', 'Course', 'Actions'];
        default:
          return [];
      }
    };

    const renderRow = (item) => {
      switch (type) {
        case 'courses':
          return (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{item.courseName}</td>
              <td className="px-4 py-3">{item.courseCode}</td>
              <td className="px-4 py-3">{item.duration || item.courseDuration}</td>
              <td className="px-4 py-3">{item.students?.length || 0}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete('courses', item._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Course"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          );
        case 'subjects':
          return (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{item.subjectName || item.subject_name}</td>
              <td className="px-4 py-3">{item.subjectCode || item.subject_code}</td>
              <td className="px-4 py-3">{item.courseId?.courseName || 'N/A'}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete('subjects', item._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Subject"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          );
        case 'teachers':
          return (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{item.name}</td>
              <td className="px-4 py-3">{item.teacher_Id}</td>
              <td className="px-4 py-3">{item.email}</td>
              <td className="px-4 py-3">{item.department || 'N/A'}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete('teachers', item._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Teacher"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          );
        case 'students':
          return (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{item.name || `${item.first_name} ${item.last_name}`}</td>
              <td className="px-4 py-3">{item.rollNo || item.student_id}</td>
              <td className="px-4 py-3">{item.email}</td>
              <td className="px-4 py-3">{item.courseId?.courseName || item.course?.courseName || 'N/A'}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete('students', item._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Student"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          );
        default:
          return null;
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            Manage {type}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {getColumns().map((column, index) => (
                  <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length > 0 ? (
                items.map(renderRow)
              ) : (
                <tr>
                  <td colSpan={getColumns().length} className="px-4 py-8 text-center text-gray-500">
                    No {type} found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Management</h1>
        <p className="text-gray-600">Manage all system resources</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {['courses', 'subjects', 'teachers', 'students'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab} ({data[tab].length})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderTable(activeTab, data[activeTab])}

      {/* Admin Notice */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Admin Only Access</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Only administrators can delete courses, subjects, teachers, and students. All deletion operations are restricted to admin users only.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;