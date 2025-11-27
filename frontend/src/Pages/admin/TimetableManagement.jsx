import React, { useState } from 'react';
import { FaCalendarAlt, FaPlus, FaClock, FaEdit } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';

const TimetableManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState('Computer Science');
  
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const timetableData = {
    'Computer Science': {
      'Monday': ['Mathematics', 'Physics', 'Programming', 'Lunch', 'Data Structures', 'Lab', 'Lab'],
      'Tuesday': ['English', 'Mathematics', 'Physics', 'Lunch', 'Programming', 'Workshop', 'Workshop'],
      'Wednesday': ['Physics', 'Mathematics', 'English', 'Lunch', 'Database', 'Lab', 'Lab'],
      'Thursday': ['Programming', 'Physics', 'Mathematics', 'Lunch', 'Networks', 'Theory', 'Theory'],
      'Friday': ['Database', 'English', 'Programming', 'Lunch', 'Project', 'Project', 'Project'],
      'Saturday': ['Mathematics', 'Physics', 'English', 'Lunch', 'Seminar', 'Library', 'Sports']
    }
  };

  const courses = ['Computer Science', 'Mechanical Engineering', 'Business Administration'];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Timetable Management</h1>
            <p className="text-gray-600">Create and manage class schedules</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <FaCalendarAlt />
              <span>Generate PDF</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <FaPlus />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {/* Course Selection */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center space-x-4">
            <label className="font-medium text-gray-700">Select Course:</label>
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
              <FaEdit />
              <span>Edit Timetable</span>
            </button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">{selectedCourse} - Weekly Timetable</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-r">Time</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center font-medium text-gray-700 border-r min-w-32">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIndex) => (
                  <tr key={time} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r bg-gray-50">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-blue-500" />
                        {time}
                      </div>
                    </td>
                    {days.map(day => {
                      const subject = timetableData[selectedCourse]?.[day]?.[timeIndex] || '';
                      const isLunch = subject === 'Lunch';
                      const isLab = subject === 'Lab' || subject === 'Workshop';
                      const isProject = subject === 'Project';
                      
                      return (
                        <td key={day} className="px-2 py-3 border-r text-center">
                          {subject && (
                            <div className={`p-2 rounded text-sm font-medium ${
                              isLunch ? 'bg-orange-100 text-orange-800' :
                              isLab ? 'bg-purple-100 text-purple-800' :
                              isProject ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {subject}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaCalendarAlt className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClock className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold">30</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaCalendarAlt className="text-3xl text-purple-500 mr-4" />
              <div>
                <p className="text-gray-600">Lab Sessions</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClock className="text-3xl text-orange-500 mr-4" />
              <div>
                <p className="text-gray-600">Free Periods</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Assignment */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Teacher Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Mathematics</span>
                <span className="text-sm text-gray-600">Dr. John Smith</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Physics</span>
                <span className="text-sm text-gray-600">Prof. Sarah Johnson</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Programming</span>
                <span className="text-sm text-gray-600">Dr. Mike Wilson</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Database</span>
                <span className="text-sm text-gray-600">Prof. Lisa Brown</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Networks</span>
                <span className="text-sm text-gray-600">Dr. David Lee</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">English</span>
                <span className="text-sm text-gray-600">Ms. Emily Davis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableManagement;