import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    setCourses([
      { id: 1, name: 'Computer Science', code: 'CS101', duration: '4 Years', students: 120 },
      { id: 2, name: 'Mechanical Engineering', code: 'ME101', duration: '4 Years', students: 95 },
      { id: 3, name: 'Business Administration', code: 'BA101', duration: '3 Years', students: 80 }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
            <p className="text-gray-600">Manage all courses and academic programs</p>
          </div>
          <Link
            to="/admin/add-course"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaPlus />
            <span>Add Course</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBook className="text-blue-500 mr-3" />
                        <span className="font-medium text-gray-900">{course.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{course.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{course.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{course.students}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900"><FaEye /></button>
                      <button className="text-green-600 hover:text-green-900"><FaEdit /></button>
                      <button className="text-red-600 hover:text-red-900"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;