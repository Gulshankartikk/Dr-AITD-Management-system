import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { FaUser, FaEnvelope, FaPhone, FaChalkboardTeacher, FaBook, FaClipboardList, FaTasks, FaBell } from 'react-icons/fa';
import Cookies from 'js-cookie';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';

const TeacherProfile = () => {
  const { id: teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherProfile();
    fetchAssignments();
    fetchMaterials();
    fetchNotices();
  }, [teacherId]);

  const fetchTeacherProfile = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/teacher/${teacherId}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeacher(response.data.teacher);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/teacher/${teacherId}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/teacher/${teacherId}/materials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(response.data.materials || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/teacher/${teacherId}/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(response.data.notices || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader currentRole="teacher" />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton />
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Teacher Profile</h1>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaUser className="mr-3 text-blue-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={<FaUser />} label="Full Name" value={teacher?.name} />
              <InfoItem icon={<FaEnvelope />} label="Email" value={teacher?.email} />
              <InfoItem icon={<FaPhone />} label="Phone" value={teacher?.phone || 'N/A'} />
              <InfoItem icon={<FaChalkboardTeacher />} label="Department" value={teacher?.department || 'N/A'} />
              <InfoItem icon={<FaChalkboardTeacher />} label="Designation" value={teacher?.designation || 'N/A'} />
              <InfoItem icon={<FaBook />} label="Username" value={teacher?.username || 'N/A'} />
            </div>
          </div>

          {/* Teaching Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard title="Assigned Courses" value={teacher?.assignedCourse?.length || 0} color="blue" />
            <StatCard title="Assigned Subjects" value={teacher?.assignedSubjects?.length || 0} color="green" />
            <StatCard title="Total Assignments" value={assignments.length} color="purple" />
            <StatCard title="Study Materials" value={materials.length} color="orange" />
          </div>

          {/* Assigned Courses */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaBook className="mr-3 text-blue-500" />
              Assigned Courses
            </h2>
            {teacher?.assignedCourse?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacher.assignedCourse.map((course, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="font-bold text-gray-900 text-lg">{course.courseName}</p>
                    <p className="text-sm font-semibold text-gray-700">Code: {course.courseCode}</p>
                    <p className="text-sm font-medium text-gray-600">Duration: {course.courseDuration}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-semibold">No courses assigned</p>
            )}
          </div>

          {/* Assigned Subjects */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaClipboardList className="mr-3 text-green-500" />
              Assigned Subjects
            </h2>
            {teacher?.assignedSubjects?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teacher.assignedSubjects.map((subject, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="font-bold text-gray-900">{subject.subjectName}</p>
                    <p className="text-sm font-semibold text-gray-700">Code: {subject.subjectCode}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-semibold">No subjects assigned</p>
            )}
          </div>

          {/* Recent Assignments */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaTasks className="mr-3 text-purple-500" />
              Recent Assignments
            </h2>
            {assignments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Deadline</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Submissions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.slice(0, 5).map((assignment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{assignment.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{assignment.subjectId?.subjectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700">
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                            {assignment.submittedCount || 0}/{assignment.totalStudents || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-semibold">No assignments created yet</p>
            )}
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaBell className="mr-3 text-red-500" />
              Recent Notices
            </h2>
            {notices.length > 0 ? (
              <div className="space-y-4">
                {notices.slice(0, 5).map((notice, index) => (
                  <div key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <p className="font-bold text-gray-900 text-lg">{notice.title}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-2">{notice.description}</p>
                    <p className="text-xs font-medium text-gray-600 mt-2">
                      Posted: {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-semibold">No notices posted yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
    <div className="text-blue-500 text-xl">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value || 'N/A'}</p>
    </div>
  </div>
);

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
    <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
    <p className="text-3xl font-extrabold text-gray-900">{value}</p>
  </div>
);

export default TeacherProfile;
