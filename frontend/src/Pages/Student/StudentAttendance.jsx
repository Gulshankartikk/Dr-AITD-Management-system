import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { FaClipboardList, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';

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
      <div className="min-h-screen bg-background">
        <StudentHeader studentId={studentId} studentName={studentName} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader studentId={studentId} studentName={studentName} />
      <BackButton />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 mb-6">
            <FaClipboardList className="text-3xl text-sky-blue" />
            <h1 className="text-3xl font-bold text-navy">My Attendance</h1>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-text-grey mb-2">Overall Attendance</h3>
              <div className="text-3xl font-bold text-sky-blue">{stats.overall?.percentage}%</div>
              <p className="text-text-grey">{stats.overall?.present}/{stats.overall?.total} classes</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-text-grey mb-2">Present Days</h3>
              <div className="text-3xl font-bold text-sky-blue">{stats.overall?.present}</div>
              <p className="text-text-grey">Total present</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-text-grey mb-2">Total Classes</h3>
              <div className="text-3xl font-bold text-text-grey">{stats.overall?.total}</div>
              <p className="text-text-grey">Classes attended</p>
            </div>
          </div>

          {/* Subject-wise Stats */}
          {Object.keys(stats.subjects || {}).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-navy mb-4">Subject-wise Attendance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.subjects).map(([subject, data]) => (
                  <div key={subject} className="border rounded-lg p-4">
                    <h3 className="font-medium text-navy mb-2">{subject}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-sky-blue">{data.percentage}%</span>
                      <span className="text-text-grey">{data.present}/{data.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Records */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-navy mb-4">Attendance Records</h2>

            {attendance.length === 0 ? (
              <div className="text-center py-8">
                <FaClipboardList className="mx-auto text-6xl text-soft-grey mb-4" />
                <p className="text-text-grey text-lg">No attendance records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-grey">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-grey">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-grey">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-grey">Teacher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-grey">
                    {attendance.map((record) => (
                      <tr key={record._id} className="hover:bg-background">
                        <td className="px-4 py-3 text-sm text-navy">
                          <div className="flex items-center space-x-1">
                            <FaCalendarAlt className="text-text-grey/50" />
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-navy">
                          {record.subjectId?.subjectName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${record.status === 'Present'
                            ? 'bg-sky-blue/10 text-sky-blue'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {record.status === 'Present' ? <FaCheck /> : <FaTimes />}
                            <span>{record.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-navy">
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
      </div >
    </div >
  );
};

export default StudentAttendance;
