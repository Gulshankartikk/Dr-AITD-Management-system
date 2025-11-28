const express = require('express');
const router = express.Router();

// ================= MIDDLEWARES =================
const { verifyToken, isAdmin, isTeacher } = require('../middleware/Auth');
const upload = require('../middleware/upload');

// ================= CONTROLLERS =================
const adminController = require('../controller/adminController');
const teacherController = require('../controller/teacherController');
const studentController = require('../controller/studentController');

// ================= MODELS =================
const { Course, Subject, Teacher, Student } = require('../models/CompleteModels');


// ======================================================
//                        ADMIN LOGIN
// ======================================================
router.post('/admin/login', adminController.adminLogin);


// ======================================================
//                      TEACHER ROUTES
// ======================================================

router.post('/teacher/login', teacherController.teacherLogin);

// Dashboard + subjects + courses
router.get('/teacher/:teacherId/dashboard', verifyToken, teacherController.getTeacherDashboard);
router.put('/teacher/:teacherId/profile', verifyToken, async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, email, phone, department, designation } = req.body;
    const { Teacher } = require('../models/CompleteModels');
    
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { name, email, phone, department, designation },
      { new: true }
    );
    
    if (!updatedTeacher) {
      return res.status(404).json({ success: false, msg: 'Teacher not found' });
    }
    
    res.json({ success: true, teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Students by subject
router.get('/teacher/:teacherId/subjects/:subjectId/students', verifyToken, teacherController.getStudentsBySubject);

// Attendance
router.post('/teacher/:teacherId/attendance', verifyToken, teacherController.markAttendance);
router.get('/teacher/:teacherId/attendance-report', verifyToken, teacherController.getAttendanceReport);

// Assignments
router.get('/teacher/:teacherId/assignments', verifyToken, teacherController.getTeacherAssignments);
router.post('/teacher/:teacherId/assignments', verifyToken, upload.single('file'), teacherController.addAssignment);

// Marks
router.post('/teacher/:teacherId/marks', verifyToken, teacherController.addMarks);
router.get('/teacher/:teacherId/marks/:subjectId', verifyToken, teacherController.getAllStudentsMarks);

// Teacher subjects and courses
router.get('/teacher/:teacherId/subjects', verifyToken, teacherController.getTeacherSubjects);
router.get('/teacher/:teacherId/courses', verifyToken, teacherController.getTeacherCourses);

// Notes + Materials + Notices
router.post('/teacher/:teacherId/notes', verifyToken, upload.single('file'), teacherController.addNotes);
router.post('/teacher/:teacherId/materials', verifyToken, upload.single('file'), teacherController.addStudyMaterial);
router.post('/teacher/:teacherId/notices', verifyToken, teacherController.addNotice);

router.get('/teacher/:teacherId/notes', verifyToken, teacherController.getTeacherNotes);
router.get('/teacher/:teacherId/materials', verifyToken, teacherController.getTeacherMaterials);
router.get('/teacher/:teacherId/notices', verifyToken, teacherController.getTeacherNotices);


// ======================================================
//                      STUDENT ROUTES
// ======================================================
router.post('/student/register', studentController.studentRegister);
router.post('/student/login', studentController.studentLogin);

router.get('/student/:studentId/dashboard', verifyToken, studentController.getStudentDashboard);
router.get('/student/:studentId/profile', verifyToken, studentController.getStudentProfile);
router.put('/student/:studentId/profile', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, email, phone } = req.body;
    const { Student } = require('../models/CompleteModels');
    
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { name, email, phone },
      { new: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ success: false, msg: 'Student not found' });
    }
    
    res.json({ success: true, student: updatedStudent });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
router.get('/student/:studentId/attendance', verifyToken, studentController.getStudentAttendance);
router.get('/student/:studentId/subjects', verifyToken, studentController.getStudentSubjects);
router.get('/student/:studentId/notes', verifyToken, studentController.getNotesBySubject);
router.get('/student/:studentId/materials', verifyToken, studentController.getStudyMaterials);
router.get('/student/:studentId/assignments', verifyToken, studentController.getAssignments);
router.post('/student/:studentId/assignments/:assignmentId/submit', verifyToken, studentController.submitAssignment);
router.get('/student/:studentId/marks', verifyToken, studentController.getStudentMarks);
router.get('/student/:studentId/notices', verifyToken, studentController.getNotices);


// ======================================================
//                      ADMIN DASHBOARD
// ======================================================
router.get('/admin/dashboard', verifyToken, isAdmin, adminController.getDashboardData);


// ======================================================
//                       ADMIN MANAGEMENT
// ======================================================

// Students
router.get('/admin/students', verifyToken, async (req, res) => {
  try {
    const { Student } = require('../models/CompleteModels');
    const students = await Student.find({ isActive: true }).populate('courseId', 'courseName courseCode');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
router.post('/admin/students', verifyToken, isAdmin, adminController.addStudent);
router.put('/admin/students/:studentId', verifyToken, adminController.updateStudent);
router.delete('/admin/students/:studentId', verifyToken, isAdmin, adminController.deleteStudent);
router.get('/admin/students/:studentId', verifyToken, adminController.getStudentDetails);

// Teachers
router.get('/admin/teachers', verifyToken, async (req, res) => {
  try {
    const { Teacher } = require('../models/CompleteModels');
    const teachers = await Teacher.find({ isActive: true });
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
router.post('/admin/teachers', verifyToken, isAdmin, adminController.addTeacher);
router.put('/admin/teachers/:teacherId', verifyToken, isAdmin, adminController.updateTeacher);
router.delete('/admin/teachers/:teacherId', verifyToken, isAdmin, adminController.deleteTeacher);
router.get('/admin/teachers/:teacherId', verifyToken, isAdmin, adminController.getTeacherDetails);

// Courses
router.get('/courses', async (req, res) => {
  try {
    const { Course } = require('../models/CompleteModels');
    const courses = await Course.find({ isActive: true });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
router.post('/admin/courses', verifyToken, isAdmin, adminController.addCourse);
router.delete('/admin/courses/:courseId', verifyToken, isAdmin, adminController.deleteCourse);

// Subjects
router.get('/subjects', async (req, res) => {
  try {
    const { Subject } = require('../models/CompleteModels');
    const subjects = await Subject.find({}).populate('courseId', 'courseName courseCode').populate('teacherId', 'name email');
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
router.post('/admin/subjects', verifyToken, isAdmin, adminController.addSubject);
router.post('/subjects/add', verifyToken, isAdmin, adminController.addSubject);
router.delete('/admin/subjects/:subjectId', verifyToken, isAdmin, adminController.deleteSubject);

// Teacher ↔ Subject assignment
router.post('/admin/assign-teacher', verifyToken, isAdmin, adminController.assignTeacherToSubject);
router.post('/admin/remove-teacher', verifyToken, isAdmin, adminController.removeTeacherFromSubject);

// Attendance report
router.get('/admin/attendance-report', verifyToken, isAdmin, adminController.getComprehensiveAttendanceReport);

// Delete operations
router.delete('/admin/assignments/:assignmentId', verifyToken, isAdmin, adminController.deleteAssignment);
router.delete('/admin/notices/:noticeId', verifyToken, isAdmin, adminController.deleteNotice);
router.delete('/admin/materials/:materialId', verifyToken, isAdmin, adminController.deleteMaterial);


// ======================================================
//              ADMIN USING TEACHER FUNCTIONS
// ======================================================
router.post('/teacher/admin/attendance', verifyToken, (req, res) => {
  req.params.teacherId = req.body.teacherId || 'admin';
  teacherController.markAttendance(req, res);
});
router.post('/teacher/admin/assignments', verifyToken, upload.single('file'), teacherController.addAssignment);
router.post('/teacher/admin/notices', verifyToken, teacherController.addNotice);
router.post('/teacher/admin/materials', verifyToken, upload.single('file'), teacherController.addStudyMaterial);
router.get('/teacher/admin/dashboard', verifyToken, teacherController.getTeacherDashboard);

// Teacher student management
router.get('/teacher/students/:studentId', verifyToken, adminController.getStudentDetails);
router.put('/teacher/students/:studentId', verifyToken, adminController.updateStudent);
router.delete('/teacher/students/:studentId', verifyToken, adminController.deleteStudent);


// ======================================================
module.exports = router;

