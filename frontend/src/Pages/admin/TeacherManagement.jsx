import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../constants/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChalkboardTeacher, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: ''
  });
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || sessionStorage.getItem('role');
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/unauthorized');
      return;
    }
    fetchTeachers();
  }, [userRole, navigate]);

  const fetchTeachers = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTeachers(response.data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || '',
      department: teacher.department || '',
      designation: teacher.designation || '',
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        const token = Cookies.get('token');
        await axios.delete(`${BASE_URL}/api/admin/teachers/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast.error('Failed to delete teacher');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get('token');

      if (editingTeacher) {
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password;

        await axios.put(`${BASE_URL}/api/admin/teachers/${editingTeacher._id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Teacher updated successfully');
      } else {
        await axios.post(`${BASE_URL}/api/admin/teachers`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Teacher created successfully');
      }

      setShowModal(false);
      setEditingTeacher(null);
      setFormData({ name: '', email: '', phone: '', department: '', designation: '', password: '' });
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast.error(error.response?.data?.msg || 'Failed to save teacher');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-night-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton className="mb-4" />
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-night-blue font-oswald tracking-wide">Teacher Management</h1>
              <p className="text-gray-600 mt-2">Manage all teachers and faculty members</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingTeacher(null);
                  setFormData({ name: '', email: '', phone: '', department: '', designation: '', password: '' });
                  setShowModal(true);
                }}
                className="flex items-center space-x-2 bg-sand-tan text-night-blue-shadow px-6 py-2 rounded-lg hover:bg-sand-tan-shadow transition-colors font-bold shadow-md"
              >
                <FaPlus />
                <span>Add Teacher</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-night-blue text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-sand-tan">Teacher Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-sand-tan">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-sand-tan">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-sand-tan">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-night-blue bg-opacity-10 rounded-full flex items-center justify-center text-night-blue">
                            <FaChalkboardTeacher />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-night-blue">{teacher.name}</div>
                            <div className="text-xs text-gray-500">{teacher.designation || 'Faculty'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.department || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.email}</div>
                        <div className="text-xs text-gray-500">{teacher.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button className="text-night-blue hover:text-night-blue-shadow transition-colors">
                            <FaEye />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleEdit(teacher)}
                                className="text-sand-tan-shadow hover:text-sand-tan transition-colors"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(teacher._id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-night-blue-shadow bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-8 border w-full max-w-md shadow-2xl rounded-lg bg-white">
            <h3 className="text-2xl font-bold text-night-blue mb-6 font-oswald">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-night-blue focus:border-night-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-night-blue focus:border-night-blue"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-night-blue focus:border-night-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-night-blue focus:border-night-blue"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-night-blue focus:border-night-blue"
                />
              </div>
              {!editingTeacher && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-night-blue focus:border-night-blue"
                    required
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-night-blue text-white rounded-md hover:bg-night-blue-shadow transition-colors"
                >
                  {editingTeacher ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;