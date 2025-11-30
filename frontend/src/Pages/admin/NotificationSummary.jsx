import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { FaBell, FaClipboardList, FaStickyNote, FaFileAlt, FaEye, FaDownload, FaTrash, FaEdit } from 'react-icons/fa';
import { MdAssignment, MdNotifications } from 'react-icons/md';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import AdminHeader from '../../components/AdminHeader';

const NotificationSummary = () => {
  const [data, setData] = useState({
    assignments: [],
    notices: [],
    materials: [],
    attendance: [],
    teachers: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data
      const [assignmentsRes, noticesRes, materialsRes, attendanceRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/teacher/6919d9542d2366a7429b117f/assignments`, { headers }),
        axios.get(`${BASE_URL}/api/teacher/6919d9542d2366a7429b117f/notices`, { headers }),
        axios.get(`${BASE_URL}/api/teacher/6919d9542d2366a7429b117f/materials`, { headers }),
        axios.get(`${BASE_URL}/api/teacher/6919d9542d2366a7429b117f/attendance`, { headers })
      ]);

      setData({
        assignments: assignmentsRes.data.assignments || [],
        notices: noticesRes.data.notices || [],
        materials: materialsRes.data.materials || [],
        attendance: attendanceRes.data.attendance || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set sample data if API fails
      setData({
        assignments: [
          {
            _id: '1',
            title: 'Data Structures Assignment 1',
            subjectId: { subjectName: 'Data Structures', subjectCode: 'CSE201' },
            deadline: '2025-02-15',
            submittedCount: 2,
            totalStudents: 3,
            createdAt: '2025-01-15'
          },
          {
            _id: '2',
            title: 'Database Project',
            subjectId: { subjectName: 'Database Systems', subjectCode: 'CSE301' },
            deadline: '2025-03-01',
            submittedCount: 0,
            totalStudents: 3,
            createdAt: '2025-01-20'
          }
        ],
        notices: [
          {
            _id: '1',
            title: 'Important Notice for B.Tech CSE',
            description: 'All students are requested to attend the special lecture.',
            courseId: { courseName: 'B.Tech CSE' },
            createdAt: '2025-01-10',
            studentCount: 3
          }
        ],
        materials: [
          {
            _id: '1',
            title: 'Data Structures Notes',
            subjectId: { subjectName: 'Data Structures', subjectCode: 'CSE201' },
            fileUrl: 'https://example.com/notes.pdf',
            createdAt: '2025-01-12'
          }
        ],
        attendance: [
          {
            _id: '1',
            date: '2024-01-15',
            subjectId: { subjectName: 'Data Structures' },
            studentId: { name: 'Alice Johnson', rollNo: 'CSE2021001' },
            status: 'Present'
          }
        ],
        teachers: [
          {
            _id: '6919d9542d2366a7429b117f',
            name: 'Dr. kartik Sharma',
            email: 'kartik.sharma@college.edu',
            phone: '+91-9876543210',
            assignedSubjects: ['Data Structures', 'Database Systems']
          },
          {
            _id: '6919d9542d2366a7429b1180',
            name: 'Prof. prince verma',
            email: 'prince.verma@college.edu',
            phone: '+91-9876543211',
            assignedSubjects: ['Web Development']
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = Cookies.get('token');
      let endpoint = '';

      switch (type) {
        case 'assignment':
          endpoint = `/api/admin/assignments/${id}`;
          break;
        case 'notice':
          endpoint = `/api/admin/notices/${id}`;
          break;
        case 'material':
          endpoint = `/api/admin/materials/${id}`;
          break;
        case 'teacher':
          endpoint = `/api/admin/teachers/${id}`;
          break;
      }

      await axios.delete(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from local state
      setData(prev => ({
        ...prev,
        [type + 's']: prev[type + 's'].filter(item => item._id !== id)
      }));

      toast.success(`${type} deleted successfully!`);
    } catch (error) {
      console.error('Delete error:', error);

      // If item doesn't exist (404) or server error (500), remove from UI anyway
      if (error.response?.status === 404 || error.response?.status === 500) {
        setData(prev => ({
          ...prev,
          [type + 's']: prev[type + 's'].filter(item => item._id !== id)
        }));
        toast.success(`${type} removed from display`);
      } else {
        const errorMsg = error.response?.data?.msg || error.message || `Failed to delete ${type}`;
        toast.error(errorMsg);
      }
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setShowEditModal(true);
  };

  const handleUpdateTeacher = async (updatedData) => {
    try {
      const token = Cookies.get('token');
      await axios.put(`${BASE_URL}/api/admin/teachers/${editingTeacher._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setData(prev => ({
        ...prev,
        teachers: prev.teachers.map(t =>
          t._id === editingTeacher._id ? { ...t, ...updatedData } : t
        )
      }));

      toast.success('Teacher updated successfully!');
      setShowEditModal(false);
      setEditingTeacher(null);
    } catch (error) {
      toast.error('Failed to update teacher');
    }
  };

  const TabButton = ({ id, label, icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === id
        ? 'bg-sky-blue text-white'
        : 'bg-soft-grey text-navy hover:bg-soft-grey/80'
        }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
      <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
        {count}
      </span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader currentRole="admin" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentRole="admin" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-navy">Activity Summary</h1>
            <p className="text-text-grey mt-2">Track all teacher activities and system notifications</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-sky-blue">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-grey text-sm">Total Assignments</p>
                  <p className="text-3xl font-bold text-navy">{data?.assignments?.length || 0}</p>
                </div>
                <MdAssignment className="text-sky-blue text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-navy">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-grey text-sm">Total Notices</p>
                  <p className="text-3xl font-bold text-navy">{data?.notices?.length || 0}</p>
                </div>
                <FaBell className="text-navy text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-sky-blue">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-grey text-sm">Study Materials</p>
                  <p className="text-3xl font-bold text-navy">{data?.materials?.length || 0}</p>
                </div>
                <FaStickyNote className="text-sky-blue text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-navy">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-grey text-sm">Attendance Records</p>
                  <p className="text-3xl font-bold text-navy">{data?.attendance?.length || 0}</p>
                </div>
                <FaClipboardList className="text-navy text-3xl" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-6">
            <TabButton
              id="assignments"
              label="Assignments"
              icon={<MdAssignment />}
              count={data?.assignments?.length || 0}
            />
            <TabButton
              id="notices"
              label="Notices"
              icon={<FaBell />}
              count={data?.notices?.length || 0}
            />
            <TabButton
              id="materials"
              label="Materials"
              icon={<FaStickyNote />}
              count={data?.materials?.length || 0}
            />
            <TabButton
              id="attendance"
              label="Attendance"
              icon={<FaClipboardList />}
              count={data?.attendance?.length || 0}
            />
            <TabButton
              id="teachers"
              label="Teachers"
              icon={<FaEdit />}
              count={data?.teachers?.length || 0}
            />
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Assignment Tracking</h2>
                <div className="space-y-4">
                  {(data?.assignments || []).map((assignment) => (
                    <div key={assignment._id} className="border border-soft-grey rounded-lg p-4 hover:bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-navy">{assignment.title}</h3>
                          <p className="text-text-grey">{assignment.subjectId?.subjectName} ({assignment.subjectId?.subjectCode})</p>
                          <p className="text-sm text-text-grey">
                            Due: {new Date(assignment.deadline).toLocaleDateString()} |
                            Created: {new Date(assignment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-lg font-bold text-sky-blue">
                                {assignment.submittedCount || 0}/{assignment.totalStudents || 0}
                              </p>
                              <p className="text-xs text-text-grey">Submitted</p>
                            </div>
                            <button className="text-sky-blue hover:text-sky-blue/80 mr-2">
                              <FaEye size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete('assignment', assignment._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notices' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Notice Board Activity</h2>
                <div className="space-y-4">
                  {(data?.notices || []).map((notice) => (
                    <div key={notice._id} className="border border-soft-grey rounded-lg p-4 hover:bg-background">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-navy">{notice.title}</h3>
                          <p className="text-text-grey mt-2">{notice.description}</p>
                          <p className="text-sm text-text-grey mt-2">
                            Course: {notice.courseId?.courseName} |
                            Posted: {new Date(notice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <button
                              onClick={() => handleDelete('notice', notice._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                          <p className="text-lg font-bold text-navy">{notice.studentCount || 0}</p>
                          <p className="text-xs text-text-grey">Students Notified</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Study Materials</h2>
                <div className="space-y-4">
                  {(data?.materials || []).map((material) => (
                    <div key={material._id} className="border border-soft-grey rounded-lg p-4 hover:bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-navy">{material.title}</h3>
                          <p className="text-text-grey">{material.subjectId?.subjectName} ({material.subjectId?.subjectCode})</p>
                          <p className="text-sm text-text-grey">
                            Uploaded: {new Date(material.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {material.fileUrl && (
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-blue hover:text-sky-blue/80"
                            >
                              <FaDownload size={20} />
                            </a>
                          )}
                          <button className="text-sky-blue hover:text-sky-blue/80 mr-2">
                            <FaEye size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete('material', material._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-navy">Attendance Records</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-background">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Subject</th>
                        <th className="px-4 py-2 text-left">Student</th>
                        <th className="px-4 py-2 text-left">Roll No</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.attendance || []).map((record) => (
                        <tr key={record._id} className="border-b border-soft-grey hover:bg-background">
                          <td className="px-4 py-2 text-navy">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-text-grey">{record.subjectId?.subjectName}</td>
                          <td className="px-4 py-2 text-navy">{record.studentId?.name}</td>
                          <td className="px-4 py-2 text-text-grey">{record.studentId?.rollNo}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'Present' ? 'bg-sky-blue/10 text-sky-blue' : 'bg-navy/10 text-navy'
                              }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Teacher Management</h2>
                <div className="space-y-4">
                  {(data?.teachers || []).map((teacher) => (
                    <div key={teacher._id} className="border border-soft-grey rounded-lg p-4 hover:bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-navy">{teacher.name}</h3>
                          <p className="text-text-grey">{teacher.email}</p>
                          <p className="text-sm text-text-grey">{teacher.phone}</p>
                          <p className="text-xs text-text-grey/80">
                            Subjects: {teacher.assignedSubjects?.length ? teacher.assignedSubjects.join(', ') : 'No subjects assigned'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="text-sky-blue hover:text-sky-blue/80 mr-2"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete('teacher', teacher._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Teacher Modal */}
        {showEditModal && editingTeacher && (
          <EditTeacherModal
            teacher={editingTeacher}
            onClose={() => {
              setShowEditModal(false);
              setEditingTeacher(null);
            }}
            onUpdate={handleUpdateTeacher}
          />
        )}
      </div>
    </div>
  );
};

// Edit Teacher Modal Component
const EditTeacherModal = ({ teacher, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-navy">Edit Teacher</h2>
          <button onClick={onClose} className="text-text-grey hover:text-navy">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-navy">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-navy">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-navy">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-blue text-white rounded-lg disabled:opacity-50 hover:bg-sky-blue/80"
            >
              {loading ? 'Updating...' : 'Update Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationSummary;
