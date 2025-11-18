import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/baseUrl';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const CourseForm = ({ userRole, userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    courseDuration: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      const endpoint = userRole === 'admin' 
        ? `${BASE_URL}/api/admin/courses`
        : `${BASE_URL}/api/teacher/${userId}/courses`;
      
      await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Course added successfully');
      setFormData({ courseName: '', courseCode: '', courseDuration: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to add course');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Course Name</label>
        <select
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        >
          <option value="">Select Course</option>
          <option value="Computer Science Engineering">Computer Science Engineering</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics and Communication">Electronics and Communication</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Course Code</label>
        <select
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        >
          <option value="">Select Code</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
          <option value="EE">EE</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Duration</label>
        <input
          type="text"
          name="courseDuration"
          value={formData.courseDuration}
          onChange={handleChange}
          placeholder="e.g., 4 years"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Add Course
      </button>
    </form>
  );
};

export default CourseForm;