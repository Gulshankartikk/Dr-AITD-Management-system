import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import Cookies from 'js-cookie';
import { FaDownload, FaEye, FaFileAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StudentResources = ({ studentId }) => {
  const [resources, setResources] = useState({
    assignments: [],
    notes: [],
    materials: [],
    attendance: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');

  useEffect(() => {
    fetchResources();
  }, [studentId]);

  const fetchResources = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [assignmentsRes, notesRes, materialsRes, attendanceRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/student/${studentId}/assignments`, { headers }),
        axios.get(`${BASE_URL}/api/student/${studentId}/notes`, { headers }),
        axios.get(`${BASE_URL}/api/student/${studentId}/materials`, { headers }),
        axios.get(`${BASE_URL}/api/student/${studentId}/attendance`, { headers })
      ]);

      setResources({
        assignments: assignmentsRes.data.assignments || [],
        notes: notesRes.data.notes || [],
        materials: materialsRes.data.materials || [],
        attendance: attendanceRes.data.attendance || []
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const TabButton = ({ id, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label} ({count})
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Resources</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <TabButton id="assignments" label="Assignments" count={resources.assignments.length} />
        <TabButton id="notes" label="Notes" count={resources.notes.length} />
        <TabButton id="materials" label="Study Materials" count={resources.materials.length} />
        <TabButton id="attendance" label="Attendance" count={resources.attendance.length} />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'assignments' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
            <div className="space-y-4">
              {resources.assignments.map((assignment) => (
                <div key={assignment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      <p className="text-gray-600">{assignment.subjectId?.subjectName}</p>
                      <p className="text-sm text-gray-500">
                        <FaCalendarAlt className="inline mr-1" />
                        Due: {new Date(assignment.deadline).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <FaUser className="inline mr-1" />
                        By: {assignment.teacherId?.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {assignment.fileUrl && (
                        <>
                          <button
                            onClick={() => window.open(assignment.fileUrl, '_blank')}
                            className="text-blue-500 hover:text-blue-700"
                            title="View"
                          >
                            <FaEye size={20} />
                          </button>
                          <button
                            onClick={() => handleDownload(assignment.fileUrl, assignment.title + '.pdf')}
                            className="text-green-500 hover:text-green-700"
                            title="Download"
                          >
                            <FaDownload size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notes</h2>
            <div className="space-y-4">
              {resources.notes.map((note) => (
                <div key={note._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{note.title}</h3>
                      <p className="text-gray-600">{note.subjectId?.subjectName}</p>
                      <p className="text-sm text-gray-500">
                        <FaUser className="inline mr-1" />
                        By: {note.teacherId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Updated: {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {note.fileUrl && (
                        <>
                          <button
                            onClick={() => window.open(note.fileUrl, '_blank')}
                            className="text-blue-500 hover:text-blue-700"
                            title="View"
                          >
                            <FaEye size={20} />
                          </button>
                          <button
                            onClick={() => handleDownload(note.fileUrl, note.title + '.pdf')}
                            className="text-green-500 hover:text-green-700"
                            title="Download"
                          >
                            <FaDownload size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Study Materials</h2>
            <div className="space-y-4">
              {resources.materials.map((material) => (
                <div key={material._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{material.title}</h3>
                      <p className="text-gray-600">{material.subjectId?.subjectName}</p>
                      <p className="text-sm text-gray-500">{material.description}</p>
                      <p className="text-sm text-gray-500">
                        <FaUser className="inline mr-1" />
                        By: {material.teacherId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Updated: {new Date(material.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {material.fileUrl && (
                        <>
                          <button
                            onClick={() => window.open(material.fileUrl, '_blank')}
                            className="text-blue-500 hover:text-blue-700"
                            title="View"
                          >
                            <FaEye size={20} />
                          </button>
                          <button
                            onClick={() => handleDownload(material.fileUrl, material.title + '.pdf')}
                            className="text-green-500 hover:text-green-700"
                            title="Download"
                          >
                            <FaDownload size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Attendance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.attendance.map((record) => (
                    <tr key={record._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{record.subjectId?.subjectName}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'Present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{record.teacherId?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResources;