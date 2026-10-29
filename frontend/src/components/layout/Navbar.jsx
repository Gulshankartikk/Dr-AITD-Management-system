import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  Shield,
  GraduationCap,
  BookOpen,
  Search,
  X,
  ExternalLink
} from 'lucide-react';
import api from '../../api/axiosInstance';
import useAutoLogout from '../../hooks/useAutoLogout';
import Cookies from 'js-cookie';

const Navbar = ({ onMenuClick, userRole, viewRole, setViewRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAutoLogout();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Quick Search Modal
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Fetch quick notifications / notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (!token) return;

        let endpoint = '/api/admin/notices';
        const parts = location.pathname.split('/');
        if (userRole === 'student' && parts[2]) {
          endpoint = `/api/student/${parts[2]}/notices`;
        } else if (userRole === 'teacher' && parts[2]) {
          endpoint = `/api/teacher/${parts[2]}/notices`;
        }

        const res = await api.get(endpoint);
        const list = res.data.notices || res.data.data || [];
        setNotices(list.slice(0, 5));
        setUnreadCount(Math.min(list.length, 5));
      } catch (err) {
        // Silently handle notification load failure
      }
    };

    fetchNotices();
  }, [userRole, location.pathname]);

  // User Profile path
  const getProfilePath = () => {
    const parts = location.pathname.split('/');
    if (userRole === 'admin') return '/admin/settings';
    if (userRole === 'teacher' && parts[2]) return `/teacher/${parts[2]}/profile`;
    if (userRole === 'student' && parts[2]) return `/student/${parts[2]}/profile`;
    return '/login';
  };

  const getNoticesPath = () => {
    const parts = location.pathname.split('/');
    if (userRole === 'admin') return '/admin/notices';
    if (userRole === 'teacher' && parts[2]) return `/teacher/${parts[2]}/notices`;
    if (userRole === 'student' && parts[2]) return `/student/${parts[2]}/notices`;
    return '/';
  };

  const handleOpenCopilot = () => {
    window.dispatchEvent(new CustomEvent('open-ai-copilot', { detail: { tab: 'chat' } }));
    setProfileDropdownOpen(false);
  };

  // ERP Searchable Modules
  const erpModules = [
    { name: 'Dashboard', path: userRole === 'admin' ? '/admin/dashboard' : `/${userRole}/${location.pathname.split('/')[2]}/dashboard`, role: ['admin', 'teacher', 'student'] },
    { name: 'Student Directory', path: '/admin/students', role: ['admin'] },
    { name: 'Faculty Directory', path: '/admin/teachers', role: ['admin'] },
    { name: 'Course Management', path: '/admin/courses', role: ['admin'] },
    { name: 'Subject Management', path: '/admin/subjects', role: ['admin'] },
    { name: 'Fee Management', path: '/admin/fees', role: ['admin'] },
    { name: 'Attendance Management', path: '/admin/attendance', role: ['admin'] },
    { name: 'Examination Cell', path: '/admin/exams', role: ['admin'] },
    { name: 'Timetable Schedules', path: '/admin/timetable', role: ['admin'] },
    { name: 'Library Catalog', path: '/admin/library', role: ['admin'] },
    { name: 'Institutional Reports', path: '/admin/reports', role: ['admin'] },
    { name: 'Notices & Circulars', path: getNoticesPath(), role: ['admin', 'teacher', 'student'] },
    { name: 'Hall of Fame / Achievers', path: '/achievers', role: ['admin', 'teacher', 'student'] }
  ].filter(m => m.role.includes(userRole));

  const filteredModules = erpModules.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-text-secondary hover:bg-gray-100 lg:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex p-1.5 rounded-lg bg-primary/10 text-primary">
            <GraduationCap size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-secondary font-heading tracking-tight leading-none">
              Dr. AITD ERP
            </h1>
            <p className="text-[11px] text-text-muted hidden md:block">
              {userRole === 'admin' ? 'University Administration Portal' : userRole === 'teacher' ? 'Faculty Academic Portal' : 'Student Academic Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Search Button (Desktop) */}
      <div className="hidden md:flex items-center">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-text-secondary text-xs transition-colors border border-gray-200"
        >
          <Search size={14} className="text-gray-500" />
          <span>Quick search modules...</span>
          <kbd className="ml-2 px-1.5 py-0.5 text-[10px] bg-white rounded border border-gray-300 text-gray-500 font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Admin viewing student or teacher */}
        {userRole === 'admin' && viewRole !== 'admin' && (
          <button
            onClick={() => {
              setViewRole('admin');
              navigate('/admin/dashboard');
            }}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Return to Admin</span>
          </button>
        )}

        {/* Gemini AI Copilot Trigger */}
        <button
          onClick={handleOpenCopilot}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition-colors shadow-xs"
          title="Launch Gemini AI Copilot"
        >
          <Sparkles size={14} className="text-indigo-600" />
          <span>Campus AI</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-gray-100 transition-colors relative focus:outline-none"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-secondary">Announcements & Circulars</span>
                <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                  {notices.length} New
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notices.map((n, idx) => (
                  <div
                    key={n._id || idx}
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      navigate(getNoticesPath());
                    }}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <p className="text-xs font-bold text-secondary line-clamp-1">{n.title}</p>
                    <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5">{n.description}</p>
                    <span className="text-[10px] text-text-muted mt-1 block">
                      {new Date(n.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {notices.length === 0 && (
                  <div className="py-6 text-center text-xs text-text-muted">
                    No new announcements at this time.
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100 text-center bg-gray-50 rounded-b-xl">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    navigate(getNoticesPath());
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View All Announcements →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative pl-2 sm:pl-4 border-l border-gray-200" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
            aria-expanded={profileDropdownOpen}
          >
            <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shadow-xs">
              <User size={18} />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-secondary capitalize leading-none">
                {userRole === 'admin' ? 'Administrator' : userRole === 'teacher' ? 'Faculty Member' : 'Student'}
              </p>
              <p className="text-[10px] text-text-muted font-medium mt-0.5">Dr. AITD ERP</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden md:block" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in text-xs">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                <p className="font-bold text-secondary capitalize">{userRole} Account</p>
                <p className="text-[11px] text-text-muted truncate">
                  {userRole === 'admin' ? 'admin@draitd.edu' : userRole === 'teacher' ? 'faculty@draitd.edu' : 'student@draitd.edu'}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(getProfilePath());
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-secondary flex items-center gap-2 transition-colors"
                >
                  <User size={14} className="text-gray-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (userRole === 'admin') navigate('/admin/settings');
                    else navigate(getProfilePath());
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-secondary flex items-center gap-2 transition-colors"
                >
                  <Settings size={14} className="text-gray-400" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={handleOpenCopilot}
                  className="w-full px-4 py-2 text-left hover:bg-indigo-50 text-indigo-700 flex items-center gap-2 transition-colors"
                >
                  <Sparkles size={14} className="text-indigo-500" />
                  <span>Campus AI Copilot</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1 mt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-danger flex items-center gap-2 font-medium transition-colors"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden animate-fade-in">
            <div className="p-3 border-b border-gray-100 flex items-center gap-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search ERP modules, records, directories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent"
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredModules.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(m.path);
                    setSearchOpen(false);
                  }}
                  className="w-full p-2.5 rounded-lg hover:bg-primary/5 text-left text-xs font-semibold text-secondary flex items-center justify-between transition-colors"
                >
                  <span>{m.name}</span>
                  <ExternalLink size={12} className="text-gray-400" />
                </button>
              ))}
              {filteredModules.length === 0 && (
                <p className="text-xs text-text-muted text-center py-6">No matching ERP modules found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
