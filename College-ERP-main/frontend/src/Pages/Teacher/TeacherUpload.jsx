import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaUpload, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';

const TeacherUpload = ({ teacherId }) => {
  const [activeTab, setActiveTab] = useState('assignment');
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    courseId: '',
    deadline: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSubjectsAndCourses();
  }, []);

  const fetchSubjectsAndCourses = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [subjectsRes, coursesRes] = await Promise.all([
        axios.get(`${BASE_URL}/subjects`, { headers }),
        axios.get(`${BASE_URL}/courses`, { headers })
      ]);

      setSubjects(subjectsRes.data.subjects || []);
      setCourses(coursesRes.data.courses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = Cookies.get('token');
      const uploadFormData = new FormData();
      
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('subjectId', formData.subjectId);
      
      if (activeTab === 'assignment') {
        uploadFormData.append('deadline', formData.deadline);
      }
      if (activeTab === 'notice') {
        uploadFormData.append('courseId', formData.courseId);
      }
      if (formData.file) {
        uploadFormData.append('file', formData.file);
      }

      let endpoint = '';
      switch (activeTab) {
        case 'assignment':
          endpoint = `/api/teacher/${teacherId}/assignments`;
          break;
        case 'note':
          endpoint = `/api/teacher/${teacherId}/notes`;
          break;
        case 'material':
          endpoint = `/api/teacher/${teacherId}/materials`;
          break;
        case 'notice':
          endpoint = `/api/teacher/${teacherId}/notices`;
          break;
      }

      await axios.post(`${BASE_URL}${endpoint}`, uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(`${activeTab} uploaded successfully!`);
      setFormData({
        title: '',
        description: '',
        subjectId: '',
        courseId: '',
        deadline: '',
        file: null
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${activeTab}`);
    } finally {
      setUploading(false);
    }
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Content</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <TabButton id="assignment" label="Assignment" />
        <TabButton id="note" label="Notes" />
        <TabButton id="material" label="Study Material" />
        <TabButton id="notice" label="Notice" />
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {activeTab !== 'notice' && (
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'notice' && (
            <div>
              <label className="block text-sm font-medium mb-2">Course *</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.courseName} ({course.courseCode})
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'assignment' && (
            <div>
              <label className="block text-sm font-medium mb-2">Deadline *</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload File {activeTab !== 'notice' && '*'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FaFileAlt className="mx-auto text-gray-400 text-3xl mb-2" />
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
                id="file-upload"
                required={activeTab !== 'notice'}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-500 hover:text-blue-700"
              >
                Click to upload file
              </label>
              <p className="text-sm text-gray-500 mt-1">
                PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
              </p>
              {formData.file && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {formData.file.name}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Upload {activeTab}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherUpload;