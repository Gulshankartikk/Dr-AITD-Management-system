import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { FaBell, FaClipboardList, FaStickyNote, FaEye, FaDownload } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import Cookies from 'js-cookie';
import TeacherHeader from '../../components/TeacherHeader';

const TeacherSummary = () => {
  const { id: teacherId } = useParams();
  const [data, setData] = useState({
    assignments: [],
    notices: [],
    materials: [],
    attendance: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');

  useEffect(() => {
    fetchTeacherData();
  }, [teacherId]);

  const fetchTeacherData = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Set sample data for teacher view
      setData({
        assignments: [
          {
            _id: '1',
            title: 'Data Structures Assignment 1',
            subjectId: { subjectName: 'Data Structures', subjectCode: 'CSE201' },
            deadline: '2024-02-15',
            submittedCount: 2,
            totalStudents: 3,
            createdAt: '2024-01-15'
          },
          {
            _id: '2',
            title: 'Database Project',
            subjectId: { subjectName: 'Database Systems', subjectCode: 'CSE301' },
            deadline: '2024-03-01',
            submittedCount: 0,
            totalStudents: 3,
            createdAt: '2024-01-20'
          }
        ],
        notices: [
          {
            _id: '1',
            title: 'Important Notice for B.Tech CSE',
            description: 'All students are requested to attend the special lecture on advanced topics.',
            courseId: { courseName: 'B.Tech CSE' },
            createdAt: '2024-01-10',
            studentCount: 3
          }
        ],
        materials: [
          {
            _id: '1',
            title: 'Data Structures Notes - Chapter 1',
            subjectId: { subjectName: 'Data Structures', subjectCode: 'CSE201' },
            fileUrl: 'https://example.com/notes.pdf',
            createdAt: '2024-01-12'
          },
          {
            _id: '2',
            title: 'Database Quick Reference',
            subjectId: { subjectName: 'Database Systems', subjectCode: 'CSE301' },
            fileUrl: 'https://example.com/db-reference.pdf',
            createdAt: '2024-01-14'
          }
        ],
        attendance: [
          {
            _id: '1',
            date: '2024-01-15',
            subjectId: { subjectName: 'Data Structures' },
            totalStudents: 3,
            presentCount: 2,
            absentCount: 1
          },
          {
            _id: '2',
            date: '2024-01-16',
            subjectId: { subjectName: 'Database Systems' },
            totalStudents: 3,
            presentCount: 3,
            absentCount: 0
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-green-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
      <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
        {count}
      </span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherHeader currentRole="teacher" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader currentRole="teacher" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">My Activity Summary</h1>
            <p className="text-gray-600 mt-2">Track your teaching activities and student engagement</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">My Assignments</p>
                  <p className="text-3xl font-bold text-gray-800">{data.assignments.length}</p>
                </div>
                <MdAssignment className="text-blue-500 text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">My Notices</p>
                  <p className="text-3xl font-bold text-gray-800">{data.notices.length}</p>
                </div>
                <FaBell className="text-purple-500 text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Materials Uploaded</p>
                  <p className="text-3xl font-bold text-gray-800">{data.materials.length}</p>
                </div>
                <FaStickyNote className="text-orange-500 text-3xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Classes Conducted</p>
                  <p className="text-3xl font-bold text-gray-800">{data.attendance.length}</p>
                </div>
                <FaClipboardList className="text-green-500 text-3xl" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-6">
            <TabButton
              id="assignments"
              label="My Assignments"
              icon={<MdAssignment />}
              count={data.assignments.length}
            />
            <TabButton
              id="notices"
              label="My Notices"
              icon={<FaBell />}
              count={data.notices.length}
            />
            <TabButton
              id="materials"
              label="My Materials"
              icon={<FaStickyNote />}
              count={data.materials.length}
            />
            <TabButton
              id="attendance"
              label="Attendance Summary"
              icon={<FaClipboardList />}
              count={data.attendance.length}
            />
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">My Assignments</h2>
                <div className="space-y-4">
                  {data.assignments.map((assignment) => (
                    <div key={assignment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{assignment.title}</h3>
                          <p className="text-gray-600">{assignment.subjectId?.subjectName} ({assignment.subjectId?.subjectCode})</p>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(assignment.deadline).toLocaleDateString()} | 
                            Created: {new Date(assignment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-lg font-bold text-blue-600">
                                {assignment.submittedCount || 0}/{assignment.totalStudents || 0}
                              </p>
                              <p className="text-xs text-gray-500">Submitted</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <button className="text-blue-500 hover:text-blue-700 text-sm">
                                View Submissions
                              </button>
                              <button className="text-green-500 hover:text-green-700 text-sm">
                                Grade
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notices' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">My Notices</h2>
                <div className="space-y-4">
                  {data.notices.map((notice) => (
                    <div key={notice._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{notice.title}</h3>
                          <p className="text-gray-600 mt-2">{notice.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Course: {notice.courseId?.courseName} | 
                            Posted: {new Date(notice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">{notice.studentCount || 0}</p>
                          <p className="text-xs text-gray-500">Students Reached</p>
                          <button className="text-blue-500 hover:text-blue-700 text-sm mt-2">
                            Edit Notice
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">My Study Materials</h2>
                <div className="space-y-4">
                  {data.materials.map((material) => (
                    <div key={material._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{material.title}</h3>
                          <p className="text-gray-600">{material.subjectId?.subjectName} ({material.subjectId?.subjectCode})</p>
                          <p className="text-sm text-gray-500">
                            Uploaded: {new Date(material.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {material.fileUrl && (
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-700"
                            >
                              <FaDownload size={20} />
                            </a>
                          )}
                          <button className="text-blue-500 hover:text-blue-700 text-sm">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Attendance Summary</h2>
                <div className="space-y-4">
                  {data.attendance.map((record) => (
                    <div key={record._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{record.subjectId?.subjectName}</h3>
                          <p className="text-gray-600">Date: {new Date(record.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-600">{record.presentCount}</p>
                              <p className="text-xs text-gray-500">Present</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-red-600">{record.absentCount}</p>
                              <p className="text-xs text-gray-500">Absent</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-blue-600">
                                {Math.round((record.presentCount / record.totalStudents) * 100)}%
                              </p>
                              <p className="text-xs text-gray-500">Attendance</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSummary;