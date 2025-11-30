import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaPlus, FaCalendarAlt, FaUsers, FaCheckCircle, FaFileAlt } from 'react-icons/fa';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { toast } from 'react-toastify';

const TeacherAssignments = () => {
  const { id: teacherId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filterSubject, setFilterSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subjectId: '',
    title: '',
    description: '',
    deadline: '',
    maxMarks: '',
    submissionType: 'online'
  });
  const [file, setFile] = useState(null);

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
      const assignmentsData = assignmentsRes.data.assignments || [];
      setAllAssignments(assignmentsData);
      setAssignments(assignmentsData);
      setSubjects(dashboardRes.data.teacher?.assignedSubjects || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterSubject) {
      setAssignments(allAssignments.filter(a => a.subjectId?._id === filterSubject));
    } else {
      setAssignments(allAssignments);
    }
  }, [filterSubject, allAssignments]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      const data = new FormData();
      data.append('subjectId', formData.subjectId);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('deadline', formData.deadline);
      data.append('maxMarks', formData.maxMarks);
      data.append('submissionType', formData.submissionType);

      if (file) {
        data.append('file', file);
      }

      await axios.post(
        `${BASE_URL}/api/teacher/${teacherId}/assignments`,
        data,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      toast.success('Assignment created successfully!');
      setShowModal(false);
      setFormData({
        subjectId: '',
        title: '',
        description: '',
        deadline: '',
        maxMarks: '',
        submissionType: 'online'
      });
      setFile(null);
      fetchData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading assignments..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader currentRole="teacher" />
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton className="mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
            <p className="text-gray-500 mt-1">Create and manage student assignments</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <FaPlus /> Create Assignment
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <Select
              label="Filter by Subject"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName} ({subject.subjectCode})
                </option>
              ))}
            </Select>
          </CardContent>
        </Card>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <Card key={assignment._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{assignment.subjectId?.subjectName}</Badge>
                  <Badge variant={assignment.submissionType === 'online' ? 'default' : 'secondary'}>
                    {assignment.submissionType}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{assignment.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-purple-500" />
                    <span>Total Students: {assignment.totalStudents || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>Submitted: {assignment.submittedCount || 0}</span>
                  </div>
                  {assignment.maxMarks && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Max Marks:</span> {assignment.maxMarks}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <Button variant="outline" size="sm">View Submissions</Button>
                  {assignment.fileUrl && (
                    <a
                      href={assignment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaFileAlt />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">No assignments created yet</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Create New Assignment</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Select
                label="Subject"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </Select>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Assignment Title"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
                <Input
                  label="Max Marks"
                  type="number"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                  placeholder="e.g. 100"
                />
              </div>

              <Select
                label="Submission Type"
                value={formData.submissionType}
                onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
              >
                <option value="online">Online Upload</option>
                <option value="offline">Offline Submission</option>
              </Select>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={submitting} className="flex-1">
                  Create Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;
