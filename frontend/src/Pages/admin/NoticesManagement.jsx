import React, { useState } from 'react';
import { FaBell, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';

const NoticesManagement = () => {
  const [notices] = useState([
    { 
      id: 1, 
      title: 'Mid-Term Examination Schedule', 
      content: 'Mid-term examinations will be conducted from February 15-25, 2024.',
      date: '2024-01-20',
      priority: 'High',
      status: 'Active',
      audience: 'All Students'
    },
    { 
      id: 2, 
      title: 'Library Maintenance Notice', 
      content: 'The library will be closed for maintenance on January 30, 2024.',
      date: '2024-01-18',
      priority: 'Medium',
      status: 'Active',
      audience: 'All Users'
    },
    { 
      id: 3, 
      title: 'Fee Payment Deadline', 
      content: 'Last date for fee payment is February 10, 2024. Late fees will be applicable after this date.',
      date: '2024-01-15',
      priority: 'High',
      status: 'Active',
      audience: 'Students'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Notices Management</h1>
            <p className="text-gray-600">Create and manage institutional notices</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <FaPlus />
            <span>Create Notice</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBell className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Total Notices</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBell className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-gray-600">Active</p>
                <p className="text-2xl font-bold">32</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBell className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBell className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-gray-600">Expired</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Notice Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Notice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notice Title</label>
              <input
                type="text"
                placeholder="Enter notice title..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Users</option>
                <option>Students</option>
                <option>Teachers</option>
                <option>Staff</option>
                <option>Parents</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notice Content</label>
            <textarea
              rows="4"
              placeholder="Enter notice content..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Publish Notice
            </button>
            <button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Save as Draft
            </button>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Schedule
            </button>
          </div>
        </div>

        {/* Notices List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Notices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notices.map((notice) => (
                  <tr key={notice.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaBell className="text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{notice.title}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">{notice.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{notice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        notice.priority === 'High' ? 'bg-red-100 text-red-800' :
                        notice.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {notice.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{notice.audience}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {notice.status}
                      </span>
                    </td>
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

        {/* Notice Templates */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
              <h3 className="font-medium text-gray-800 mb-2">Exam Notice</h3>
              <p className="text-sm text-gray-600">Template for examination announcements</p>
            </div>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
              <h3 className="font-medium text-gray-800 mb-2">Holiday Notice</h3>
              <p className="text-sm text-gray-600">Template for holiday announcements</p>
            </div>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
              <h3 className="font-medium text-gray-800 mb-2">Fee Notice</h3>
              <p className="text-sm text-gray-600">Template for fee-related notices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticesManagement;