import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../services/api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    courseDuration: '',
    courseDescription: ''
  });

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
      const response = await axios.post(`${BASE_URL}/api/admin/courses`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Course created successfully!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8" style={{ borderTop: '4px solid #c89666' }}>
          <h1 className="text-3xl font-bold mb-8" style={{ color: '#12343b' }}>Add New Course</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Course Name *
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                  placeholder="Bachelor of Technology - Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Course Code *
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                  placeholder="BTECH-CSE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                  Course Duration *
                </label>
                <select
                  name="courseDuration"
                  value={formData.courseDuration}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: '#c89666' }}
                  onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                  onBlur={(e) => e.target.style.borderColor = '#c89666'}
                >
                  <option value="">Select Duration</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="4 Years">4 Years</option>
                  <option value="5 Years">5 Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2d545e' }}>
                Course Description
              </label>
              <textarea
                name="courseDescription"
                value={formData.courseDescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ borderColor: '#c89666' }}
                onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                onBlur={(e) => e.target.style.borderColor = '#c89666'}
                placeholder="Brief description of the course..."
              />
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
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;