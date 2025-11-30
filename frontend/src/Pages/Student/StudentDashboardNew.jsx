import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import {
  User, BookOpen, Calendar, FileText, Bell, Award,
  LogOut, Menu, X, ChevronRight, Download, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-soft-grey overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = "primary" }) => {
  const styles = {
    primary: "bg-sky-blue/10 text-sky-blue",
    success: "bg-sky-blue/10 text-sky-blue",
    warning: "bg-navy/10 text-navy",
    danger: "bg-red-100 text-red-700",
    neutral: "bg-soft-grey/20 text-text-grey",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || styles.neutral}`}>
      {children}
    </span>
  );
};

const StudentDashboardNew = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data States
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Parallel data fetching
        const [
          profileRes,
          attendanceRes,
          assignmentsRes,
          noticesRes,
          subjectsRes,
          marksRes,
          materialsRes
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/student/${studentId}/profile`, { headers }),
          axios.get(`${BASE_URL}/api/student/${studentId}/attendance`, { headers }),
          axios.get(`${BASE_URL}/api/student/${studentId}/assignments`, { headers }),
          axios.get(`${BASE_URL}/api/student/${studentId}/notices`, { headers }),
          axios.get(`${BASE_URL}/api/student/${studentId}/subjects`, { headers }),
          axios.get(`${BASE_URL}/api/student/${studentId}/marks`, { headers }),
          axios.get(`${BASE_URL}/api/student/${studentId}/materials`, { headers })
        ]);

        setStudent(profileRes.data.student);
        setAttendance(attendanceRes.data.attendance || []);
        setAssignments(assignmentsRes.data.assignments || []);
        setNotices(noticesRes.data.notices || []);
        setSubjects(subjectsRes.data.subjects || []);
        setMarks(marksRes.data.marks || []);
        setMaterials(materialsRes.data.materials || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, navigate]);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-blue"></div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <User size={20} /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText size={20} /> },
    { id: 'attendance', label: 'Attendance', icon: <Calendar size={20} /> },
    { id: 'materials', label: 'Study Materials', icon: <BookOpen size={20} /> },
    { id: 'marks', label: 'Grades & Marks', icon: <Award size={20} /> },
    { id: 'notices', label: 'Announcements', icon: <Bell size={20} /> },
  ];

  // --- Tab Components ---

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy to-sky-blue rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <User size={150} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {student?.name}!</h1>
          <p className="text-sky-blue/20 text-lg mb-6">
            Roll No: <span className="font-mono font-semibold bg-white/20 px-2 py-1 rounded">{student?.rollNo}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sky-blue/80 text-sm">Course</p>
              <p className="font-semibold text-lg">{student?.courseId?.courseName || 'N/A'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sky-blue/80 text-sm">Email</p>
              <p className="font-semibold text-lg truncate">{student?.email}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sky-blue/80 text-sm">Phone</p>
              <p className="font-semibold text-lg">{student?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-sky-blue">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-grey text-sm font-medium">Pending Assignments</p>
              <h3 className="text-3xl font-bold text-navy mt-2">
                {assignments.filter(a => !a.submitted).length}
              </h3>
            </div>
            <div className="p-3 bg-sky-blue/10 rounded-lg text-sky-blue">
              <FileText size={24} />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-sky-blue">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-grey text-sm font-medium">Attendance</p>
              <h3 className="text-3xl font-bold text-navy mt-2">
                {attendance.length > 0
                  ? `${Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100)}%`
                  : 'N/A'}
              </h3>
            </div>
            <div className="p-3 bg-sky-blue/10 rounded-lg text-sky-blue">
              <CheckCircle size={24} />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-navy">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-grey text-sm font-medium">New Notices</p>
              <h3 className="text-3xl font-bold text-navy mt-2">{notices.length}</h3>
            </div>
            <div className="p-3 bg-navy/10 rounded-lg text-navy">
              <Bell size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity / Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
            <Bell className="mr-2 text-sky-blue" size={20} /> Recent Announcements
          </h3>
          <div className="space-y-4">
            {notices.slice(0, 3).map((notice) => (
              <div key={notice._id} className="p-4 bg-background rounded-lg border border-soft-grey hover:bg-sky-blue/5 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-navy">{notice.title}</h4>
                  <span className="text-xs text-text-grey">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-text-grey line-clamp-2">{notice.description}</p>
              </div>
            ))}
            {notices.length === 0 && <p className="text-gray-500 text-center py-4">No new announcements.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
            <Clock className="mr-2 text-sky-blue" size={20} /> Upcoming Deadlines
          </h3>
          <div className="space-y-4">
            {assignments.filter(a => !a.submitted).slice(0, 3).map((assignment) => (
              <div key={assignment._id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-soft-grey">
                <div>
                  <h4 className="font-semibold text-navy">{assignment.title}</h4>
                  <p className="text-xs text-red-500 font-medium mt-1">
                    Due: {new Date(assignment.deadline).toLocaleDateString()}
                  </p>
                </div>
                <Badge type="warning">Pending</Badge>
              </div>
            ))}
            {assignments.filter(a => !a.submitted).length === 0 && (
              <p className="text-gray-500 text-center py-4">No pending assignments!</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const AssignmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy">Assignments</h2>
      </div>
      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment._id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-navy">{assignment.title}</h3>
                  <Badge type={assignment.submitted ? "success" : "warning"}>
                    {assignment.submitted ? "Submitted" : "Pending"}
                  </Badge>
                </div>
                <p className="text-text-grey mb-2">{assignment.description}</p>
                <div className="flex items-center gap-4 text-sm text-text-grey">
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} /> {assignment.subjectId?.subjectName || 'Subject'}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <Clock size={14} /> Due: {new Date(assignment.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                {assignment.fileUrl && (
                  <a
                    href={assignment.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-blue bg-sky-blue/10 rounded-lg hover:bg-sky-blue/20"
                  >
                    <Download size={16} /> Resource
                  </a>
                )}
                {!assignment.submitted && (
                  <button className="px-4 py-2 text-sm font-medium text-white bg-sky-blue rounded-lg hover:bg-sky-blue/90">
                    Submit Work
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {assignments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-soft-grey">
            <FileText className="mx-auto h-12 w-12 text-text-grey/50" />
            <h3 className="mt-2 text-sm font-medium text-navy">No assignments</h3>
            <p className="mt-1 text-sm text-text-grey">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );

  const AttendanceTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">Attendance Record</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Stats */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="flex items-center justify-center py-6">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0EA5E9"
                  strokeWidth="3"
                  strokeDasharray={`${(attendance.filter(a => a.status === 'Present').length / attendance.length) * 100 || 0}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-navy">
                  {attendance.length > 0
                    ? Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100)
                    : 0}%
                </span>
                <span className="text-xs text-text-grey">Present</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-grey">Total Classes</span>
              <span className="font-medium">{attendance.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sky-blue">Present</span>
              <span className="font-medium">{attendance.filter(a => a.status === 'Present').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-500">Absent</span>
              <span className="font-medium">{attendance.filter(a => a.status === 'Absent').length}</span>
            </div>
          </div>
        </Card>

        {/* Detailed List */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="px-6 py-4 border-b border-soft-grey bg-background">
            <h3 className="font-semibold text-navy">Recent Records</h3>
          </div>
          <div className="divide-y divide-soft-grey max-h-[500px] overflow-y-auto">
            {attendance.map((record) => (
              <div key={record._id} className="p-4 flex items-center justify-between hover:bg-background">
                <div>
                  <p className="font-medium text-navy">{record.subjectId?.subjectName || 'Unknown Subject'}</p>
                  <p className="text-xs text-text-grey">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <Badge type={record.status === 'Present' ? 'success' : 'danger'}>
                  {record.status}
                </Badge>
              </div>
            ))}
            {attendance.length === 0 && (
              <p className="text-center py-8 text-text-grey">No attendance records found.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const MarksTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">Grades & Marks</h2>
      <div className="grid gap-4">
        {marks.map((mark) => (
          <Card key={mark._id} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-navy">{mark.subjectId?.subjectName}</h3>
                <p className="text-sm text-text-grey">{mark.examType}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-sky-blue">{mark.marks}</span>
                <span className="text-text-grey text-sm"> / {mark.totalMarks}</span>
              </div>
            </div>
            <div className="w-full bg-soft-grey/30 rounded-full h-2.5">
              <div
                className="bg-sky-blue h-2.5 rounded-full"
                style={{ width: `${(mark.marks / mark.totalMarks) * 100}%` }}
              ></div>
            </div>
          </Card>
        ))}
        {marks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-soft-grey">
            <Award className="mx-auto h-12 w-12 text-text-grey/50" />
            <h3 className="mt-2 text-sm font-medium text-navy">No grades yet</h3>
            <p className="mt-1 text-sm text-text-grey">Check back after exams!</p>
          </div>
        )}
      </div>
    </div>
  );

  const MaterialsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">Study Materials</h2>
      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material._id} className="p-6 flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-sky-blue/10 text-sky-blue rounded-lg">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-bold text-navy">{material.title}</h3>
                <p className="text-sm text-text-grey">{material.description}</p>
                <p className="text-xs text-text-grey/70 mt-1">
                  {material.subjectId?.subjectName} • {new Date(material.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {material.fileUrl && (
              <a
                href={material.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-text-grey hover:text-sky-blue transition-colors"
              >
                <Download size={20} />
              </a>
            )}
          </Card>
        ))}
        {materials.length === 0 && (
          <p className="text-center text-text-grey py-8">No study materials available.</p>
        )}
      </div>
    </div>
  );

  const NoticesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">Announcements</h2>
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice._id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-navy/10 text-navy rounded-full mt-1">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="font-bold text-navy text-lg">{notice.title}</h3>
                <p className="text-xs text-text-grey mb-2">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </p>
                <p className="text-text-grey leading-relaxed">{notice.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-soft-grey transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-soft-grey flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-blue font-bold text-xl">
              <GraduationCap size={28} />
              <span>StudentPortal</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-text-grey">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id
                  ? 'bg-sky-blue/10 text-sky-blue'
                  : 'text-text-grey hover:bg-background hover:text-navy'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-soft-grey">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-soft-grey lg:hidden p-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="text-text-grey">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-navy">Student Portal</span>
          <div className="w-8"></div> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'assignments' && <AssignmentsTab />}
            {activeTab === 'attendance' && <AttendanceTab />}
            {activeTab === 'marks' && <MarksTab />}
            {activeTab === 'materials' && <MaterialsTab />}
            {activeTab === 'notices' && <NoticesTab />}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Helper Icon Component (since GraduationCap was missing in imports above)
const GraduationCap = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export default StudentDashboardNew;
