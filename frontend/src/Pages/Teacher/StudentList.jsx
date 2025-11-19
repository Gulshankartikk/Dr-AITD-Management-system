import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../constants/baseUrl';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const teacherId = localStorage.getItem('userId') || 'admin';

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
      const response = await axios.get(`${BASE_URL}/api/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.subjects.length > 0) {
        setSubjects(response.data.subjects);
        setSelectedSubject(response.data.subjects[0]._id);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const subject = subjects.find(s => s._id === selectedSubject);
      
      if (!subject) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${BASE_URL}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const allStudents = response.data.students;
        const subjectCourseId = typeof subject.courseId === 'object' ? subject.courseId._id : subject.courseId;
        
        const filteredStudents = allStudents
          .filter(student => {
            const studentCourseId = typeof student.courseId === 'object' ? student.courseId._id : student.courseId;
            return studentCourseId === subjectCourseId;
          })
          .map(student => ({ ...student, status: 'Present' }));
        
        setStudents(filteredStudents);
      }
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setStudents(prev => prev.map(student => 
      student._id === studentId ? { ...student, status } : student
    ));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSubject || students.length === 0) {
      toast.error('Please select a subject and ensure students are loaded');
      return;
    }

    setSaving(true);
    try {
      const token = Cookies.get('token');
      const attendanceData = students.map(student => ({
        studentId: student._id,
        status: student.status
      }));

      const response = await axios.post(`${BASE_URL}/api/teacher/${teacherId}/attendance`, {
        subjectId: selectedSubject,
        date: selectedDate,
        attendance: attendanceData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Attendance saved successfully!');
      } else {
        toast.error(response.data.msg || 'Failed to save attendance');
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'Present' })));
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'Absent' })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Student Attendance</h1>
            <p className="text-gray-600 mt-2">Mark attendance for all students</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subjectName} ({subject.subjectCode})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex space-x-2 mb-4">
              <button
                onClick={markAllPresent}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Roll No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.rollNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.courseId?.courseName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              student.status === 'Present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusChange(student._id, 'Present')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  student.status === 'Present'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(student._id, 'Absent')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  student.status === 'Absent'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-6 text-sm">
                    <span className="text-gray-600">Total Students: <span className="font-semibold">{students.length}</span></span>
                    <span className="text-green-600">Present: <span className="font-semibold">{students.filter(s => s.status === 'Present').length}</span></span>
                    <span className="text-red-600">Absent: <span className="font-semibold">{students.filter(s => s.status === 'Absent').length}</span></span>
                  </div>
                  <button
                    onClick={handleSaveAttendance}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Attendance'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
