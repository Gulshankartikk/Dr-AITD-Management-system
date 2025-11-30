import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../constants/api';
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

    const teacherId = localStorage.getItem('userId');
    if (!teacherId) {
      toast.error("Teacher ID missing. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      const token = Cookies.get('token');
      const attendanceData = students.map(student => ({
        studentId: student._id,
        status: student.status
      }));

      // CORRECT ROUTE + CORRECT BODY
      const response = await axios.post(`${BASE_URL}/api/teacher/admin/attendance`, {
        teacherId,
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
    <div className="min-h-screen bg-background">
      <TeacherHeader />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton />

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-navy">Student Attendance</h1>
            <p className="text-text-grey mt-2">Mark attendance for all students</p>
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
                className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
              >
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/80"
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
                  <table className="min-w-full divide-y divide-soft-grey">
                    <thead className="bg-background">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">
                          Roll No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-soft-grey">
                      {students.map((student) => (
                        <tr key={student._id} className="hover:bg-soft-grey/20">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                            {student.rollNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-navy">{student.name}</div>
                            <div className="text-sm text-text-grey">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                            {student.courseId?.courseName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === 'Present'
                                ? 'bg-sky-blue/10 text-sky-blue'
                                : 'bg-navy/10 text-navy'
                              }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusChange(student._id, 'Present')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${student.status === 'Present'
                                    ? 'bg-sky-blue text-white'
                                    : 'bg-sky-blue/10 text-sky-blue hover:bg-sky-blue/20'
                                  }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(student._id, 'Absent')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${student.status === 'Absent'
                                    ? 'bg-navy text-white'
                                    : 'bg-navy/10 text-navy hover:bg-navy/20'
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
                    <span className="text-text-grey">Total Students: <span className="font-semibold">{students.length}</span></span>
                    <span className="text-sky-blue">Present: <span className="font-semibold">{students.filter(s => s.status === 'Present').length}</span></span>
                    <span className="text-navy">Absent: <span className="font-semibold">{students.filter(s => s.status === 'Absent').length}</span></span>
                  </div>
                  <button
                    onClick={handleSaveAttendance}
                    disabled={saving}
                    className="px-6 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80 disabled:opacity-50"
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
