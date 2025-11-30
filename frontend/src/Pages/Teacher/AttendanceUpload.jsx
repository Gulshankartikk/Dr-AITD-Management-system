import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const AttendanceUpload = ({ teacherId }) => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🚀 Fetch subjects on page load
  useEffect(() => {
    fetchSubjects();
  }, []);

  // 🚀 Fetch students when subject changes
  useEffect(() => {
    if (selectedSubject) fetchStudents();
  }, [selectedSubject]);

  // ===================== FETCH SUBJECTS =====================
  const fetchSubjects = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(`${BASE_URL}/api/teacher/${teacherId}/subjects`, {
        headers,
      });

      setSubjects(res.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
    }
  };

  // ===================== FETCH STUDENTS =====================
  const fetchStudents = async () => {
    if (!selectedSubject) return;

    setLoading(true);
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(
        `${BASE_URL}/api/teacher/${teacherId}/subjects/${selectedSubject}/students`,
        { headers }
      );

      const studentList = res.data.students || [];
      setStudents(studentList);

      // Initialize attendance as Present for all
      const initial = {};
      studentList.forEach((s) => {
        initial[s._id] = 'Present';
      });

      setAttendance(initial);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // ===================== CHANGE STATUS =====================
  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // ===================== SUBMIT ATTENDANCE =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSubject || students.length === 0) {
      toast.error('Please select a subject and load students');
      return;
    }

    setSubmitting(true);

    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const data = {
        subjectId: selectedSubject,
        date: attendanceDate,
        attendance: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      };

      await axios.post(`${BASE_URL}/api/teacher/${teacherId}/attendance`, data, {
        headers,
      });

      toast.success('Attendance submitted successfully!');

      // Reset Form
      setSelectedSubject('');
      setStudents([]);
      setAttendance({});
      setAttendanceDate(new Date().toISOString().split('T')[0]);

    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  // ===================== MARK ALL =====================
  const markAllPresent = () => {
    const obj = {};
    students.forEach((s) => (obj[s._id] = 'Present'));
    setAttendance(obj);
  };

  const markAllAbsent = () => {
    const obj = {};
    students.forEach((s) => (obj[s._id] = 'Absent'));
    setAttendance(obj);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mark Attendance</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* SUBJECT DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

          </div>

          {/* LOADING SPINNER */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-sky-blue rounded-full"></div>
              <span className="ml-2 text-text-grey">Loading students...</span>
            </div>
          )}

          {/* STUDENT LIST */}
          {students.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  <FaUsers className="inline mr-2" />
                  Students ({students.length})
                </h3>
                <div className="space-x-2">
                  <button type="button" onClick={markAllPresent} className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80">
                    Mark All Present
                  </button>
                  <button type="button" onClick={markAllAbsent} className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/80">
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
                        className={`px-3 py-2 rounded-lg ${attendance[student._id] === 'Present'
                            ? 'bg-sky-blue text-white'
                            : 'bg-soft-grey/20 text-text-grey hover:bg-soft-grey/40'
                          }`}
                      >
                        <FaCheck className="inline mr-1" /> Present
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(student._id, 'Absent')}
                        className={`px-3 py-2 rounded-lg ${attendance[student._id] === 'Absent'
                            ? 'bg-navy text-white'
                            : 'bg-soft-grey/20 text-text-grey hover:bg-soft-grey/40'
                          }`}
                      >
                        <FaTimes className="inline mr-1" /> Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sky-blue text-white py-3 px-6 rounded-lg hover:bg-sky-blue/80 disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
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
