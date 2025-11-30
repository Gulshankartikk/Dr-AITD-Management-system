import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import {
  FaClipboardList, FaFileAlt, FaDollarSign, FaChartBar, FaCalendarAlt,
  FaBell, FaCheckCircle, FaClock, FaDownload, FaArrowRight, FaUserGraduate, FaUniversity
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
    { title: 'Attendance', value: `${attendanceStats.percentage}%`, icon: FaClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { title: 'Assignments', value: `${assignments.filter(a => a.submissions?.some(s => s.studentId === studentId)).length}/${assignments.length}`, icon: FaFileAlt, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { title: 'Pending Fees', value: fees.reduce((acc, fee) => acc + (fee.status !== 'Paid' ? fee.amount : 0), 0) > 0 ? 'Due' : 'Clear', icon: FaDollarSign, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' }
  ];

  const getDayName = (dateStr) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  const todayDay = getDayName(new Date());
  const todaysSchedule = timetable.filter(t => t.day === todayDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50/50 min-h-screen">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FaUserGraduate size={24} className="text-blue-100" />
              </div>
              <span className="px-3 py-1 bg-blue-500/30 rounded-full text-xs font-medium border border-blue-400/30">
                Student Portal
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {student?.name}</h1>
            <p className="text-blue-100 text-lg flex items-center gap-2">
              <FaUniversity className="opacity-70" />
              {student?.courseId?.courseName || 'Course Not Assigned'} • {student?.rollNo}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">Today is</p>
            <p className="text-2xl font-bold">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className={`border shadow-sm hover:shadow-md transition-all duration-300 ${card.bg}`}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{card.title}</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">{card.value}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-white shadow-sm ring-1 ring-black/5`}>
                <card.icon className={`text-3xl ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Attendance Chart */}
          <Card className="border-none shadow-lg ring-1 ring-gray-100">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FaChartBar />
                </div>
                Subject-wise Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {attendanceStats.subjectWise.length > 0 ? attendanceStats.subjectWise.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-700">{subject.name}</span>
                      <span className={subject.status === 'good' ? 'text-emerald-600' : 'text-amber-600'}>
                        {subject.attendance}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${subject.status === 'good' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'}`}
                        style={{ width: subject.attendance }}
                      ></div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No attendance records found yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card className="border-none shadow-lg ring-1 ring-gray-100">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <FaFileAlt />
                </div>
                Recent Assignments
              </CardTitle>
              <Link to={`/student/${studentId}/assignments`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment, index) => {
                  const isSubmitted = assignment.submissions?.some(s => s.studentId === studentId);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-100 hover:shadow-md transition-all group">
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-bold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">{assignment.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{assignment.subjectId?.subjectName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaClock size={12} className="text-gray-400" />
                          <p className="text-xs text-gray-400">Due: {new Date(assignment.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={isSubmitted ? 'success' : 'warning'} className="px-3 py-1">
                          {isSubmitted ? 'Submitted' : 'Pending'}
                        </Badge>
                        {assignment.fileUrl && (
                          <button
                            onClick={() => window.open(assignment.fileUrl, '_blank')}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Download Attachment"
                          >
                            <FaDownload />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {assignments.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No assignments due right now.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Timetable */}
          <Card className="border-none shadow-lg ring-1 ring-gray-100">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <FaCalendarAlt />
                </div>
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {todaysSchedule.length > 0 ? todaysSchedule.map((slot, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                    <div className="bg-white text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap border border-orange-100">
                      {slot.timeSlot}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{slot.subjectId?.subjectName}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                        Room: {slot.roomNo || 'N/A'}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No classes scheduled for today.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-none shadow-lg ring-1 ring-gray-100">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-red-50 rounded-lg text-red-600">
                  <FaBell />
                </div>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {notices.slice(0, 5).map((notif, index) => (
                  <div key={index} className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="mt-1.5 min-w-[10px] h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">{notif.description}</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {notices.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No new notifications.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl shadow-blue-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                ⚡ Quick Actions
              </h3>
              <div className="space-y-4">
                <Link to={`/student/${studentId}/fees`}>
                  <Button variant="secondary" className="w-full justify-between bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all">
                    <span className="font-medium">Pay Fees</span>
                    <FaArrowRight size={14} />
                  </Button>
                </Link>
                <Link to={`/student/${studentId}/marks`}>
                  <Button variant="secondary" className="w-full justify-between bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all">
                    <span className="font-medium">View Results</span>
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
