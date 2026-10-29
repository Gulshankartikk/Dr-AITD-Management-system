import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  LogOut,
  X,
  CreditCard,
  Library,
  ClipboardCheck,
  Award,
  ChevronDown,
  ChevronRight,
  Shield,
  Upload,
  UserCheck
} from 'lucide-react';
import useAutoLogout from '../../hooks/useAutoLogout';

const Sidebar = ({ isOpen, onClose, userRole, userId, realRole }) => {
  const location = useLocation();
  const logout = useAutoLogout();

  // Collapsible section state
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (sectionTitle) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Helper to extract teacher/student ID from URL if not provided directly
  const getContextId = (role) => {
    if (userId) return userId;
    const parts = location.pathname.split('/');
    if (parts[1] === role && parts[2] && parts[2] !== 'dashboard') {
      return parts[2];
    }
    return '';
  };

  // Build Structured ERP Navigation Groups based on Role
  const getNavigationGroups = () => {
    if (userRole === 'admin') {
      return [
        {
          title: 'Overview',
          items: [
            { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { label: 'College Notices', path: '/admin/notices', icon: FileText },
            { label: 'Academic Timetable', path: '/admin/timetable', icon: Calendar }
          ]
        },
        {
          title: 'Academic Management',
          items: [
            { label: 'Courses & Programs', path: '/admin/courses', icon: BookOpen },
            { label: 'Subjects & Syllabus', path: '/admin/subjects', icon: Library },
            { label: 'Class Schedules', path: '/admin/timetable', icon: Calendar }
          ]
        },
        {
          title: 'Student Management',
          items: [
            { label: 'Student Directory', path: '/admin/students', icon: Users },
            { label: 'New Admission', path: '/admin/create-student', icon: UserCheck },
            { label: 'Student Achievers', path: '/achievers', icon: Award }
          ]
        },
        {
          title: 'Faculty & Staff',
          items: [
            { label: 'Faculty Directory', path: '/admin/teachers', icon: GraduationCap },
            { label: 'Add Faculty Member', path: '/admin/create-teacher', icon: UserCheck }
          ]
        },
        {
          title: 'Attendance',
          items: [
            { label: 'Student Attendance', path: '/admin/attendance', icon: ClipboardCheck },
            { label: 'Attendance Reports', path: '/admin/reports', icon: FileText }
          ]
        },
        {
          title: 'Examinations',
          items: [
            { label: 'Exam Management', path: '/admin/exams', icon: ClipboardCheck }
          ]
        },
        {
          title: 'Fees & Finance',
          items: [
            { label: 'Fee Management', path: '/admin/fees', icon: CreditCard }
          ]
        },
        {
          title: 'Library',
          items: [
            { label: 'Book Catalog', path: '/admin/library', icon: Library }
          ]
        },
        {
          title: 'Administration',
          items: [
            { label: 'Institutional Reports', path: '/admin/reports', icon: FileText },
            { label: 'System Settings', path: '/admin/settings', icon: Settings }
          ]
        }
      ];
    } else if (userRole === 'teacher') {
      const teacherId = getContextId('teacher') || userId;
      if (!teacherId) return [];

      return [
        {
          title: 'Overview',
          items: [
            { label: 'Teacher Dashboard', path: `/teacher/${teacherId}/dashboard`, icon: LayoutDashboard },
            { label: 'My Notices', path: `/teacher/${teacherId}/notices`, icon: FileText },
            { label: 'Teaching Schedule', path: `/teacher/${teacherId}/timetable`, icon: Calendar }
          ]
        },
        {
          title: 'Academic Activities',
          items: [
            { label: 'My Students', path: `/teacher/${teacherId}/students`, icon: Users },
            { label: 'Mark Attendance', path: `/teacher/${teacherId}/attendance`, icon: ClipboardCheck },
            { label: 'Assignments', path: `/teacher/${teacherId}/assignments`, icon: BookOpen },
            { label: 'Lecture Materials', path: `/teacher/${teacherId}/materials`, icon: FileText },
            { label: 'Learning Resources', path: `/teacher/${teacherId}/resources`, icon: Library },
            { label: 'Upload Content', path: `/teacher/${teacherId}/upload`, icon: Upload }
          ]
        },
        {
          title: 'Examinations & Marks',
          items: [
            { label: 'Enter Exam Marks', path: `/teacher/${teacherId}/marks`, icon: GraduationCap }
          ]
        },
        {
          title: 'Personal & Requests',
          items: [
            { label: 'Leave Applications', path: `/teacher/${teacherId}/leave`, icon: Calendar },
            { label: 'Teacher Profile', path: `/teacher/${teacherId}/profile`, icon: UserCheck }
          ]
        }
      ];
    } else if (userRole === 'student') {
      const studentId = getContextId('student') || userId;
      if (!studentId) return [];

      return [
        {
          title: 'Overview',
          items: [
            { label: 'Student Dashboard', path: `/student/${studentId}/dashboard`, icon: LayoutDashboard },
            { label: 'Campus Notices', path: `/student/${studentId}/notices`, icon: FileText },
            { label: 'Class Timetable', path: `/student/${studentId}/timetable`, icon: Calendar }
          ]
        },
        {
          title: 'Academics & Study',
          items: [
            { label: 'My Subjects', path: `/student/${studentId}/subjects`, icon: Library },
            { label: 'Lecture Notes', path: `/student/${studentId}/notes`, icon: FileText },
            { label: 'Study Materials', path: `/student/${studentId}/materials`, icon: BookOpen },
            { label: 'Assignments', path: `/student/${studentId}/assignments`, icon: FileText },
            { label: 'Learning Resources', path: `/student/${studentId}/resources`, icon: Library },
            { label: 'Library Catalog', path: `/student/${studentId}/library`, icon: Library }
          ]
        },
        {
          title: 'Performance & Dues',
          items: [
            { label: 'Attendance Record', path: `/student/${studentId}/attendance`, icon: ClipboardCheck },
            { label: 'Exam Marks & Grades', path: `/student/${studentId}/marks`, icon: GraduationCap },
            { label: 'Fee Payments', path: `/student/${studentId}/fees`, icon: CreditCard }
          ]
        },
        {
          title: 'Requests & Profile',
          items: [
            { label: 'Apply for Leave', path: `/student/${studentId}/leave`, icon: Calendar },
            { label: 'Student Profile', path: `/student/${studentId}/profile`, icon: UserCheck }
          ]
        }
      ];
    }

    return [];
  };

  const navGroups = getNavigationGroups();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-68 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-primary text-white p-2 rounded-xl shadow-xs">
              <GraduationCap size={20} />
            </div>
            <div>
              <span className="font-bold text-base text-secondary font-heading tracking-tight block leading-tight">
                Dr. AITD
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                {userRole === 'admin' ? 'Administration' : userRole === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {navGroups.map((group, groupIdx) => {
            const isCollapsed = collapsedSections[group.title];

            return (
              <div key={groupIdx} className="space-y-1">
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(group.title)}
                  className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors select-none"
                >
                  <span>{group.title}</span>
                  {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                </button>

                {/* Section Links */}
                {!isCollapsed && (
                  <div className="space-y-0.5 pt-0.5">
                    {group.items.map((item, itemIdx) => {
                      const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path) && item.path.split('/').length > 2);
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={itemIdx}
                          to={item.path}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                            isActive
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-text-secondary hover:bg-gray-100/80 hover:text-secondary'
                          }`}
                        >
                          <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer with Sign Out */}
        <div className="p-3 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-danger rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
