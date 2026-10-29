import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import api from '../../api/axiosInstance';
import aiService from '../../services/aiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  FaPlus,
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaFileAlt,
  FaMagic,
  FaTimes,
  FaRobot,
  FaSpinner,
  FaCheck
} from 'react-icons/fa';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select, { SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/Select';
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

  // Gemini AI state for assignment creation
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Intermediate');
  const [aiGenerating, setAiGenerating] = useState(false);

  // AI Rubric Guide modal state
  const [guideModal, setGuideModal] = useState({
    open: false,
    title: '',
    loading: false,
    content: ''
  });

  const [formData, setFormData] = useState({
    subjectId: '',
    title: '',
    description: '',
    deadline: '',
    maxMarks: '50',
    submissionType: 'online'
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    try {
      const [assignmentsRes, dashboardRes] = await Promise.all([
        api.get(`/api/teacher/${teacherId}/assignments`),
        api.get(`/api/teacher/${teacherId}/dashboard`)
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

  // Gemini AI: Generate Assignment Draft
  const handleAIGenerate = async () => {
    const topicToUse = aiTopic.trim() || formData.title.trim();
    if (!topicToUse) {
      toast.warning('Please enter a topic for AI generation (e.g., "Binary Search Trees" or "Operating System Deadlocks")');
      return;
    }

    const selectedSub = subjects.find(s => s._id === formData.subjectId);
    const subName = selectedSub ? `${selectedSub.subjectName} (${selectedSub.subjectCode})` : 'Computer Science';

    setAiGenerating(true);
    try {
      const res = await aiService.generateAssignment({
        topic: topicToUse,
        subject: subName,
        difficulty: aiDifficulty,
        maxMarks: Number(formData.maxMarks) || 50
      });

      if (res.success && res.assignment) {
        setFormData(prev => ({
          ...prev,
          title: prev.title || `${topicToUse} - Implementation & Lab Assignment`,
          description: res.assignment,
          maxMarks: prev.maxMarks || '50'
        }));
        toast.success(res.isLive ? '✨ Generated assignment with Gemini AI!' : '✨ Generated assignment template!');
      } else {
        toast.error('Could not generate assignment draft');
      }
    } catch (err) {
      console.error('AI generation error:', err);
      toast.error('AI drafting failed. Please check connection.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Gemini AI: View Rubric & Viva Guide
  const handleOpenRubric = async (assignment) => {
    setGuideModal({
      open: true,
      title: assignment.title,
      loading: true,
      content: ''
    });

    try {
      const res = await aiService.explainTopic(
        `Grading Rubric & Viva Evaluation Questions for Assignment: "${assignment.title}". Subject: ${assignment.subjectId?.subjectName || ''}`,
        assignment.subjectId?.subjectName || 'Computer Science',
        'in-depth'
      );
      setGuideModal(prev => ({
        ...prev,
        loading: false,
        content: res.explanation || 'Rubric loaded.'
      }));
    } catch (err) {
      console.error('Error fetching rubric:', err);
      setGuideModal(prev => ({
        ...prev,
        loading: false,
        content: 'Failed to generate rubric guide. Please try again.'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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

      await api.post(`/api/teacher/${teacherId}/assignments`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Assignment created successfully!');
      setShowModal(false);
      setFormData({
        subjectId: '',
        title: '',
        description: '',
        deadline: '',
        maxMarks: '50',
        submissionType: 'online'
      });
      setFile(null);
      setAiTopic('');
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
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary font-heading">My Assignments</h1>
            <p className="text-text-secondary mt-1">Create, manage, and AI-assist student assignments</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <FaPlus /> Create Assignment
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8 border border-gray-200">
          <CardContent className="p-4">
            <Select
              label="Filter by Subject"
              value={filterSubject}
              onValueChange={setFilterSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <Card key={assignment._id} className="hover:shadow-lg transition-shadow border border-gray-200 flex flex-col justify-between">
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{assignment.subjectId?.subjectName}</Badge>
                    <Badge variant={assignment.submissionType === 'online' ? 'primary' : 'secondary'}>
                      {assignment.submissionType}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-secondary mb-2 font-heading">{assignment.title}</h3>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-3 whitespace-pre-line">{assignment.description}</p>

                  <div className="space-y-2 text-sm text-text-secondary mb-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" />
                      <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-secondary" />
                      <span>Total Students: {assignment.totalStudents || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-success" />
                      <span>Submitted: {assignment.submittedCount || 0}</span>
                    </div>
                    {assignment.maxMarks && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Max Marks:</span> {assignment.maxMarks}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenRubric(assignment)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    <FaMagic className="text-indigo-500" />
                    <span>AI Rubric & Tips</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {assignment.fileUrl && (
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 p-1"
                        title="View Attachment"
                      >
                        <FaFileAlt />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-text-secondary text-lg">No assignments created yet</p>
          </div>
        )}
      </div>

      {/* AI Rubric Modal */}
      {guideModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-gray-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <FaRobot className="text-indigo-600 text-lg" />
                <span className="font-heading">Gemini AI Evaluation Guide: {guideModal.title}</span>
              </div>
              <button
                onClick={() => setGuideModal({ open: false, title: '', loading: false, content: '' })}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-text-secondary">
              {guideModal.loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <FaSpinner className="animate-spin text-3xl text-indigo-600" />
                  <p className="text-sm font-medium text-gray-500">Generating grading rubric and viva questions with Gemini AI...</p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  {guideModal.content}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <Button variant="outline" onClick={() => setGuideModal({ open: false, title: '', loading: false, content: '' })}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-secondary font-heading">Create New Assignment</h2>
                <p className="text-xs text-text-secondary mt-0.5">Define tasks manually or draft with Gemini AI</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            {/* AI Generator Banner */}
            <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-sm">
                <FaMagic className="text-indigo-600" />
                <span>Gemini AI Assignment Architect</span>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold ml-auto">Gemini 2.5 Flash</span>
              </div>
              <p className="text-xs text-indigo-950/80 mb-3">
                Type an engineering topic and let Gemini construct problem statements, tasks, constraints, and rubrics.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Graph Traversal Algorithms (BFS/DFS) & Applications"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="px-2 py-2 text-xs rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={handleAIGenerate}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Drafting...</span>
                    </>
                  ) : (
                    <>
                      <FaMagic />
                      <span>AI Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Select
                label="Subject"
                value={formData.subjectId}
                onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select Subject</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.subjectName} ({subject.subjectCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Assignment Title"
              />

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Description / Problem Statement & Rubric
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-xs leading-relaxed"
                  rows="6"
                  placeholder="Detailed task instructions, problem statement, and marking scheme..."
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
                  placeholder="e.g. 50"
                />
              </div>

              <Select
                label="Submission Type"
                value={formData.submissionType}
                onValueChange={(value) => setFormData({ ...formData, submissionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Submission Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Upload</SelectItem>
                  <SelectItem value="offline">Offline Submission</SelectItem>
                </SelectContent>
              </Select>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Attachment (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={submitting} className="flex-1 flex items-center justify-center gap-2">
                  <FaCheck /> Create Assignment
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
