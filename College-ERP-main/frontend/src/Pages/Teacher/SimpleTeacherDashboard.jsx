import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaStickyNote, FaPlus } from 'react-icons/fa';
import { MdAssignment, MdGrade } from 'react-icons/md';

const SimpleTeacherDashboard = () => {
  const user = useSelector((state) => state.User);
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user.name || 'Teacher'}!
        </h1>
        <p className="text-gray-600">Teacher ID: {user.user_id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaUsers size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaStickyNote size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <MdAssignment size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaClipboardList size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate(`/teacher/${id}/courses`)}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaClipboardList className="text-blue-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Mark Attendance</span>
          </button>
          
          <button 
            onClick={() => navigate(`/teacher/${id}/assignments`)}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaPlus className="text-green-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Add Assignment</span>
          </button>
          
          <button 
            onClick={() => navigate(`/teacher/${id}/notices`)}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FaStickyNote className="text-purple-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Post Notice</span>
          </button>
          
          <button 
            onClick={() => navigate(`/teacher/${id}/marks`)}
            className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <MdGrade className="text-red-500 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Add Marks</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Teacher Portal</h2>
        <p className="text-gray-600">
          Your teacher dashboard is ready! You can now manage courses, mark attendance, 
          create assignments, and communicate with students.
        </p>
      </div>
    </div>
  );
};

export default SimpleTeacherDashboard;