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

// Registration and Login
router.post('/admin/register', adminController.adminRegister);
router.post('/admin/login', adminController.adminLogin);

// ======================================================
//                     TEACHER ROUTES
// ======================================================

// Registration and Login
router.post('/teacher/register', teacherController.teacherRegister);
router.post('/teacher/login', teacherController.teacherLogin);

// Dashboard
router.get('/teacher/:teacherId/dashboard', verifyToken, teacherController.getTeacherDashboard);

// Teacher Assignment Management
router.get('/teacher/:teacherId/assignments', verifyToken, teacherController.getTeacherAssignments);
router.post('/teacher/:teacherId/assignments', verifyToken, upload.single('file'), teacherController.addAssignment);
router.get('/teacher/:teacherId/students/:subjectId', verifyToken, teacherController.getStudentsBySubject);
router.post('/teacher/:teacherId/attendance', verifyToken, teacherController.markAttendance);
router.get('/teacher/:teacherId/attendance-report', verifyToken, teacherController.getAttendanceReport);
router.post('/teacher/:teacherId/marks', verifyToken, teacherController.addMarks);
router.get('/teacher/:teacherId/marks/:subjectId', verifyToken, teacherController.getAllStudentsMarks);
router.post('/teacher/:teacherId/notes', verifyToken, upload.single('file'), teacherController.addNotes);
router.post('/teacher/:teacherId/materials', verifyToken, upload.single('file'), teacherController.addStudyMaterial);
router.post('/teacher/:teacherId/notices', verifyToken, teacherController.addNotice);
router.get('/teacher/:teacherId/notes', verifyToken, teacherController.getTeacherNotes);
router.get('/teacher/:teacherId/materials', verifyToken, teacherController.getTeacherMaterials);
router.get('/teacher/:teacherId/notices', verifyToken, teacherController.getTeacherNotices);

// ======================================================
//                     STUDENT ROUTES
// ======================================================

// Registration and Login
router.post('/student/register', studentController.studentRegister);
router.post('/student/login', studentController.studentLogin);

// Dashboard
router.get('/student/:studentId/dashboard', verifyToken, studentController.getStudentDashboard);

// Student Academic Routes
router.get('/student/:studentId/profile', verifyToken, studentController.getStudentProfile);
router.get('/student/:studentId/attendance', verifyToken, studentController.getStudentAttendance);
router.get('/student/:studentId/subjects', verifyToken, studentController.getStudentSubjects);
router.get('/student/:studentId/notes', verifyToken, studentController.getNotesBySubject);
router.get('/student/:studentId/materials', verifyToken, studentController.getStudyMaterials);
router.get('/student/:studentId/assignments', verifyToken, studentController.getAssignments);
router.post('/student/:studentId/assignments/:assignmentId/submit', verifyToken, studentController.submitAssignment);
router.get('/student/:studentId/marks', verifyToken, studentController.getStudentMarks);
router.get('/student/:studentId/notices', verifyToken, studentController.getNotices);

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

// Fetch courses (public for registration)
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Fetch subjects (public)
router.get('/subjects', async (req, res) => {
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
router.put('/admin/students/:studentId', verifyToken, adminController.updateStudent);

// ================= Admin View Operations =================
router.get('/admin/students/:studentId', verifyToken, adminController.getStudentDetails);
router.get('/admin/teachers/:teacherId', verifyToken, isAdmin, adminController.getTeacherDetails);

// ================= Teacher Student Management =================
router.get('/teacher/students/:studentId', verifyToken, adminController.getStudentDetails);
router.put('/teacher/students/:studentId', verifyToken, adminController.updateStudent);
router.delete('/teacher/students/:studentId', verifyToken, adminController.deleteStudent);

module.exports = router;
