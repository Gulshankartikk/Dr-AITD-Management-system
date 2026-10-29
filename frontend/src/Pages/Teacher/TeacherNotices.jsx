import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaBell, FaPlus, FaFilter, FaCalendarAlt, FaMagic } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../api/axiosInstance';
import aiService from '../../services/aiService';
import { toast } from 'react-toastify';

const TeacherNotices = () => {
  const { teacherId } = useParams();
  const [notices, setNotices] = useState([]);
  const [allNotices, setAllNotices] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterCourse, setFilterCourse] = useState('all');
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    try {
      const [noticesRes, dashboardRes] = await Promise.all([
        api.get(`/api/teacher/${teacherId}/notices`),
        api.get(`/api/teacher/${teacherId}/dashboard`)
      ]);
      const noticesData = noticesRes.data.notices || [];
      setAllNotices(noticesData);
      setNotices(noticesData);
      setSubjects(dashboardRes.data.teacher?.assignedSubjects || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterCourse && filterCourse !== 'all') {
      setNotices(allNotices.filter(n => n.courseId?._id === filterCourse));
    } else {
      setNotices(allNotices);
    }
  }, [filterCourse, allNotices]);

  const handleAiDraft = async () => {
    if (!formData.title.trim()) {
      toast.warning('Please enter a notice title first (e.g. Class Test Schedule)');
      return;
    }
    setIsAiDrafting(true);
    try {
      const selectedSub = subjects.find(s => s.courseId?._id === formData.courseId);
      const res = await aiService.generateNotice({
        title: formData.title,
        audience: selectedSub ? `${selectedSub.courseId?.courseName} - ${selectedSub.subjectName}` : 'Course Students',
        keyPoints: formData.description || 'preparation guidelines and deadlines'
      });
      if (res.noticeText) {
        setFormData(prev => ({ ...prev, description: res.noticeText }));
        toast.success('✨ Notice drafted by Gemini AI!');
      }
    } catch (err) {
      toast.error('Failed to draft notice with AI');
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/teacher/${teacherId}/notices`, formData);
      toast.success('Notice sent successfully!');
      setShowModal(false);
      setFormData({ courseId: '', title: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error sending notice:', error);
      toast.error('Failed to send notice');
    }
  };

  if (loading) return <LoadingSpinner message="Loading notices..." />;

  // Get unique courses from subjects for the filter
  const uniqueCourses = Array.from(new Set(subjects.map(s => s.courseId?._id)))
    .map(id => {
      const subject = subjects.find(s => s.courseId?._id === id);
      return subject?.courseId;
    })
    .filter(Boolean);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-secondary">Notices & Announcements</h1>
          <p className="text-text-secondary mt-1">Broadcast important information to your classes</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <FaPlus /> Create Notice
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <FaFilter className="text-text-muted" />
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="border-none text-sm font-medium focus:ring-0 cursor-pointer text-text-secondary"
        >
          <option value="all">All Courses</option>
          {uniqueCourses.map(course => (
            <option key={course._id} value={course._id}>{course.courseName}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {notices.length > 0 ? notices.map((notice) => (
          <div key={notice._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-secondary font-heading">{notice.title}</h3>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {notice.courseId?.courseName || 'General'}
              </span>
            </div>
            <p className="text-text-secondary mb-4 whitespace-pre-wrap text-sm leading-relaxed">{notice.description}</p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <FaCalendarAlt />
              <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <FaBell className="mx-auto h-12 w-12 text-text-muted mb-4" />
            <p className="text-text-secondary text-lg">No notices found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 font-heading text-secondary">Create Notice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Course/Subject"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                required
              >
                <option value="">-- Select Course --</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject.courseId?._id || ''}>
                    {subject.courseId?.courseName} - {subject.subjectName}
                  </option>
                ))}
              </Select>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Mid-term Assessment Guidelines"
                required
              />

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-text-secondary">Description</label>
                  <button
                    type="button"
                    onClick={handleAiDraft}
                    disabled={isAiDrafting}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 py-1 px-2.5 rounded-lg border border-purple-200 transition-all disabled:opacity-50"
                  >
                    <FaMagic className={isAiDrafting ? 'animate-spin' : ''} />
                    <span>{isAiDrafting ? 'Drafting...' : '✨ Draft with Gemini AI'}</span>
                  </button>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm leading-relaxed"
                  rows="5"
                  placeholder="Enter notice content, or type title above and click '✨ Draft with Gemini AI'..."
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Send Notice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherNotices;
