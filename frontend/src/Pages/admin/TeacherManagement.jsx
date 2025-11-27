import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTeachers([
      { id: 1, name: 'Dr. John Smith', subject: 'Mathematics', email: 'john@college.edu', phone: '9876543210' },
      { id: 2, name: 'Prof. Sarah Johnson', subject: 'Physics', email: 'sarah@college.edu', phone: '9876543211' },
      { id: 3, name: 'Dr. Mike Wilson', subject: 'Chemistry', email: 'mike@college.edu', phone: '9876543212' }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Teacher Management</h1>
            <p className="text-gray-600">Manage all teachers and faculty members</p>
          </div>
          <Link
            to="/admin/create-teacher"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaPlus />
            <span>Add Teacher</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaChalkboardTeacher className="text-blue-500 mr-3" />
                        <span className="font-medium text-gray-900">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{teacher.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{teacher.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{teacher.phone}</td>
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

export default TeacherManagement;