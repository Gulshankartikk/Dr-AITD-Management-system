import React, { useState } from 'react';
import { FaClipboardCheck, FaPlus, FaCalendarAlt, FaEdit, FaEye } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const ExamManagement = () => {
  const [exams] = useState([
    { id: 1, name: 'Mid-Term Exam', course: 'Computer Science', date: '2024-02-15', time: '10:00 AM', duration: '3 hours', status: 'Scheduled' },
    { id: 2, name: 'Final Exam', course: 'Mechanical Eng.', date: '2024-03-20', time: '2:00 PM', duration: '3 hours', status: 'Scheduled' },
    { id: 3, name: 'Unit Test', course: 'Business Admin', date: '2024-01-25', time: '11:00 AM', duration: '2 hours', status: 'Completed' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Exam Management</h1>
            <p className="text-gray-600">Schedule and manage examinations</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <FaCalendarAlt />
              <span>Exam Calendar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <FaPlus />
              <span>Schedule Exam</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardCheck className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardCheck className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardCheck className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardCheck className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-gray-600">Results Pending</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 text-center">
              <FaPlus className="text-2xl text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Schedule New Exam</p>
            </button>
            <button className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 text-center">
              <FaCalendarAlt className="text-2xl text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">View Calendar</p>
            </button>
            <button className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 text-center">
              <FaClipboardCheck className="text-2xl text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Publish Results</p>
            </button>
            <button className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 text-center">
              <FaEye className="text-2xl text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium">View Reports</p>
            </button>
          </div>
        </div>

        {/* Exam List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming & Recent Exams</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaClipboardCheck className="text-blue-500 mr-3" />
                        <span className="font-medium text-gray-900">{exam.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{exam.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{exam.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{exam.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{exam.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        exam.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        exam.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900"><FaEye /></button>
                      <button className="text-green-600 hover:text-green-900"><FaEdit /></button>
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

export default ExamManagement;