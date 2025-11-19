import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../services/api';
import Cookies from 'js-cookie';
import { FaClipboardList, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StudentHeader from '../../components/StudentHeader';

const StudentAttendance = () => {
  const { studentId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchAttendance();
  }, [studentId]);

  const fetchAttendance = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/attendance`, { headers });
      setAttendance(response.data.attendance || []);
      setStudentName(response.data.student?.name || '');
      calculateStats(response.data.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (attendanceData) => {
    const subjectStats = {};
    let totalPresent = 0;
    let totalClasses = attendanceData.length;

    attendanceData.forEach(record => {
      const subjectName = record.subjectId?.subjectName || 'Unknown';
      
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = { present: 0, total: 0 };
      }
      
      subjectStats[subjectName].total++;
      if (record.status === 'Present') {
        subjectStats[subjectName].present++;
        totalPresent++;
      }
    });

    // Calculate percentages
    Object.keys(subjectStats).forEach(subject => {
      const stats = subjectStats[subject];
      stats.percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;
    });

    const overallPercentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : 0;

    setStats({
      subjects: subjectStats,
      overall: {
        present: totalPresent,
        total: totalClasses,
        percentage: overallPercentage
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader studentId={studentId} studentName={studentName} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader studentId={studentId} studentName={studentName} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 mb-6">
            <FaClipboardList className="text-3xl text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Attendance</h3>
              <div className="text-3xl font-bold text-blue-600">{stats.overall?.percentage}%</div>
              <p className="text-gray-500">{stats.overall?.present}/{stats.overall?.total} classes</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Present Days</h3>
              <div className="text-3xl font-bold text-green-600">{stats.overall?.present}</div>
              <p className="text-gray-500">Total present</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Classes</h3>
              <div className="text-3xl font-bold text-gray-600">{stats.overall?.total}</div>
              <p className="text-gray-500">Classes attended</p>
            </div>
          </div>

          {/* Subject-wise Stats */}
          {Object.keys(stats.subjects || {}).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subject-wise Attendance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.subjects).map(([subject, data]) => (
                  <div key={subject} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">{subject}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{data.percentage}%</span>
                      <span className="text-gray-500">{data.present}/{data.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Records */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Records</h2>
            
            {attendance.length === 0 ? (
              <div className="text-center py-8">
                <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No attendance records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Teacher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendance.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {record.subjectId?.subjectName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === 'Present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status === 'Present' ? <FaCheck /> : <FaTimes />}
                            <span>{record.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {record.teacherId?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
