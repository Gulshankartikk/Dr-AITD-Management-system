import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../constants/baseUrl';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export const AttendanceModal = ({ isOpen, onClose, teacherId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([
    { _id: '6919d9552d2366a7429b1181', name: 'Gulshan Kartik', rollNo: 'CSE2021001', status: 'Present' },
    { _id: '6919d9552d2366a7429b1182', name: 'Aditya Sharma', rollNo: 'CSE2021002', status: 'Present' },
    { _id: '6919d9552d2366a7429b1183', name: 'Abhishek Gond', rollNo: 'MCA2022001', status: 'Absent' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (studentId, status) => {
    setStudents(prev => prev.map(student => 
      student._id === studentId ? { ...student, status } : student
    ));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const attendanceData = students.map(student => ({
        studentId: student._id,
        status: student.status
      }));

      await axios.post(`${BASE_URL}/api/teacher/${teacherId}/attendance`, {
        subjectId: '6919d9542d2366a7429b117c',
        date: selectedDate,
        attendanceData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Attendance saved successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mark Attendance</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="space-y-3">
          {students.map(student => (
            <div key={student._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-600">{student.rollNo}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleStatusChange(student._id, 'Present')}
                  className={`px-3 py-1 rounded text-sm ${
                    student.status === 'Present' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Present
                </button>
                <button 
                  onClick={() => handleStatusChange(student._id, 'Absent')}
                  className={`px-3 py-1 rounded text-sm ${
                    student.status === 'Absent' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AssignmentModal = ({ isOpen, onClose, teacherId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    subjectId: '6919d9542d2366a7429b117c'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.deadline) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.post(`${BASE_URL}/api/teacher/${teacherId}/assignments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Assignment created successfully!');
      setFormData({ title: '', description: '', deadline: '', subjectId: '6919d9542d2366a7429b117c' });
      onClose();
    } catch (error) {
      toast.error('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Assignment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="Assignment title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="CSE201">Data Structures - CSE201</option>
              <option value="CSE301">Database Systems - CSE301</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-lg h-24"
              placeholder="Assignment description"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const NoticeModal = ({ isOpen, onClose, teacherId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '6919d9542d2366a7429b117a'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.post(`${BASE_URL}/api/teacher/${teacherId}/notices`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Notice posted successfully!');
      setFormData({ title: '', description: '', courseId: '6919d9542d2366a7429b117a' });
      onClose();
    } catch (error) {
      toast.error('Failed to post notice');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Post Notice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="Notice title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Course</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({...formData, courseId: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="6919d9542d2366a7429b117a">B.Tech Computer Science</option>
              <option value="6919d9542d2366a7429b117b">Master of Computer Applications</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-lg h-32"
              placeholder="Notice description"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Notice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const MaterialModal = ({ isOpen, onClose, teacherId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '6919d9542d2366a7429b117c',
    fileUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get('token');
      const materialData = {
        ...formData,
        fileUrl: formData.fileUrl || 'https://example.com/sample-material.pdf'
      };
      
      await axios.post(`${BASE_URL}/api/teacher/${teacherId}/materials`, materialData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Material uploaded successfully!');
      setFormData({ title: '', description: '', subjectId: '6919d9542d2366a7429b117c', fileUrl: '' });
      onClose();
    } catch (error) {
      toast.error('Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Material</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="Material title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="6919d9542d2366a7429b117c">Data Structures - CSE201</option>
              <option value="6919d9542d2366a7429b117d">Database Systems - CSE301</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">File URL</label>
            <input
              type="url"
              value={formData.fileUrl}
              onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="https://example.com/material.pdf"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-lg h-24"
              placeholder="Material description"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Material'}
          </button>
        </div>
      </div>
    </div>
  );
};