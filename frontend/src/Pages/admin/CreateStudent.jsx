import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../services/api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import BackButton from '../../components/BackButton';

const CreateStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    password: '',
    courseId: '',
    semester: 1
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courses`);
      if (response.data.success) {
        setCourses(response.data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get('token');
      const response = await axios.post(`${BASE_URL}/api/admin/students`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Student created successfully!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      <BackButton />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8" style={{ borderTop: '4px solid #c89666' }}>
          <h1 className="text-3xl font-bold mb-8" style={{ color: '#12343b' }}>Create Student Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                  placeholder="Gulshan Kartik"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                  placeholder="kartik@student.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                  placeholder="+91-9876543220"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Roll Number *
                </label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                  placeholder="CSE2021001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Course *
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                >
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 text-white rounded-lg transition-colors font-semibold"
                style={{ backgroundColor: '#c89666' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d545e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#c89666'}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 font-semibold"
                style={{ backgroundColor: '#2d545e' }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#12343b')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#2d545e')}
              >
                {loading ? 'Creating...' : 'Create Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;