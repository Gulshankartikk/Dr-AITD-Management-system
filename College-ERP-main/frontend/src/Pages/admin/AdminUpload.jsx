import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaUpload, FaFileAlt, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';

const AdminUpload = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    subjectId: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [coursesRes, subjectsRes] = await Promise.all([
        axios.get(`${BASE_URL}/courses`, { headers }),
        axios.get(`${BASE_URL}/subjects`, { headers })
      ]);

      setCourses(coursesRes.data.courses || []);
      setSubjects(subjectsRes.data.subjects || []);
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
      
      if (activeTab === 'notice') {
        uploadFormData.append('courseId', formData.courseId);
      } else {
        uploadFormData.append('subjectId', formData.subjectId);
      }
      
      if (formData.file) {
        uploadFormData.append('file', formData.file);
      }

      // Since admin doesn't have specific upload endpoints, we'll use teacher endpoints
      // In a real system, you'd create admin-specific endpoints
      const endpoint = activeTab === 'notice' 
        ? `/api/admin/notices`
        : `/api/admin/materials`;

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
        courseId: '',
        subjectId: '',
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

  const TabButton = ({ id, label, icon }) => (
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
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentRole="admin" />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Admin Content Upload</h1>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6">
            <TabButton id="notice" label="System Notice" icon={<FaUsers />} />
            <TabButton id="material" label="Study Material" icon={<FaFileAlt />} />
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
                  placeholder={`Enter ${activeTab} title`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${activeTab} description`}
                  required
                />
              </div>

              {activeTab === 'notice' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Target Course *</label>
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
              ) : (
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload File (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaFileAlt className="mx-auto text-gray-400 text-3xl mb-2" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                  >
                    Click to upload file
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOC, DOCX, PPT, PPTX, Images (Max 10MB)
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
                    Publishing...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    Publish {activeTab}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;