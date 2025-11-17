import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const AttendanceUpload = ({ teacherId }) => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${BASE_URL}/subjects`, { headers });
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchStudents = async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(
        `${BASE_URL}/teacher/subjects/${selectedSubject}/students`, 
        { headers }
      );
      
      const studentList = response.data.students || [];
      setStudents(studentList);
      
      // Initialize attendance state
      const initialAttendance = {};
      studentList.forEach(student => {
        initialAttendance[student._id] = 'Present';
      });
      setAttendance(initialAttendance);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || students.length === 0) {
      toast.error('Please select a subject and ensure students are loaded');
      return;
    }

    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const attendanceData = {
        subjectId: selectedSubject,
        date: attendanceDate,
        attendance: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status
        }))
      };

      await axios.post(
        `${BASE_URL}/api/teacher/${teacherId}/attendance`,
        attendanceData,
        { headers }
      );

      toast.success('Attendance submitted successfully!');
      
      // Reset form
      setSelectedSubject('');
      setStudents([]);
      setAttendance({});
      setAttendanceDate(new Date().toISOString().split('T')[0]);
      
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error('Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const markAllPresent = () => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student._id] = 'Present';
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student._id] = 'Absent';
    });
    setAttendance(newAttendance);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mark Attendance</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading students...</span>
            </div>
          )}

          {students.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  <FaUsers className="inline mr-2" />
                  Students ({students.length})
                </h3>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={markAllPresent}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Mark All Present
                  </button>
                  <button
                    type="button"
                    onClick={markAllAbsent}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div key={student._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(student._id, 'Present')}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                          attendance[student._id] === 'Present'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        <FaCheck className="mr-1" />
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(student._id, 'Absent')}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                          attendance[student._id] === 'Absent'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                        }`}
                      >
                        <FaTimes className="mr-1" />
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCalendarAlt className="mr-2" />
                    Submit Attendance
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AttendanceUpload;