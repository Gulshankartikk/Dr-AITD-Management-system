import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
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
            deadline: '2024-02-15',
            submittedCount: 2,
            totalStudents: 3,
            createdAt: '2024-01-15'
          },
          {
            _id: '2',
            title: 'Database Project',
            subjectId: { subjectName: 'Database Systems', subjectCode: 'CSE301' },
            deadline: '2024-03-01',
            submittedCount: 0,
            totalStudents: 3,
            createdAt: '2024-01-20'
          }
        ],
        notices: [
          {
            _id: '1',
            title: 'Important Notice for B.Tech CSE',
            description: 'All students are requested to attend the special lecture.',
            courseId: { courseName: 'B.Tech CSE' },
            createdAt: '2024-01-10',
            studentCount: 3
          }
        ],
        materials: [
          {
            _id: '1',
            title: 'Data Structures Notes',
            subjectId: { subjectName: 'Data Structures', subjectCode: 'CSE201' },
            fileUrl: 'https://example.com/notes.pdf',
            createdAt: '2024-01-12'
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
            name: 'Dr. John Smith',
            email: 'john.smith@college.edu',
            phone: '+91-9876543210',
            assignedSubjects: ['Data Structures', 'Database Systems']
          },
          {
            _id: '6919d9542d2366a7429b1180',
            name: 'Prof. Sarah Johnson',
            email: 'sarah.johnson@college.edu',
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
      
      switch(type) {
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
      toast.error(`Failed to delete ${type}`);
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
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
      <div className="min-h-screen bg-gray-50">
        <AdminHeader currentRole="admin" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentRole="admin" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Activity Summary</h1>
            <p className="text-gray-600 mt-2">Track all teacher activities and system notifications</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Assignments</p>
                  <p className="text-3xl font-bold text-gray-800">{data.assignments.length}</p>
                </div>
                <MdAssignment className="text-blue-500 text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Notices</p>
                  <p className="text-3xl font-bold text-gray-800">{data.notices.length}</p>
                </div>
                <FaBell className="text-purple-500 text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Study Materials</p>
                  <p className="text-3xl font-bold text-gray-800">{data.materials.length}</p>
                </div>
                <FaStickyNote className="text-orange-500 text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Attendance Records</p>
                  <p className="text-3xl font-bold text-gray-800">{data.attendance.length}</p>
                </div>
                <FaClipboardList className="text-green-500 text-3xl" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-6">
            <TabButton
              id="assignments"
              label="Assignments"
              icon={<MdAssignment />}
              count={data.assignments.length}
            />
            <TabButton
              id="notices"
              label="Notices"
              icon={<FaBell />}
              count={data.notices.length}
            />
            <TabButton
              id="materials"
              label="Materials"
              icon={<FaStickyNote />}
              count={data.materials.length}
            />
            <TabButton
              id="attendance"
              label="Attendance"
              icon={<FaClipboardList />}
              count={data.attendance.length}
            />
            <TabButton
              id="teachers"
              label="Teachers"
              icon={<FaEdit />}
              count={data.teachers.length}
            />
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Assignment Tracking</h2>
                <div className="space-y-4">
                  {data.assignments.map((assignment) => (
                    <div key={assignment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{assignment.title}</h3>
                          <p className="text-gray-600">{assignment.subjectId?.subjectName} ({assignment.subjectId?.subjectCode})</p>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(assignment.deadline).toLocaleDateString()} | 
                            Created: {new Date(assignment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-lg font-bold text-blue-600">
                                {assignment.submittedCount || 0}/{assignment.totalStudents || 0}
                              </p>
                              <p className="text-xs text-gray-500">Submitted</p>
                            </div>
                            <button className="text-blue-500 hover:text-blue-700 mr-2">
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
                  {data.notices.map((notice) => (
                    <div key={notice._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{notice.title}</h3>
                          <p className="text-gray-600 mt-2">{notice.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
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
                          <p className="text-lg font-bold text-purple-600">{notice.studentCount || 0}</p>
                          <p className="text-xs text-gray-500">Students Notified</p>
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
                  {data.materials.map((material) => (
                    <div key={material._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{material.title}</h3>
                          <p className="text-gray-600">{material.subjectId?.subjectName} ({material.subjectId?.subjectCode})</p>
                          <p className="text-sm text-gray-500">
                            Uploaded: {new Date(material.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {material.fileUrl && (
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-700"
                            >
                              <FaDownload size={20} />
                            </a>
                          )}
                          <button className="text-blue-500 hover:text-blue-700 mr-2">
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
                <h2 className="text-2xl font-semibold mb-4">Attendance Records</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Subject</th>
                        <th className="px-4 py-2 text-left">Student</th>
                        <th className="px-4 py-2 text-left">Roll No</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.attendance.map((record) => (
                        <tr key={record._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{record.subjectId?.subjectName}</td>
                          <td className="px-4 py-2">{record.studentId?.name}</td>
                          <td className="px-4 py-2">{record.studentId?.rollNo}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              record.status === 'Present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
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
                  {data.teachers.map((teacher) => (
                    <div key={teacher._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{teacher.name}</h3>
                          <p className="text-gray-600">{teacher.email}</p>
                          <p className="text-sm text-gray-500">{teacher.phone}</p>
                          <p className="text-xs text-gray-400">
                            Subjects: {teacher.assignedSubjects?.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditTeacher(teacher)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Teacher</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button 
              type="button"
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
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