import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TeacherAttendance = () => {
  const { id: teacherId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, [teacherId]);

  useEffect(() => {
    if (selectedSubject && selectedSubject !== 'all') {
      fetchStudents();
    } else if (selectedSubject === 'all') {
      setStudents([]);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/teacher/${teacherId}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data.teacher?.assignedSubjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        `${BASE_URL}/api/teacher/${teacherId}/subjects/${selectedSubject}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data.students || []);
      const initialAttendance = {};
      response.data.students.forEach(student => {
        initialAttendance[student._id] = 'Present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSubject === 'all') {
      alert('Please select a specific subject to mark attendance');
      return;
    }
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      const attendanceData = Object.keys(attendance).map(studentId => ({
        studentId,
        status: attendance[studentId]
      }));

      await axios.post(
        `${BASE_URL}/api/teacher/${teacherId}/attendance`,
        { subjectId: selectedSubject, date, attendance: attendanceData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      <TeacherHeader currentRole="teacher" />
      <div className="p-6">
        <BackButton className="mb-4" />
        <h1 className="text-3xl font-bold text-white mb-6">Mark Attendance</h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#2d545e' }}>
                Select Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 border rounded-lg"
                style={{ borderColor: '#e1b382' }}
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#2d545e' }}>
                <FaCalendarAlt className="inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
                style={{ borderColor: '#e1b382' }}
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading students..." />
          ) : selectedSubject === 'all' ? (
            <p className="text-gray-500 text-center py-4">Please select a specific subject to mark attendance</p>
          ) : selectedSubject && students.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#2d545e' }}>
                    <tr>
                      <th className="p-3 text-left text-white">Roll No</th>
                      <th className="p-3 text-left text-white">Name</th>
                      <th className="p-3 text-center text-white">Present</th>
                      <th className="p-3 text-center text-white">Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td className="p-3">{student.rollNo}</td>
                        <td className="p-3">{student.name}</td>
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === 'Present'}
                            onChange={() => handleAttendanceChange(student._id, 'Present')}
                            className="w-5 h-5"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === 'Absent'}
                            onChange={() => handleAttendanceChange(student._id, 'Absent')}
                            className="w-5 h-5"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 px-6 py-3 rounded-lg text-white font-bold"
                style={{ backgroundColor: '#e1b382' }}
              >
                {submitting ? 'Submitting...' : 'Submit Attendance'}
              </button>
            </form>
          ) : selectedSubject && selectedSubject !== 'all' ? (
            <p className="text-gray-500 text-center py-4">No students found for this subject</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
