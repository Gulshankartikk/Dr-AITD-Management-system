import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaPlus, FaTrophy, FaChartLine } from 'react-icons/fa';

const TeacherMarks = () => {
  const { id: teacherId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [students, setStudents] = useState([]);
  const [studentMarks, setStudentMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    marks: '',
    totalMarks: '',
    examType: 'Mid-Term'
  });

  useEffect(() => {
    fetchSubjects();
  }, [teacherId]);

  useEffect(() => {
    if (selectedSubject && selectedSubject !== 'all') {
      fetchStudentsAndMarks();
    } else if (selectedSubject === 'all') {
      setStudents([]);
      setStudentMarks([]);
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

  const fetchStudentsAndMarks = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const [studentsRes, marksRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/subjects/${selectedSubject}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/marks/${selectedSubject}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStudents(studentsRes.data.students || []);
      setStudentMarks(marksRes.data.studentMarks || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSubject === 'all') {
      alert('Please select a specific subject to add marks');
      return;
    }
    try {
      const token = Cookies.get('token');
      await axios.post(
        `${BASE_URL}/api/teacher/${teacherId}/marks`,
        { ...formData, subjectId: selectedSubject },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Marks added successfully!');
      setShowModal(false);
      setFormData({ studentId: '', marks: '', totalMarks: '', examType: 'Mid-Term' });
      fetchStudentsAndMarks();
    } catch (error) {
      console.error('Error adding marks:', error);
      alert('Failed to add marks');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      <TeacherHeader currentRole="teacher" />
      <div className="p-6">
        <BackButton className="mb-4" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Marks</h1>
          {selectedSubject && selectedSubject !== 'all' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-lg text-white font-bold flex items-center gap-2"
              style={{ backgroundColor: '#e1b382' }}
            >
              <FaPlus /> Add Marks
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
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

        {loading ? (
          <LoadingSpinner message="Loading marks..." />
        ) : selectedSubject === 'all' ? (
          <div className="bg-white rounded-lg shadow-xl p-12 text-center">
            <FaChartLine size={48} className="mx-auto mb-4" style={{ color: '#e1b382' }} />
            <p className="text-gray-500 text-lg">Please select a specific subject to view and manage marks</p>
          </div>
        ) : selectedSubject && studentMarks.length > 0 ? (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#2d545e' }}>Student Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#2d545e' }}>
                  <tr>
                    <th className="p-3 text-left text-white">Roll No</th>
                    <th className="p-3 text-left text-white">Name</th>
                    <th className="p-3 text-center text-white">Total Marks</th>
                    <th className="p-3 text-center text-white">Total Possible</th>
                    <th className="p-3 text-center text-white">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMarks.map((sm, index) => (
                    <tr key={sm.student._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td className="p-3">{sm.student.rollNo}</td>
                      <td className="p-3">{sm.student.name}</td>
                      <td className="p-3 text-center font-bold">{sm.totalMarks}</td>
                      <td className="p-3 text-center">{sm.totalPossible}</td>
                      <td className="p-3 text-center">
                        <span
                          className="px-3 py-1 rounded-full text-white font-bold"
                          style={{
                            backgroundColor: sm.percentage >= 75 ? '#4ade80' : sm.percentage >= 50 ? '#fbbf24' : '#ef4444'
                          }}
                        >
                          {sm.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedSubject && selectedSubject !== 'all' ? (
          <div className="bg-white rounded-lg shadow-xl p-12 text-center">
            <FaChartLine size={48} className="mx-auto mb-4" style={{ color: '#e1b382' }} />
            <p className="text-gray-500 text-lg">No marks recorded yet for this subject</p>
          </div>
        ) : null}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#2d545e' }}>Add Marks</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Student</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">-- Select Student --</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.rollNo})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Exam Type</label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="End-Term">End-Term</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Marks Obtained</label>
                <input
                  type="number"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Total Marks</label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  min="0"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg text-white font-bold"
                  style={{ backgroundColor: '#e1b382' }}
                >
                  Add Marks
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg border-2 font-bold"
                  style={{ borderColor: '#2d545e', color: '#2d545e' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMarks;
