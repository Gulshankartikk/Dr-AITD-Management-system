import React from 'react';
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
  ClipboardCheck
} from 'lucide-react';
import useAutoLogout from '../../hooks/useAutoLogout';

const Sidebar = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();
  const logout = useAutoLogout();

  const getLinks = () => {
    const common = [
      { icon: LayoutDashboard, label: 'Dashboard', path: `/${userRole}/${userRole === 'admin' ? 'dashboard' : 'id/dashboard'}` },
    ];

    if (userRole === 'admin') {
      return [
        ...common,
        { icon: Users, label: 'Students', path: '/admin/students' },
        { icon: GraduationCap, label: 'Teachers', path: '/admin/teachers' },
        { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { icon: Library, label: 'Subjects', path: '/admin/add-subject' },
        { icon: CreditCard, label: 'Fees', path: '/admin/fees' },
        { icon: ClipboardCheck, label: 'Attendance', path: '/admin/attendance' },
        { icon: Calendar, label: 'Timetable', path: '/admin/timetable' },
        { icon: FileText, label: 'Notices', path: '/admin/notices' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
      ];
    } else if (userRole === 'teacher') {
      // Note: Teacher paths need dynamic ID, handling this in the component logic or context is better, 
      // but for now we'll assume the parent layout handles the ID redirection or we use relative paths if possible.
      // Since the current structure uses /teacher/:id/..., we might need to extract ID from URL.
      const teacherId = location.pathname.split('/')[2];
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: `/teacher/${teacherId}/dashboard` },
        { icon: Users, label: 'My Students', path: `/teacher/${teacherId}/students` },
        { icon: ClipboardCheck, label: 'Attendance', path: `/teacher/${teacherId}/attendance` },
        { icon: BookOpen, label: 'Assignments', path: `/teacher/${teacherId}/assignments` },
        { icon: FileText, label: 'Materials', path: `/teacher/${teacherId}/materials` },
        { icon: GraduationCap, label: 'Marks', path: `/teacher/${teacherId}/marks` },
        { icon: Calendar, label: 'Timetable', path: `/teacher/${teacherId}/timetable` },
        { icon: FileText, label: 'Notices', path: `/teacher/${teacherId}/notices` },
      ];
    } else if (userRole === 'student') {
      const studentId = location.pathname.split('/')[2];
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: `/student/${studentId}/dashboard` },
        { icon: ClipboardCheck, label: 'Attendance', path: `/student/${studentId}/attendance` },
        { icon: BookOpen, label: 'Assignments', path: `/student/${studentId}/assignments` },
        { icon: FileText, label: 'Materials', path: `/student/${studentId}/materials` },
        { icon: GraduationCap, label: 'Marks', path: `/student/${studentId}/marks` },
        { icon: CreditCard, label: 'Fees', path: `/student/${studentId}/fees` },
        { icon: Calendar, label: 'Timetable', path: `/student/${studentId}/timetable` },
        { icon: FileText, label: 'Notices', path: `/student/${studentId}/notices` },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              College ERP
            </span>
            <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <link.icon size={20} className="mr-3" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;