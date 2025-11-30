import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import BackButton from '../../components/BackButton';

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
    <div className="min-h-screen py-8 bg-background">
      <BackButton />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-sky-blue">
          <h1 className="text-3xl font-bold mb-8 text-navy">Add New Course</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-navy">
                  Course Name *
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue outline-none transition-colors"
                  placeholder="Bachelor of Technology - Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-navy">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue outline-none transition-colors"
                  placeholder="BTECH-CSE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-navy">
                  Course Duration *
                </label>
                <select
                  name="courseDuration"
                  value={formData.courseDuration}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue outline-none transition-colors"
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
              <label className="block text-sm font-medium mb-2 text-navy">
                Course Description
              </label>
              <textarea
                name="courseDescription"
                value={formData.courseDescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue outline-none transition-colors"
                placeholder="Brief description of the course..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 text-navy bg-soft-grey rounded-lg transition-colors font-semibold hover:bg-soft-grey/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-white bg-navy rounded-lg transition-colors disabled:opacity-50 font-semibold hover:bg-navy/90"
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
