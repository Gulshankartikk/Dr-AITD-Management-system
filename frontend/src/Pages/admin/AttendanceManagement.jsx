import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCalendarAlt, FaDownload, FaSearch, FaTimes, FaEdit, FaEye, FaCheck, FaUserCheck } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const AttendanceManagement = () => {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, student: 'John Doe', rollNo: 'CS001', course: 'Computer Science', present: 85, total: 100, percentage: 85, status: 'Present' },
    { id: 2, student: 'Jane Smith', rollNo: 'ME002', course: 'Mechanical Eng.', present: 92, total: 100, percentage: 92, status: 'Present' },
    { id: 3, student: 'Mike Johnson', rollNo: 'BA003', course: 'Business Admin', present: 78, total: 100, percentage: 78, status: 'Absent' },
    { id: 4, student: 'Sarah Wilson', rollNo: 'CS004', course: 'Computer Science', present: 88, total: 100, percentage: 88, status: 'Present' },
    { id: 5, student: 'David Brown', rollNo: 'ME005', course: 'Mechanical Eng.', present: 65, total: 100, percentage: 65, status: 'Present' }
  ]);

  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const [markAttendanceData, setMarkAttendanceData] = useState([
    { id: 1, student: 'John Doe', rollNo: 'CS001', course: 'Computer Science', status: 'Present' },
    { id: 2, student: 'Jane Smith', rollNo: 'ME002', course: 'Mechanical Eng.', status: 'Present' },
    { id: 3, student: 'Mike Johnson', rollNo: 'BA003', course: 'Business Admin', status: 'Absent' },
    { id: 4, student: 'Sarah Wilson', rollNo: 'CS004', course: 'Computer Science', status: 'Present' },
    { id: 5, student: 'David Brown', rollNo: 'ME005', course: 'Mechanical Eng.', status: 'Present' }
  ]);

  // Helper functions
  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All Courses' || record.course === selectedCourse;
    const matchesStatus = selectedStatus === 'All Status' ||
      (selectedStatus === 'Good (Above 80%)' && record.percentage >= 80) ||
      (selectedStatus === 'Average (60-80%)' && record.percentage >= 60 && record.percentage < 80) ||
      (selectedStatus === 'Poor (Below 60%)' && record.percentage < 60);
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const exportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Roll No,Student Name,Course,Present Days,Total Days,Percentage,Status\n" +
      filteredData.map(record =>
        `${record.rollNo},${record.student},${record.course},${record.present},${record.total},${record.percentage}%,${record.percentage >= 80 ? 'Good' : record.percentage >= 60 ? 'Average' : 'Poor'}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateAttendanceStatus = (studentId, status) => {
    setMarkAttendanceData(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const saveAttendance = () => {
    alert('Attendance saved successfully!');
    setShowMarkModal(false);
  };

  const viewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const editAttendance = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const saveEditedAttendance = () => {
    const updatedPercentage = Math.round((selectedStudent.present / selectedStudent.total) * 100);
    setAttendanceData(prev =>
      prev.map(record =>
        record.id === selectedStudent.id
          ? { ...selectedStudent, percentage: updatedPercentage }
          : record
      )
    );
    alert('Attendance updated successfully!');
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Attendance Management</h1>
            <p className="text-text-grey">Monitor and manage student attendance</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaDownload />
              <span>Export Report</span>
            </button>
            <button
              onClick={() => setShowMarkModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
            >
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
                <p className="text-text-grey">Average Attendance</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-sky-blue mr-4" />
              <div>
                <p className="text-text-grey">Present Today</p>
                <p className="text-2xl font-bold">1,082</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-text-grey">Absent Today</p>
                <p className="text-2xl font-bold">163</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-text-grey">Low Attendance</p>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
            >
              <option>All Courses</option>
              <option>Computer Science</option>
              <option>Mechanical Engineering</option>
              <option>Business Administration</option>
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
            >
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
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Present Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Total Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-navy">{record.rollNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-navy">{record.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{record.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{record.present}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{record.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-soft-grey rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${record.percentage >= 80 ? 'bg-green-500' :
                                record.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${record.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{record.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${record.percentage >= 80 ? 'bg-green-100 text-green-800' :
                          record.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {record.percentage >= 80 ? 'Good' : record.percentage >= 60 ? 'Average' : 'Poor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewDetails(record)}
                        className="text-sky-blue hover:text-sky-blue/80 mr-3 flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <button
                        onClick={() => editAttendance(record)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mark Attendance Modal */}
        {showMarkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Mark Attendance - {selectedDate}</h2>
                <button
                  onClick={() => setShowMarkModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-grey mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Roll No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Student Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Course</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {markAttendanceData.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-navy">{student.rollNo}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-navy">{student.student}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-navy">{student.course}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateAttendanceStatus(student.id, 'Present')}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${student.status === 'Present'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-soft-grey text-navy hover:bg-green-100'
                                }`}
                            >
                              <FaCheck className="inline mr-1" /> Present
                            </button>
                            <button
                              onClick={() => updateAttendanceStatus(student.id, 'Absent')}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${student.status === 'Absent'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-soft-grey text-navy hover:bg-red-100'
                                }`}
                            >
                              <FaTimes className="inline mr-1" /> Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowMarkModal(false)}
                  className="px-4 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAttendance}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Attendance Modal */}
        {showEditModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Edit Attendance - {selectedStudent.student}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Student Name</label>
                  <input
                    type="text"
                    value={selectedStudent.student}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Present Days</label>
                  <input
                    type="number"
                    value={selectedStudent.present}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, present: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Total Days</label>
                  <input
                    type="number"
                    value={selectedStudent.total}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, total: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Attendance Percentage</label>
                  <input
                    type="text"
                    value={`${Math.round((selectedStudent.present / selectedStudent.total) * 100)}%`}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedAttendance}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Attendance Details - {selectedStudent.student}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">Student Information</h3>
                  <p><strong>Name:</strong> {selectedStudent.student}</p>
                  <p><strong>Roll No:</strong> {selectedStudent.rollNo}</p>
                  <p><strong>Course:</strong> {selectedStudent.course}</p>
                </div>

                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">Attendance Summary</h3>
                  <p><strong>Present Days:</strong> {selectedStudent.present}</p>
                  <p><strong>Total Days:</strong> {selectedStudent.total}</p>
                  <p><strong>Percentage:</strong> {selectedStudent.percentage}%</p>
                  <p><strong>Status:</strong>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${selectedStudent.percentage >= 80 ? 'bg-green-100 text-green-800' :
                        selectedStudent.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {selectedStudent.percentage >= 80 ? 'Good' : selectedStudent.percentage >= 60 ? 'Average' : 'Poor'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-navy mb-3">Recent Attendance (Last 10 Days)</h3>
                <div className="grid grid-cols-10 gap-2">
                  {[...Array(10)].map((_, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${Math.random() > 0.2 ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                        {Math.random() > 0.2 ? 'P' : 'A'}
                      </div>
                      <div className="text-xs text-text-grey mt-1">
                        {new Date(Date.now() - (9 - index) * 24 * 60 * 60 * 1000).getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;