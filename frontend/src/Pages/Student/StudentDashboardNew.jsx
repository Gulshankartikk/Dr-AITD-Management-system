import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import {
  FaClipboardList, FaFileAlt, FaDollarSign, FaChartBar, FaCalendarAlt,
  FaBell, FaCheckCircle, FaClock, FaDownload, FaArrowRight
} from 'react-icons/fa';
import Cookies from 'js-cookie';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const StudentDashboardNew = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceStats, setAttendanceStats] = useState({ percentage: 0, subjectWise: [] });
  const [assignments, setAssignments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Student Profile & Dashboard Data
        const dashboardRes = await axios.get(`${BASE_URL}/api/student/${studentId}/dashboard`, { headers });
        setStudent(dashboardRes.data.student);

        // 2. Fetch Attendance
        const attendanceRes = await axios.get(`${BASE_URL}/api/student/${studentId}/attendance`, { headers });
        if (attendanceRes.data.success) {
          const { stats, attendance } = attendanceRes.data;

          // Calculate subject-wise attendance
          const subjectMap = {};
          attendance.forEach(record => {
            const subName = record.subjectId?.subjectName || 'Unknown';
            if (!subjectMap[subName]) subjectMap[subName] = { total: 0, present: 0 };
            subjectMap[subName].total++;
            if (record.status === 'Present') subjectMap[subName].present++;
          });

          const subjectWise = Object.keys(subjectMap).map(sub => ({
            name: sub,
            attendance: subjectMap[sub].total > 0
              ? ((subjectMap[sub].present / subjectMap[sub].total) * 100).toFixed(0) + '%'
              : '0%',
            status: (subjectMap[sub].present / subjectMap[sub].total) >= 0.75 ? 'good' : 'warning'
          }));

          setAttendanceStats({
            percentage: stats.attendancePercentage,
            subjectWise
          });
        }

        // 3. Fetch Assignments
        const assignmentsRes = await axios.get(`${BASE_URL}/api/student/${studentId}/assignments`, { headers });
        setAssignments(assignmentsRes.data.assignments || []);

        // 4. Fetch Notices
        const noticesRes = await axios.get(`${BASE_URL}/api/student/${studentId}/notices`, { headers });
        setNotices(noticesRes.data.notices || []);

        // 5. Fetch Timetable
        const timetableRes = await axios.get(`${BASE_URL}/api/student/${studentId}/timetable`, { headers });
        setTimetable(timetableRes.data.timetable || []);

        // 6. Fetch Fees
        const feesRes = await axios.get(`${BASE_URL}/api/student/${studentId}/fees`, { headers });
        setFees(feesRes.data.fees || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // Derived Data for UI
  const summaryCards = [
    { title: 'Attendance', value: `${attendanceStats.percentage}%`, icon: FaClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Assignments', value: `${assignments.filter(a => a.submissions?.some(s => s.studentId === studentId)).length}/${assignments.length}`, icon: FaFileAlt, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Fees', value: fees.reduce((acc, fee) => acc + (fee.status !== 'Paid' ? fee.amount : 0), 0) > 0 ? 'Due' : 'Clear', icon: FaDollarSign, color: 'text-amber-600', bg: 'bg-amber-100' }
  ];

  const getDayName = (dateStr) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  const todayDay = getDayName(new Date());
  const todaysSchedule = timetable.filter(t => t.day === todayDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {student?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${card.bg}`}>
                <card.icon className={`text-2xl ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FaChartBar className="text-blue-600" />
                Subject-wise Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceStats.subjectWise.length > 0 ? attendanceStats.subjectWise.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-700">{subject.name}</span>
                      <span className={subject.status === 'good' ? 'text-emerald-600' : 'text-amber-600'}>
                        {subject.attendance}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${subject.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: subject.attendance }}
                      ></div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No attendance records found.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FaFileAlt className="text-blue-600" />
                Recent Assignments
              </CardTitle>
              <Link to={`/student/${studentId}/assignments`} className="text-sm text-blue-600 hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment, index) => {
                  const isSubmitted = assignment.submissions?.some(s => s.studentId === studentId);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-semibold text-gray-900 truncate">{assignment.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{assignment.subjectId?.subjectName}</p>
                        <p className="text-xs text-gray-400 mt-1">Due: {new Date(assignment.deadline).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={isSubmitted ? 'success' : 'warning'}>
                          {isSubmitted ? 'Submitted' : 'Pending'}
                        </Badge>
                        {assignment.fileUrl && (
                          <button
                            onClick={() => window.open(assignment.fileUrl, '_blank')}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Download Attachment"
                          >
                            <FaDownload />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {assignments.length === 0 && <p className="text-gray-500 text-center py-4">No assignments available.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Timetable */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysSchedule.length > 0 ? todaysSchedule.map((slot, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                    <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                      {slot.timeSlot}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{slot.subjectId?.subjectName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Room: {slot.roomNo || 'N/A'}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No classes today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaBell className="text-blue-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notices.slice(0, 5).map((notif, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-1 min-w-[8px] h-2 w-2 rounded-full bg-blue-500"></div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{notif.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {notices.length === 0 && <p className="text-gray-500 text-center py-4 text-sm">No new notifications.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
            <CardContent>
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to={`/student/${studentId}/fees`}>
                  <Button variant="secondary" className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 mb-3">
                    <span>Pay Fees</span>
                    <FaArrowRight size={14} />
                  </Button>
                </Link>
                <Link to={`/student/${studentId}/marks`}>
                  <Button variant="secondary" className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <span>View Results</span>
                    <FaArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardNew;
