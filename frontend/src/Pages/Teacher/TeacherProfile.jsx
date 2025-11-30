import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { FaUser, FaEnvelope, FaPhone, FaChalkboardTeacher, FaBook, FaClipboardList, FaTasks, FaBell } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';

const TeacherProfile = () => {
  const { id: teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '', department: '', designation: '' });

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
      setEditData({
        name: response.data.teacher?.name || '',
        email: response.data.teacher?.email || '',
        phone: response.data.teacher?.phone || '',
        department: response.data.teacher?.department || '',
        designation: response.data.teacher?.designation || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({
        name: teacher?.name || '',
        email: teacher?.email || '',
        phone: teacher?.phone || '',
        department: teacher?.department || '',
        designation: teacher?.designation || ''
      });
    }
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put(`${BASE_URL}/api/teacher/${teacherId}/profile`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeacher({ ...teacher, ...editData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TeacherHeader currentRole="teacher" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton />

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-navy">Teacher Profile</h1>
            <button
              onClick={handleEditToggle}
              className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg text-white ${isEditing ? 'bg-sky-blue' : 'bg-navy'}`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
              <FaUser className="mr-3 text-sky-blue" />
              Personal Information
            </h2>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2 text-sm text-navy">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-lg border-2 border-soft-grey focus:border-sky-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-sm text-navy">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-lg border-2 border-soft-grey focus:border-sky-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-sm text-navy">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-lg border-2 border-soft-grey focus:border-sky-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-sm text-navy">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={editData.department}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-lg border-2 border-soft-grey focus:border-sky-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-sm text-navy">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={editData.designation}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-lg border-2 border-soft-grey focus:border-sky-blue focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={handleSaveProfile}
                    className="w-full py-3 px-6 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg bg-navy text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={<FaUser />} label="Full Name" value={teacher?.name} />
                <InfoItem icon={<FaEnvelope />} label="Email" value={teacher?.email} />
                <InfoItem icon={<FaPhone />} label="Phone" value={teacher?.phone || 'N/A'} />
                <InfoItem icon={<FaChalkboardTeacher />} label="Department" value={teacher?.department || 'N/A'} />
                <InfoItem icon={<FaChalkboardTeacher />} label="Designation" value={teacher?.designation || 'N/A'} />
                <InfoItem icon={<FaBook />} label="Username" value={teacher?.username || 'N/A'} />
              </div>
            )}
          </div>

          {/* Teaching Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard title="Assigned Courses" value={teacher?.assignedCourse?.length || 0} color="sky-blue" />
            <StatCard title="Assigned Subjects" value={teacher?.assignedSubjects?.length || 0} color="navy" />
            <StatCard title="Total Assignments" value={assignments.length} color="sky-blue" />
            <StatCard title="Study Materials" value={materials.length} color="navy" />
          </div>

          {/* Assigned Courses */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
              <FaBook className="mr-3 text-sky-blue" />
              Assigned Courses
            </h2>
            {teacher?.assignedCourse?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacher.assignedCourse.map((course, index) => (
                  <div key={index} className="p-4 bg-sky-blue/10 rounded-lg border-l-4 border-sky-blue">
                    <p className="font-bold text-navy text-lg">{course.courseName}</p>
                    <p className="text-sm font-semibold text-text-grey">Code: {course.courseCode}</p>
                    <p className="text-sm font-medium text-text-grey">Duration: {course.courseDuration}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-grey text-center py-4 font-semibold">No courses assigned</p>
            )}
          </div>

          {/* Assigned Subjects */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
              <FaClipboardList className="mr-3 text-navy" />
              Assigned Subjects
            </h2>
            {teacher?.assignedSubjects?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teacher.assignedSubjects.map((subject, index) => (
                  <div key={index} className="p-4 bg-navy/10 rounded-lg border-l-4 border-navy">
                    <p className="font-bold text-navy">{subject.subjectName}</p>
                    <p className="text-sm font-semibold text-text-grey">Code: {subject.subjectCode}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-grey text-center py-4 font-semibold">No subjects assigned</p>
            )}
          </div>

          {/* Recent Assignments */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
              <FaTasks className="mr-3 text-sky-blue" />
              Recent Assignments
            </h2>
            {assignments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-text-grey uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-text-grey uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-text-grey uppercase">Deadline</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-text-grey uppercase">Submissions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.slice(0, 5).map((assignment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-navy">{assignment.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-text-grey">{assignment.subjectId?.subjectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-text-grey">
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-sky-blue/10 text-sky-blue rounded-full text-sm font-bold">
                            {assignment.submittedCount || 0}/{assignment.totalStudents || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-text-grey text-center py-4 font-semibold">No assignments created yet</p>
            )}
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
              <FaBell className="mr-3 text-navy" />
              Recent Notices
            </h2>
            {notices.length > 0 ? (
              <div className="space-y-4">
                {notices.slice(0, 5).map((notice, index) => (
                  <div key={index} className="p-4 bg-navy/10 rounded-lg border-l-4 border-navy">
                    <p className="font-bold text-navy text-lg">{notice.title}</p>
                    <p className="text-sm font-semibold text-text-grey mt-2">{notice.description}</p>
                    <p className="text-xs font-medium text-text-grey/70 mt-2">
                      Posted: {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-grey text-center py-4 font-semibold">No notices posted yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
    <div className="text-sky-blue text-xl">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-text-grey">{label}</p>
      <p className="text-lg font-bold text-navy">{value || 'N/A'}</p>
    </div>
  </div>
);

const StatCard = ({ title, value, color }) => {
  const borderColor = color === 'sky-blue' ? 'border-sky-blue' : 'border-navy';
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor}`}>
      <p className="text-sm font-semibold text-text-grey mb-2">{title}</p>
      <p className="text-3xl font-extrabold text-navy">{value}</p>
    </div>
  );
};

export default TeacherProfile;
