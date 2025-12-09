import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../constants/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChalkboardTeacher, FaPlus, FaEdit, FaTrash, FaEye, FaGraduationCap } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton className="mb-4" />
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-secondary font-heading tracking-wide">Teacher Management</h1>
              <p className="text-text-secondary mt-2">Manage all teachers and faculty members</p>
            </div>
            {isAdmin && (
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/students')}
                  className="flex items-center space-x-2"
                >
                  <FaGraduationCap />
                  <span>Manage Students</span>
                </Button>
                <Button
                  onClick={() => navigate('/admin/create-teacher')}
                  className="flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Add Teacher</span>
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-secondary">Teacher Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-secondary">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-secondary">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <FaChalkboardTeacher />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-secondary">{teacher.name}</div>
                            <div className="text-xs text-text-secondary">{teacher.designation || 'Faculty'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary">{teacher.department || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary">{teacher.email}</div>
                        <div className="text-xs text-text-secondary">{teacher.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button className="text-secondary hover:text-secondary/80 transition-colors">
                            <FaEye />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => navigate(`/teacher/${teacher._id}/dashboard`)}
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="View Dashboard"
                            >
                              <FaChalkboardTeacher />
                            </button>
                          )}
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleEdit(teacher)}
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(teacher._id)}
                                className="text-danger hover:text-red-700 transition-colors"
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
        <div className="fixed inset-0 bg-secondary/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="relative p-8 border w-full max-w-md shadow-2xl rounded-lg bg-white">
            <h3 className="text-2xl font-bold text-secondary mb-6 font-heading">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
              {!editingTeacher && (
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              )}
              <div className="flex justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  {editingTeacher ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;