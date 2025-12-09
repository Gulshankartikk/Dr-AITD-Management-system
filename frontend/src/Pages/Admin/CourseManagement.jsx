import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await adminService.getCourses();
      if (res.success) {
        setCourses(res.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton className="mb-4" />
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary font-heading">Course Management</h1>
              <p className="text-text-secondary">Manage all courses and academic programs</p>
            </div>
            <Link to="/admin/add-course">
              <Button className="flex items-center space-x-2">
                <FaPlus />
                <span>Add Course</span>
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaBook className="text-primary mr-3" />
                          <span className="font-medium text-secondary">{course.courseName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary">{course.courseCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary">{course.courseDuration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary">{course.students || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-primary hover:text-primary/80"><FaEye /></button>
                        <button className="text-primary hover:text-primary/80"><FaEdit /></button>
                        <button className="text-danger hover:text-red-700"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;