import React from 'react';
import { useSelector } from 'react-redux';
import { FaBook, FaClipboardList, FaStickyNote, FaBell } from 'react-icons/fa';

const SimpleDashboard = () => {
  const user = useSelector((state) => state.User);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user.name || 'Student'}!
        </h1>
        <p className="text-gray-600">Student ID: {user.user_id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBook size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaClipboardList size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaStickyNote size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notes</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaBell size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notices</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to College ERP</h2>
        <p className="text-gray-600">
          Your dashboard is ready! You can now access your academic information, 
          check attendance, view assignments, and stay updated with notices.
        </p>
      </div>
    </div>
  );
};

export default SimpleDashboard;