import React, { useState, useEffect } from 'react';
import { FaBell, FaPlus, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

const NoticesManagement = () => {
  const [notices, setNotices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    courseId: '',
    description: '' // Backend expects description, frontend used content
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const [noticesRes, coursesRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/notices`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/admin/courses`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setNotices(noticesRes.data.notices || []);
      setCourses(coursesRes.data.courses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.courseId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = Cookies.get('token');
      // Using the teacher/admin route which maps to teacherController.addNotice
      await axios.post(`${BASE_URL}/api/teacher/admin/notices`, {
        ...formData,
        teacherId: 'admin'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Notice created successfully');
      setShowCreateModal(false);
      setFormData({ title: '', description: '', courseId: '', content: '' });
      fetchInitialData();
    } catch (error) {
      console.error('Error creating notice:', error);
      toast.error(error.response?.data?.msg || 'Failed to create notice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      const token = Cookies.get('token');
      await axios.delete(`${BASE_URL}/api/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notice deleted successfully');
      fetchInitialData();
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  const openViewModal = (notice) => {
    setSelectedNotice(notice);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Notices Management</h1>
            <p className="text-gray-600">Create and manage institutional notices</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} variant="primary">
            <FaPlus className="mr-2" /> Create Notice
          </Button>
        </div>

        {/* Notices List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Notices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No notices found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FaBell className="text-blue-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{notice.title}</p>
                            <p className="text-sm text-gray-600 truncate max-w-xs">{notice.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {notice.courseId?.courseName || 'All Courses'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onClick={() => openViewModal(notice)} className="text-blue-600 hover:text-blue-900"><FaEye /></button>
                        <button onClick={() => handleDelete(notice._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Notice</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter notice title..."
                />

                <Select
                  label="Target Course"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.courseName}</option>
                  ))}
                </Select>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    placeholder="Enter notice content..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleCreate}>Create Notice</Button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedNotice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Notice Details</h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedNotice.title}</h3>
                  <p className="text-sm text-gray-500">
                    Posted on: {new Date(selectedNotice.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-4">
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {selectedNotice.courseId?.courseName || 'All Courses'}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedNotice.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="primary" onClick={() => setShowViewModal(false)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticesManagement;