// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:4001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// User Types
export const USER_TYPES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  
  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    STUDENTS: '/admin/students',
    TEACHERS: '/admin/teachers',
    COURSES: '/admin/courses',
    SUBJECTS: '/admin/subjects',
    REPORTS: '/admin/reports'
  },
  
  // Teacher Routes
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    ATTENDANCE: '/teacher/attendance',
    ASSIGNMENTS: '/teacher/assignments',
    MATERIALS: '/teacher/materials',
    STUDENTS: '/teacher/students'
  },
  
  // Student Routes
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    ATTENDANCE: '/student/attendance',
    ASSIGNMENTS: '/student/assignments',
    MATERIALS: '/student/materials',
    NOTES: '/student/notes'
  }
};

// Status Constants
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress'
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused'
};

// Assignment Status
export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  OVERDUE: 'overdue'
};

// File Types
export const FILE_TYPES = {
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif'],
  PRESENTATION: ['ppt', 'pptx'],
  SPREADSHEET: ['xls', 'xlsx'],
  ALL_ALLOWED: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'ppt', 'pptx', 'xls', 'xlsx']
};

// File Size Limits (in MB)
export const FILE_SIZE_LIMITS = {
  DOCUMENT: 10,
  IMAGE: 5,
  ASSIGNMENT: 25,
  PROFILE_PICTURE: 2
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#12343b',
  SECONDARY: '#2d545e',
  ACCENT: '#e1b382',
  ACCENT_DARK: '#c89666',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6'
};

// Semesters
export const SEMESTERS = [
  { value: 1, label: '1st Semester' },
  { value: 2, label: '2nd Semester' },
  { value: 3, label: '3rd Semester' },
  { value: 4, label: '4th Semester' },
  { value: 5, label: '5th Semester' },
  { value: 6, label: '6th Semester' },
  { value: 7, label: '7th Semester' },
  { value: 8, label: '8th Semester' }
];

// Common Departments
export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
  'Biotechnology',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'Management'
];

// Default Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    CREATE: 'Created successfully',
    UPDATE: 'Updated successfully',
    DELETE: 'Deleted successfully',
    UPLOAD: 'File uploaded successfully'
  },
  ERROR: {
    LOGIN: 'Login failed',
    NETWORK: 'Network error occurred',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Resource not found',
    VALIDATION: 'Validation error',
    UPLOAD: 'File upload failed'
  },
  LOADING: {
    DEFAULT: 'Loading...',
    LOGIN: 'Logging in...',
    UPLOAD: 'Uploading...',
    SAVE: 'Saving...'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  USER_TYPE: 'userType',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export default {
  API_CONFIG,
  USER_TYPES,
  USER_ROLES,
  ROUTES,
  STATUS,
  ATTENDANCE_STATUS,
  ASSIGNMENT_STATUS,
  FILE_TYPES,
  FILE_SIZE_LIMITS,
  PAGINATION,
  DATE_FORMATS,
  NOTIFICATION_TYPES,
  THEME_COLORS,
  SEMESTERS,
  DEPARTMENTS,
  MESSAGES,
  STORAGE_KEYS
};
