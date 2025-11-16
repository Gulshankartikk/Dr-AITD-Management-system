const express = require('express');
const router = express.Router();

// Import Controllers
const adminController = require('../controller/adminController');
const teacherController = require('../controller/teacherController');
const studentController = require('../controller/studentController');

// ============= ADMIN ROUTES =============
router.post('/admin/login', adminController.adminLogin);
router.get('/admin/dashboard', adminController.getDashboardData);

// Get all courses and subjects
const { Course, Subject, Teacher, Student } = require('../models/CompleteModels');

// Get all students for admin
router.get('/admin/students', async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }).populate('courseId', 'courseName courseCode');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({}).populate('courseId', 'courseName courseCode');
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: true });
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

router.post('/subjects/add', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Course Management
router.post('/admin/courses', adminController.addCourse);
router.delete('/admin/courses/:courseId', require('../middleware/Auth').isAdmin, adminController.deleteCourse);

// Subject Management
router.post('/admin/subjects', adminController.addSubject);
router.delete('/admin/subjects/:subjectId', require('../middleware/Auth').isAdmin, adminController.deleteSubject);

// Teacher Management
router.post('/admin/teachers', adminController.addTeacher);
router.delete('/admin/teachers/:teacherId', require('../middleware/Auth').isAdmin, adminController.deleteTeacher);

// Student Management
router.post('/admin/students', adminController.addStudent);
router.delete('/admin/students/:studentId', require('../middleware/Auth').isAdmin, adminController.deleteStudent);

// Assignment Management
router.post('/admin/assign-teacher', adminController.assignTeacherToSubject);
router.post('/admin/remove-teacher', adminController.removeTeacherFromSubject);

// Attendance Reports
router.get('/admin/attendance-report', adminController.getComprehensiveAttendanceReport);

// Admin Delete Operations
router.delete('/admin/assignments/:assignmentId', require('../middleware/Auth').isAdmin, adminController.deleteAssignment);
router.delete('/admin/notices/:noticeId', require('../middleware/Auth').isAdmin, adminController.deleteNotice);
router.delete('/admin/materials/:materialId', require('../middleware/Auth').isAdmin, adminController.deleteMaterial);

// Admin Update Operations
router.put('/admin/teachers/:teacherId', require('../middleware/Auth').isAdmin, adminController.updateTeacher);

// ============= TEACHER ROUTES =============
router.post('/teacher/login', teacherController.teacherLogin);
router.get('/teacher/:teacherId/dashboard', teacherController.getTeacherDashboard);

// Student Management
router.get('/teacher/subjects/:subjectId/students', teacherController.getStudentsBySubject);

// Attendance Management
router.post('/teacher/:teacherId/attendance', teacherController.markAttendance);
router.get('/teacher/:teacherId/attendance', teacherController.getAttendanceReport);

// Marks Management
router.post('/teacher/:teacherId/marks', teacherController.addMarks);
router.get('/teacher/:teacherId/marks/all-students', teacherController.getAllStudentsMarks);

// Notes Management
router.post('/teacher/:teacherId/notes', teacherController.addNotes);
router.get('/teacher/:teacherId/notes', teacherController.getTeacherNotes);

// Study Materials
router.post('/teacher/:teacherId/materials', teacherController.addStudyMaterial);
router.get('/teacher/:teacherId/materials', teacherController.getTeacherMaterials);

// Assignments
router.post('/teacher/:teacherId/assignments', teacherController.addAssignment);
router.get('/teacher/:teacherId/assignments', teacherController.getTeacherAssignments);

// Notices
router.post('/teacher/:teacherId/notices', teacherController.addNotice);
router.get('/teacher/:teacherId/notices', teacherController.getTeacherNotices);

// ============= STUDENT ROUTES =============
router.post('/student/login', studentController.studentLogin);
router.get('/student/:studentId/dashboard', studentController.getStudentDashboard);
router.get('/student/:studentId/profile', studentController.getStudentProfile);

// Attendance
router.get('/student/:studentId/attendance', studentController.getStudentAttendance);

// Subjects
router.get('/student/:studentId/subjects', studentController.getStudentSubjects);

// Notes
router.get('/student/:studentId/notes', studentController.getNotesBySubject);

// Study Materials
router.get('/student/:studentId/materials', studentController.getStudyMaterials);

// Assignments
router.get('/student/:studentId/assignments', studentController.getAssignments);
router.post('/student/:studentId/assignments/:assignmentId/submit', studentController.submitAssignment);

// Marks
router.get('/student/:studentId/marks', studentController.getStudentMarks);

// Notices
router.get('/student/:studentId/notices', studentController.getNotices);

// ============= NOTIFICATION ROUTES =============
const notificationController = require('../controller/notificationController');

// Get notifications for user
router.get('/notifications/:userId', notificationController.getUserNotifications);
// Get unread count
router.get('/notifications/:userId/unread-count', notificationController.getUnreadCount);
// Mark as read
router.put('/notifications/:notificationId/read', notificationController.markAsRead);

module.exports = router;