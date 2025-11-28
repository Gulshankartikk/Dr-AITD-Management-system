import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaPlus, FaCalendarAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';

const TeacherAssignments = () => {
  const { id: teacherId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    title: '',
    description: '',
    deadline: ''
  });

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      const [assignmentsRes, dashboardRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAssignments(assignmentsRes.data.assignments || []);
      setSubjects(dashboardRes.data.teacher?.assignedSubjects || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      await axios.post(
        `${BASE_URL}/api/teacher/${teacherId}/assignments`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Assignment created successfully!');
      setShowModal(false);
      setFormData({ subjectId: '', title: '', description: '', deadline: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment');
    }
  };

  if (loading) return <LoadingSpinner message="Loading assignments..." />;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      <TeacherHeader currentRole="teacher" />
      <div className="p-6">
        <BackButton className="mb-4" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Assignments</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-bold flex items-center gap-2"
            style={{ backgroundColor: '#e1b382' }}
          >
            <FaPlus /> Create Assignment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <div key={assignment._id} className="bg-white rounded-lg shadow-xl p-6" style={{ borderTop: '4px solid #e1b382' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2d545e' }}>{assignment.title}</h3>
              <p className="text-sm mb-2" style={{ color: '#c89666' }}>
                {assignment.subjectId?.subjectName} ({assignment.subjectId?.subjectCode})
              </p>
              <p className="text-gray-600 mb-4">{assignment.description}</p>
              <div className="flex items-center gap-2 text-sm mb-2">
                <FaCalendarAlt style={{ color: '#e1b382' }} />
                <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <FaUsers style={{ color: '#2d545e' }} />
                <span>Total Students: {assignment.totalStudents || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaCheckCircle style={{ color: '#4ade80' }} />
                <span>Submitted: {assignment.submittedCount || 0}</span>
              </div>
            </div>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="bg-white rounded-lg shadow-xl p-12 text-center">
            <p className="text-gray-500 text-lg">No assignments created yet</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#2d545e' }}>Create Assignment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Subject</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg text-white font-bold"
                  style={{ backgroundColor: '#e1b382' }}
                >
                  Create
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

export default TeacherAssignments;
