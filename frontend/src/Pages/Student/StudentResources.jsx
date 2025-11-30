import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { FaDownload, FaEye, FaFileAlt, FaCalendarAlt, FaUser, FaLink, FaVideo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';

const StudentResources = () => {
  const studentId = window.location.pathname.split('/')[2];
  const [resources, setResources] = useState({
    assignments: [],
    notes: [],
    materials: [],
    attendance: [],
    videos: [],
    others: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetchResources();
  }, [studentId]);

  const fetchResources = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [assignmentsRes, resourcesRes, attendanceRes, studentRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/student/${studentId}/assignments`, { headers }),
        axios.get(`${BASE_URL}/api/student/${studentId}/resources`, { headers }),
        axios.get(`${BASE_URL}/api/student/${studentId}/attendance`, { headers }),
        axios.get(`${BASE_URL}/api/student/${studentId}/profile`, { headers })
      ]);

      const allResources = resourcesRes.data.resources || [];

      setResources({
        assignments: assignmentsRes.data.assignments || [],
        notes: allResources.filter(r => r.type === 'lecture_note'),
        materials: allResources.filter(r => ['syllabus', 'reference_book', 'paper'].includes(r.type)),
        videos: allResources.filter(r => r.type === 'video'),
        others: allResources.filter(r => r.type === 'other'),
        attendance: attendanceRes.data.attendance || []
      });
      setStudentName(studentRes.data.student?.name || '');
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
      className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === id
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
    >
      {label} <span className="ml-1 text-xs opacity-80 bg-black/10 px-2 py-0.5 rounded-full">{count}</span>
    </button>
  );

  const ResourceCard = ({ resource }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-md uppercase tracking-wider">
              {resource.type.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">{resource.title}</h3>
          <p className="text-sm text-blue-600 font-medium mb-2">{resource.subjectId?.subjectName}</p>

          {resource.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-400" />
              <span>{resource.teacherId?.name}</span>
            </div>
          </div>

          {/* Files */}
          {resource.files && resource.files.length > 0 && (
            <div className="space-y-2 mb-3">
              {resource.files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FaFileAlt className="text-gray-400 flex-shrink-0" />
                    <span className="truncate text-gray-700">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDownload(file.url, file.name)}
                      className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                      title="Download"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          {resource.links && resource.links.length > 0 && (
            <div className="space-y-2">
              {resource.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-blue-50 p-2 rounded-lg"
                >
                  <FaLink className="flex-shrink-0" />
                  <span className="truncate">{link.title || link.url}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <StudentHeader studentId={studentId} studentName={studentName} />
      <BackButton />

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
          <p className="text-gray-500 mt-2">Access your course materials, assignments, and attendance records.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-3 mb-8 pb-2 scrollbar-hide">
          <TabButton id="assignments" label="Assignments" count={resources.assignments.length} />
          <TabButton id="notes" label="Lecture Notes" count={resources.notes.length} />
          <TabButton id="materials" label="Study Materials" count={resources.materials.length} />
          <TabButton id="videos" label="Videos" count={resources.videos.length} />
          <TabButton id="others" label="Other Resources" count={resources.others.length} />
          <TabButton id="attendance" label="Attendance" count={resources.attendance.length} />
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'assignments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.assignments.map((assignment) => (
                <div key={assignment._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-50 text-purple-600 rounded-md">ASSIGNMENT</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${new Date(assignment.deadline) < new Date() ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                      {new Date(assignment.deadline) < new Date() ? 'Overdue' : 'Active'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{assignment.title}</h3>
                  <p className="text-sm text-purple-600 font-medium mb-3">{assignment.subjectId?.subjectName}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {assignment.fileUrl && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => window.open(assignment.fileUrl, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => handleDownload(assignment.fileUrl, assignment.title + '.pdf')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <FaDownload /> Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {resources.assignments.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  No assignments found.
                </div>
              )}
            </div>
          )}

          {['notes', 'materials', 'videos', 'others'].includes(activeTab) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources[activeTab].map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
              {resources[activeTab].length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  No resources found in this category.
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resources.attendance.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.subjectId?.subjectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.teacherId?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {resources.attendance.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No attendance records found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentResources;
