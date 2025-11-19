import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../services/api';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaGraduationCap, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';

const StudentProfile = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchStudentProfile();
    fetchAttendance();
    fetchMarks();
    fetchAssignments();
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(response.data.student);
      setEditData({ name: response.data.student?.name || '', email: response.data.student?.email || '', phone: response.data.student?.phone || '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({ name: student?.name || '', email: student?.email || '', phone: student?.phone || '' });
    }
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put(`${BASE_URL}/api/student/${studentId}/profile`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent({ ...student, ...editData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data.attendanceBySubject || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchMarks = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/marks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMarks(response.data.marks || []);
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
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

  const overallAttendance = attendance.length > 0
    ? (attendance.reduce((sum, s) => sum + parseFloat(s.percentage || 0), 0) / attendance.length).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader studentId={studentId} studentName={student?.name} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton />
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Student Profile</h1>
            <button
              onClick={handleEditToggle}
              className="px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: isEditing ? '#c89666' : '#2d545e', color: 'white' }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaUser className="mr-3 text-blue-500" />
              Personal Information
            </h2>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2 text-sm" style={{ color: '#2d545e' }}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#e1b382' }}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-sm" style={{ color: '#2d545e' }}>Roll Number</label>
                  <input
                    type="text"
                    value={student?.rollNo}
                    disabled
                    className="w-full py-3 px-4 rounded-lg border-2 bg-gray-100"
                    style={{ borderColor: '#e1b382' }}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-sm" style={{ color: '#2d545e' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#e1b382' }}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-sm" style={{ color: '#2d545e' }}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#e1b382' }}
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={handleSaveProfile}
                    className="w-full py-3 px-6 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                    style={{ backgroundColor: '#2d545e', color: 'white' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={<FaUser />} label="Full Name" value={student?.name} />
                <InfoItem icon={<FaIdCard />} label="Roll Number" value={student?.rollNo} />
                <InfoItem icon={<FaEnvelope />} label="Email" value={student?.email} />
                <InfoItem icon={<FaPhone />} label="Phone" value={student?.phone || 'N/A'} />
                <InfoItem icon={<FaGraduationCap />} label="Course" value={student?.courseId?.courseName} />
                <InfoItem icon={<FaCalendarAlt />} label="Joined" value={new Date(student?.createdAt).toLocaleDateString()} />
              </div>
            )}
          </div>

          {/* Academic Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard title="Overall Attendance" value={`${overallAttendance}%`} color="blue" />
            <StatCard title="Total Subjects" value={attendance.length} color="green" />
            <StatCard title="Assignments Submitted" value={assignments.filter(a => a.submissions?.some(s => s.studentId === studentId)).length} color="purple" />
          </div>

          {/* Attendance Record */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaChartLine className="mr-3 text-green-500" />
              Attendance Record
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Total Classes</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Present</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Absent</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Percentage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{record.subjectName}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{record.totalClasses}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">{record.present}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-red-600">{record.absent}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          parseFloat(record.percentage) >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marks Record */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Performance</h2>
            {marks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Exam Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Marks Obtained</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Total Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {marks.map((mark, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{mark.subjectId?.subjectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{mark.examType}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">{mark.marks}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{mark.totalMarks}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                          {((mark.marks / mark.totalMarks) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-semibold">No marks recorded yet</p>
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

export default StudentProfile;
