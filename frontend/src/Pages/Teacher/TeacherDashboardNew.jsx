import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import {
  FaUsers, FaChalkboardTeacher, FaTasks, FaClipboardCheck,
  FaBook, FaUpload, FaClipboardList, FaFileUpload, FaPaperPlane,
  FaEdit, FaChartBar, FaDownload, FaBell, FaCalendarAlt, FaArrowRight
} from 'react-icons/fa';
import Cookies from 'js-cookie';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

const TeacherDashboardNew = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Teacher Profile & Dashboard Data
      const dashboardRes = await axios.get(`${BASE_URL}/api/teacher/${id}/dashboard`, { headers });
      setTeacher(dashboardRes.data.teacher);
      setAssignedSubjects(dashboardRes.data.teacher?.assignedSubjects || []);

      // 2. Fetch Timetable
      const timetableRes = await axios.get(`${BASE_URL}/api/teacher/${id}/timetable`, { headers });
      setTimetable(timetableRes.data.timetable || []);

      // 3. Fetch Notices
      const noticesRes = await axios.get(`${BASE_URL}/api/teacher/${id}/notices`, { headers });
      setNotices(noticesRes.data.notices || []);

      // 4. Fetch Assignments
      const assignmentsRes = await axios.get(`${BASE_URL}/api/teacher/${id}/assignments`, { headers });
      setAssignments(assignmentsRes.data.assignments || []);

    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Derived Data
  const getDayName = (dateStr) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  const todayDay = getDayName(new Date());
  const todaysSchedule = timetable.filter(t => t.day === todayDay);

  const summaryCards = [
    { title: 'Assigned Subjects', value: assignedSubjects.length.toString(), icon: FaBook, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Classes Today', value: todaysSchedule.length.toString(), icon: FaChalkboardTeacher, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Assignments', value: assignments.length.toString(), icon: FaTasks, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Notices Posted', value: notices.length.toString(), icon: FaBell, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-500">Welcome back, {teacher?.name || 'Professor'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/teacher/${id}/materials`}>
            <Button variant="primary" className="flex items-center gap-2">
              <FaUpload size={14} />
              Upload Material
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          {/* Assigned Classes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FaBook className="text-indigo-600" />
                Assigned Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedSubjects.length > 0 ? assignedSubjects.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{sub.subjectName}</h4>
                      <p className="text-sm text-gray-500">Code: {sub.subjectCode}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex gap-2">
                        <Link to={`/teacher/${id}/attendance`}>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full flex items-center justify-center" title="Attendance">
                            <FaClipboardList size={14} />
                          </Button>
                        </Link>
                        <Link to={`/teacher/${id}/students`}>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full flex items-center justify-center" title="Students">
                            <FaUsers size={14} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No subjects assigned.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FaTasks className="text-indigo-600" />
                Recent Assignments
              </CardTitle>
              <Link to={`/teacher/${id}/assignments`}>
                <Button size="sm" variant="primary">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-500">{assignment.subjectId?.subjectName}</p>
                      <p className="text-xs text-gray-400 mt-1">Due: {new Date(assignment.deadline).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xl font-bold text-indigo-600">{assignment.submissions?.length || 0}</p>
                        <p className="text-xs text-gray-500">Submitted</p>
                      </div>
                    </div>
                  </div>
                ))}
                {assignments.length === 0 && <p className="text-gray-500 text-center py-4">No active assignments.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCalendarAlt className="text-indigo-600" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysSchedule.length > 0 ? todaysSchedule.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-500">
                    <div>
                      <p className="font-semibold text-gray-900">{slot.subjectId?.subjectName}</p>
                      <p className="text-sm text-gray-600">{slot.timeSlot}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="primary">{slot.courseId?.courseName}</Badge>
                      <p className="text-xs text-gray-500 mt-1">Room: {slot.roomNo || 'N/A'}</p>
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
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaBell className="text-indigo-600" />
                Your Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notices.slice(0, 5).map((notif, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-1 min-w-[8px] h-2 w-2 rounded-full bg-indigo-500"></div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{notif.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {notices.length === 0 && <p className="text-gray-500 text-center py-4 text-sm">No notices posted.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to={`/teacher/${id}/attendance`}>
                  <Button variant="secondary" className="w-full justify-start gap-3">
                    <FaClipboardList className="text-blue-500" />
                    Take Attendance
                  </Button>
                </Link>
                <Link to={`/teacher/${id}/materials`}>
                  <Button variant="secondary" className="w-full justify-start gap-3">
                    <FaFileUpload className="text-green-500" />
                    Upload Material
                  </Button>
                </Link>
                <Link to={`/teacher/${id}/notices`}>
                  <Button variant="secondary" className="w-full justify-start gap-3">
                    <FaPaperPlane className="text-purple-500" />
                    Post Notice
                  </Button>
                </Link>
                <Link to={`/teacher/${id}/marks`}>
                  <Button variant="secondary" className="w-full justify-start gap-3">
                    <FaEdit className="text-orange-500" />
                    Enter Marks
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Attendance Report', icon: FaChartBar },
                  { label: 'Performance Report', icon: FaChartBar },
                  { label: 'Assignment Report', icon: FaTasks }
                ].map((report, index) => (
                  <button key={index} className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm text-gray-700">
                    <span className="flex items-center gap-3">
                      <report.icon className="text-gray-400" />
                      {report.label}
                    </span>
                    <FaDownload className="text-gray-400" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardNew;
