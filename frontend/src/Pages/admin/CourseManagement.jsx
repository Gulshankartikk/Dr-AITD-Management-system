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
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Course Management</h1>
            <p className="text-text-grey">Manage all courses and academic programs</p>
          </div>
          <Link
            to="/admin/add-course"
            className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
          >
            <FaPlus />
            <span>Add Course</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-grey">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBook className="text-sky-blue mr-3" />
                        <span className="font-medium text-navy">{course.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{course.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{course.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{course.students}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-sky-blue hover:text-sky-blue/80"><FaEye /></button>
                      <button className="text-sky-blue hover:text-sky-blue/80"><FaEdit /></button>
                      <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
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