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
        ? 'bg-sky-blue text-white shadow-md'
        : 'bg-white text-text-grey hover:bg-background border border-soft-grey'
        }`}
    >
      {label} <span className="ml-1 text-xs opacity-80 bg-black/10 px-2 py-0.5 rounded-full">{count}</span>
    </button>
  );

  const ResourceCard = ({ resource }) => (
    <div className="bg-white border border-soft-grey rounded-xl p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-semibold bg-sky-blue/10 text-sky-blue rounded-md uppercase tracking-wider">
              {resource.type.replace('_', ' ')}
            </span>
            <span className="text-xs text-text-grey/70">
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-bold text-lg text-navy mb-1">{resource.title}</h3>
          <p className="text-sm text-sky-blue font-medium mb-2">{resource.subjectId?.subjectName}</p>

          {resource.description && (
            <p className="text-sm text-text-grey mb-4 line-clamp-2">{resource.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-text-grey mb-4">
            <div className="flex items-center gap-1">
              <FaUser className="text-text-grey/70" />
              <span>{resource.teacherId?.name}</span>
            </div>
          </div>

          {/* Files */}
          {resource.files && resource.files.length > 0 && (
            <div className="space-y-2 mb-3">
              {resource.files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-background p-2 rounded-lg text-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FaFileAlt className="text-text-grey/70 flex-shrink-0" />
                    <span className="truncate text-text-grey">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-1.5 text-sky-blue hover:bg-sky-blue/10 rounded-md transition-colors"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDownload(file.url, file.name)}
                      className="p-1.5 text-navy hover:bg-navy/10 rounded-md transition-colors"
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
                  className="flex items-center gap-2 text-sm text-sky-blue hover:underline bg-sky-blue/10 p-2 rounded-lg"
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
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <StudentHeader studentId={studentId} studentName={studentName} />
      <BackButton />

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">Learning Resources</h1>
          <p className="text-text-grey mt-2">Access your course materials, assignments, and attendance records.</p>
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
                <div key={assignment._id} className="bg-white border border-soft-grey rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">

                    {assignment.fileUrl && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-soft-grey">
                        <button
                          onClick={() => window.open(assignment.fileUrl, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-sky-blue bg-sky-blue/10 rounded-lg hover:bg-sky-blue/20 transition-colors"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => handleDownload(assignment.fileUrl, assignment.title + '.pdf')}
                          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-navy bg-navy/10 rounded-lg hover:bg-navy/20 transition-colors"
                        >
                          <FaDownload /> Download
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {resources.assignments.length === 0 && (
                <div className="col-span-full text-center py-12 text-text-grey bg-white rounded-xl border border-dashed border-soft-grey">
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
                <div className="col-span-full text-center py-12 text-text-grey bg-white rounded-xl border border-dashed border-soft-grey">
                  No resources found in this category.
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="bg-white rounded-xl shadow-sm border border-soft-grey overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase tracking-wider">Teacher</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resources.attendance.map((record) => (
                      <tr key={record._id} className="hover:bg-background">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                          {record.subjectId?.subjectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present'
                            ? 'bg-sky-blue/10 text-sky-blue'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-grey">
                          {record.teacherId?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {resources.attendance.length === 0 && (
                <div className="text-center py-12 text-text-grey">
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
