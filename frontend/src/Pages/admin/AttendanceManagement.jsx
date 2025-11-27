import React, { useState } from 'react';
import { FaClipboardList, FaCalendarAlt, FaDownload, FaSearch } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const AttendanceManagement = () => {
  const [attendanceData] = useState([
    { id: 1, student: 'John Doe', course: 'Computer Science', present: 85, total: 100, percentage: 85 },
    { id: 2, student: 'Jane Smith', course: 'Mechanical Eng.', present: 92, total: 100, percentage: 92 },
    { id: 3, student: 'Mike Johnson', course: 'Business Admin', present: 78, total: 100, percentage: 78 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
            <p className="text-gray-600">Monitor and manage student attendance</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <FaDownload />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <FaCalendarAlt />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-gray-600">Average Attendance</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Present Today</p>
                <p className="text-2xl font-bold">1,082</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold">163</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-gray-600">Low Attendance</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Courses</option>
              <option>Computer Science</option>
              <option>Mechanical Engineering</option>
              <option>Business Administration</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Good (Above 80%)</option>
              <option>Average (60-80%)</option>
              <option>Poor (Below 60%)</option>
            </select>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceData.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.present}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              record.percentage >= 80 ? 'bg-green-500' :
                              record.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${record.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{record.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.percentage >= 80 ? 'bg-green-100 text-green-800' :
                        record.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.percentage >= 80 ? 'Good' : record.percentage >= 60 ? 'Average' : 'Poor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View Details</button>
                      <button className="text-green-600 hover:text-green-900">Edit</button>
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

export default AttendanceManagement;