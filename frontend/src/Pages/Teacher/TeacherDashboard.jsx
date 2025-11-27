// --- FULL FIXED CODE BELOW ---
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import {
  FaUsers,
  FaClipboardList,
  FaStickyNote,
  FaBell,
  FaChartBar,
  FaCalendarAlt,
  FaPlus,
  FaUser
} from 'react-icons/fa';
import { MdAssignment, MdNotifications } from 'react-icons/md';
import Cookies from 'js-cookie';
import LoadingSpinner from '../../components/LoadingSpinner';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';

import { AttendanceModal, AssignmentModal, NoticeModal, MaterialModal } from '../../components/TeacherModals';

const TeacherDashboard = () => {
  const { id: teacherId } = useParams();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // ===================== FETCH DASHBOARD =====================
  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${BASE_URL}/api/teacher/${teacherId}/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );

      setDashboardData(response.data);
      setError('');
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) fetchDashboardData();
  }, [teacherId]);

  if (loading) return <LoadingSpinner message="Loading teacher dashboard..." />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );

  const { teacher, assignments = [] } = dashboardData || {};

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      <TeacherHeader currentRole="teacher" />

      <div className="p-6">
        
        {/* HEADER */}
        <BackButton className="mb-4" />

        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg mb-2">
          Welcome, {teacher?.name}!
        </h1>
        <p className="font-semibold text-lg" style={{ color: '#e1b382' }}>
          Department: {teacher?.department || 'Not specified'} | Designation:{' '}
          {teacher?.designation || 'Teacher'}
        </p>

        {/* ===================== STATS CARDS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
          <DashboardCard
            title="Assigned Courses"
            value={teacher?.assignedCourse?.length || 0}
            icon={<FaUsers size={24} />}
            color="blue"
          />

          <DashboardCard
            title="Subjects"
            value={teacher?.assignedSubjects?.length || 0}
            icon={<FaStickyNote size={24} />}
            color="green"
          />

          <DashboardCard
            title="Assignments"
            value={assignments?.length || 0}
            icon={<MdAssignment size={24} />}
            color="yellow"
          />

          <DashboardCard
            title="Today's Classes"
            value={0}
            icon={<FaCalendarAlt size={24} />}
            color="purple"
          />
        </div>

        {/* ===================== QUICK ACTIONS ===================== */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8" style={{ borderTop: '4px solid #e1b382' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#2d545e' }}>Quick Actions</h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

            <QuickAction
              label="My Profile"
              icon={<FaUser className="text-blue-500 mb-2" size={24} />}
              onClick={() => navigate(`/teacher/${teacherId}/profile`)}
            />

            <QuickAction
              label="View All Students"
              icon={<FaUsers className="text-indigo-500 mb-2" size={24} />}
              onClick={() => navigate(`/teacher/${teacherId}/students`)}
            />

            <QuickAction
              label="Mark Attendance"
              icon={<FaClipboardList className="text-blue-500 mb-2" size={24} />}
              onClick={() => setShowAttendanceModal(true)}
            />

            <QuickAction
              label="Add Assignment"
              icon={<FaPlus className="text-green-500 mb-2" size={24} />}
              onClick={() => setShowAssignmentModal(true)}
            />

            <QuickAction
              label="Post Notice"
              icon={<MdNotifications className="text-purple-500 mb-2" size={24} />}
              onClick={() => setShowNoticeModal(true)}
            />

            <QuickAction
              label="Upload Material"
              icon={<FaStickyNote className="text-orange-500 mb-2" size={24} />}
              onClick={() => setShowMaterialModal(true)}
            />
          </div>
        </div>

        {/* ===================== ASSIGNED COURSES ===================== */}
        <SectionCard
          title="Assigned Courses"
          icon={<FaUsers className="text-blue-500" size={20} />}
        >
          {teacher?.assignedCourse?.length > 0 ? (
            teacher.assignedCourse.map((course, index) => (
              <ListItem
                key={index}
                color="blue"
                title={course.courseName}
                subtitle={`Code: ${course.courseCode}`}
                extra={`Duration: ${course.courseDuration}`}
              />
            ))
          ) : (
            <Empty message="No courses assigned" />
          )}
        </SectionCard>

        {/* ===================== ASSIGNED SUBJECTS ===================== */}
        <SectionCard
          title="Assigned Subjects"
          icon={<FaStickyNote className="text-green-500" size={20} />}
        >
          {teacher?.assignedSubjects?.length > 0 ? (
            teacher.assignedSubjects.map((subject, index) => (
              <ListItem
                key={index}
                color="green"
                title={subject.subjectName}
                subtitle={`Code: ${subject.subjectCode}`}
              />
            ))
          ) : (
            <Empty message="No subjects assigned" />
          )}
        </SectionCard>

        {/* ===================== RECENT ASSIGNMENTS ===================== */}
        <SectionCard
          title="Recent Assignments"
          icon={<MdAssignment className="text-purple-500" size={20} />}
        >
          {assignments.length > 0 ? (
            assignments.map((a, i) => (
              <ListItem
                key={i}
                color="purple"
                title={a.title}
                subtitle={a.subjectName}
                extra={`Due: ${a.dueDate}`}
              />
            ))
          ) : (
            <Empty message="No recent assignments" />
          )}
        </SectionCard>

      </div>

      {/* ===================== MODALS ===================== */}
      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        teacherId={teacherId}
      />
      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        teacherId={teacherId}
      />
      <NoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        teacherId={teacherId}
      />
      <MaterialModal
        isOpen={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        teacherId={teacherId}
      />

    </div>
  );
};

export default TeacherDashboard;

// =================================================================
// REUSABLE COMPONENTS
// =================================================================

const DashboardCard = ({ title, value, icon, color }) => {
  const colors = { blue: '#2d545e', green: '#e1b382', yellow: '#c89666', purple: '#12343b' };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6" style={{ borderLeft: `4px solid ${colors[color]}` }}>
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: `${colors[color]}20`, color: colors[color] }}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-semibold" style={{ color: '#2d545e' }}>{title}</p>
          <p className="text-2xl font-extrabold" style={{ color: '#12343b' }}>{value}</p>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center p-4 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
    style={{ backgroundColor: '#e1b38220' }}
  >
    {icon}
    <span className="text-sm font-bold" style={{ color: '#2d545e' }}>{label}</span>
  </button>
);

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-xl p-6 mb-8" style={{ borderTop: '4px solid #c89666' }}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold" style={{ color: '#2d545e' }}>{title}</h2>
      {icon}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const ListItem = ({ title, subtitle, extra, color }) => {
  const colors = { blue: '#2d545e', green: '#e1b382', purple: '#c89666' };
  return (
    <div className="pl-4 py-2" style={{ borderLeft: `4px solid ${colors[color]}` }}>
      <p className="font-bold" style={{ color: '#12343b' }}>{title}</p>
      <p className="text-sm font-semibold" style={{ color: '#2d545e' }}>{subtitle}</p>
      {extra && <p className="text-xs font-medium" style={{ color: '#c89666' }}>{extra}</p>}
    </div>
  );
};

const Empty = ({ message }) => (
  <p classcommon="text-gray-500 text-center py-4">{message}</p>
);
