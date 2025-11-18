const express = require('express');
const router = express.Router();

// ================= MIDDLEWARES =================
const { verifyToken, isAdmin } = require('../middleware/Auth');
const upload = require('../middleware/upload');

// ================= CONTROLLERS =================
const adminController = require('../controller/adminController');
const teacherController = require('../controller/teacherController');
const studentController = require('../controller/studentController');
const notificationController = require('../controller/notificationController');

// ================= MODELS =================
const { Course, Subject, Teacher, Student } = require('../models/CompleteModels');


// ======================================================
//                     ADMIN ROUTES
// ======================================================

// Login
router.post('/admin/login', adminController.adminLogin);

// ======================================================
//                     TEACHER ROUTES
// ======================================================

// Login
router.post('/teacher/login', teacherController.teacherLogin);

// Dashboard
router.get('/teacher/:teacherId/dashboard', verifyToken, teacherController.getTeacherDashboard);

// ======================================================
//                     STUDENT ROUTES
// ======================================================

// Login
router.post('/student/login', studentController.studentLogin);

// Dashboard
router.get('/student/:studentId/dashboard', verifyToken, studentController.getStudentDashboard);

// Dashboard
router.get('/admin/dashboard', verifyToken, isAdmin, adminController.getDashboardData);

// Fetch all students
router.get('/admin/students', verifyToken, isAdmin, async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate('courseId', 'courseName courseCode');

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Fetch courses
router.get('/courses', verifyToken, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Fetch subjects
router.get('/subjects', verifyToken, isAdmin, async (req, res) => {
  try {
    const subjects = await Subject.find({})
      .populate('courseId', 'courseName courseCode');

    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Fetch teachers
router.get('/teachers', verifyToken, isAdmin, async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: true });
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Add subject
router.post('/subjects/add', verifyToken, isAdmin, async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();

    res.json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// ================= Course Management =================
router.post('/admin/courses', verifyToken, isAdmin, adminController.addCourse);
router.delete('/admin/courses/:courseId', verifyToken, isAdmin, adminController.deleteCourse);

// ================= Subject Management =================
router.post('/admin/subjects', verifyToken, isAdmin, adminController.addSubject);
router.delete('/admin/subjects/:subjectId', verifyToken, isAdmin, adminController.deleteSubject);

// ================= Teacher Management =================
router.post('/admin/teachers', verifyToken, isAdmin, adminController.addTeacher);
router.delete('/admin/teachers/:teacherId', verifyToken, isAdmin, adminController.deleteTeacher);

// ================= Student Management =================
router.post('/admin/students', verifyToken, isAdmin, adminController.addStudent);
router.delete('/admin/students/:studentId', verifyToken, isAdmin, adminController.deleteStudent);

// ================= Assignment Management =================
router.post('/admin/assign-teacher', verifyToken, isAdmin, adminController.assignTeacherToSubject);
router.post('/admin/remove-teacher', verifyToken, isAdmin, adminController.removeTeacherFromSubject);

// ================= Attendance Reports =================
router.get('/admin/attendance-report', verifyToken, isAdmin, adminController.getComprehensiveAttendanceReport);

// ================= Admin Delete Operations =================
router.delete('/admin/assignments/:assignmentId', verifyToken, isAdmin, adminController.deleteAssignment);
router.delete('/admin/notices/:noticeId', verifyToken, isAdmin, adminController.deleteNotice);
router.delete('/admin/materials/:materialId', verifyToken, isAdmin, adminController.deleteMaterial);

// ================= Admin Update Operations =================
router.put('/admin/teachers/:teacherId', verifyToken, isAdmin, adminController.updateTeacher);

module.exports = router;
