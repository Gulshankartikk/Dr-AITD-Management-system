import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  admin: 'Admin',
  teacher: 'Faculty',
  student: 'Student',
  dashboard: 'Dashboard',
  students: 'Student Directory',
  teachers: 'Faculty Directory',
  courses: 'Course Management',
  'add-course': 'Add Course',
  subjects: 'Subject Management',
  'add-subject': 'Add Subject',
  'create-student': 'New Admission',
  'create-teacher': 'Add Faculty',
  fees: 'Fee Management',
  attendance: 'Attendance Management',
  exams: 'Examinations',
  library: 'Library Catalog',
  timetable: 'Timetable & Schedules',
  reports: 'Reports & Analytics',
  settings: 'System Settings',
  notices: 'Notices & Circulars',
  profile: 'My Profile',
  notes: 'Lecture Notes',
  materials: 'Study Materials',
  resources: 'Learning Resources',
  assignments: 'Assignments',
  marks: 'Marks & Results',
  leave: 'Leave Applications',
  achievers: 'Hall of Fame'
};

const Breadcrumbs = ({ className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // If on home/landing, don't show
  if (pathnames.length === 0) return null;

  // Build crumbs
  const crumbs = [];
  let currentPath = '';

  pathnames.forEach((part, index) => {
    currentPath += `/${part}`;

    // Skip Mongo ObjectIds or student/teacher ID segments in display label
    const isId = /^[0-9a-fA-F]{24}$/.test(part) || (index === 1 && (pathnames[0] === 'teacher' || pathnames[0] === 'student'));
    if (isId) return;

    const label = routeNameMap[part] || (part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '));
    const isLast = index === pathnames.length - 1;

    crumbs.push({
      path: currentPath,
      label,
      isLast
    });
  });

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-text-secondary py-1 mb-4 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5">
        <li className="flex items-center">
          <Link
            to={pathnames[0] === 'admin' ? '/admin/dashboard' : pathnames[0] === 'teacher' ? `/${pathnames[0]}/${pathnames[1]}/dashboard` : pathnames[0] === 'student' ? `/${pathnames[0]}/${pathnames[1]}/dashboard` : '/'}
            className="flex items-center gap-1 hover:text-primary transition-colors text-text-muted"
            title="Dashboard"
          >
            <Home size={13} />
            <span className="hidden sm:inline">Portal</span>
          </Link>
        </li>

        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
            {crumb.isLast ? (
              <span className="font-semibold text-secondary" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="hover:text-primary transition-colors text-text-muted">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
