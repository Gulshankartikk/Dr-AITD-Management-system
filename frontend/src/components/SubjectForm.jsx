import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const SubjectForm = ({ userRole, userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    courseId: '',
    newCourseName: '',
    newCourseCode: ''
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses`);
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

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
      let courseId = formData.courseId;
      
      // Create new course if selected
      if (formData.courseId === 'add-new' && formData.newCourseName && formData.newCourseCode) {
        const courseEndpoint = userRole === 'admin' 
          ? `${BASE_URL}/api/admin/courses`
          : `${BASE_URL}/api/teacher/${userId}/courses`;
        
        const courseResponse = await axios.post(courseEndpoint, {
          courseName: formData.newCourseName,
          courseCode: formData.newCourseCode,
          courseDuration: '4 years'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        courseId = courseResponse.data.course._id;
      }
      
      const endpoint = userRole === 'admin' 
        ? `${BASE_URL}/api/admin/subjects`
        : `${BASE_URL}/api/teacher/${userId}/subjects`;
      
      await axios.post(endpoint, {
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        courseId: courseId === 'add-new' ? '' : courseId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Subject added successfully');
      setFormData({ subjectName: '', subjectCode: '', courseId: '', newCourseName: '', newCourseCode: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to add subject');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Subject Name</label>
        <select
          name="subjectName"
          value={formData.subjectName}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        >
          <option value="">Select Subject</option>
          <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>
          <option value="Database Management Systems">Database Management Systems</option>
          <option value="Web Development">Web Development</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Computer Networks">Computer Networks</option>
          <option value="Operating Systems">Operating Systems</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="custom">Add Custom Subject</option>
        </select>
        {formData.subjectName === 'custom' && (
          <input
            type="text"
            name="customSubjectName"
            placeholder="Enter custom subject name"
            className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2"
            onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
            required
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Subject Code</label>
        <select
          name="subjectCode"
          value={formData.subjectCode}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        >
          <option value="">Select Code</option>
          <option value="CSE101">CSE101</option>
          <option value="CSE102">CSE102</option>
          <option value="CSE103">CSE103</option>
          <option value="CSE104">CSE104</option>
          <option value="IT101">IT101</option>
          <option value="IT102">IT102</option>
          <option value="CSE201">CSE201</option>
          <option value="CSE202">CSE202</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Course (Optional)</label>
        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Select Course (Optional)</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName} ({course.courseCode})
            </option>
          ))}
          <option value="add-new">Add New Course</option>
        </select>
        {formData.courseId === 'add-new' && (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder="Enter course name"
              className="block w-full border border-gray-300 rounded-md px-3 py-2"
              onChange={(e) => setFormData({...formData, newCourseName: e.target.value})}
            />
            <input
              type="text"
              placeholder="Enter course code"
              className="block w-full border border-gray-300 rounded-md px-3 py-2"
              onChange={(e) => setFormData({...formData, newCourseCode: e.target.value})}
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Add Subject
      </button>
    </form>
  );
};

export default SubjectForm;
