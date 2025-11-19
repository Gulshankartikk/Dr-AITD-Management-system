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
router.post('/teacher/register', teacherController.teacherRegister);
router.post('/teacher/login', teacherController.teacherLogin);

// Dashboard + subjects + courses
router.get('/teacher/:teacherId/dashboard', verifyToken, isTeacher, teacherController.getTeacherDashboard);

// Students by subject
router.get('/teacher/:teacherId/subjects/:subjectId/students',
    verifyToken,
    isTeacher,
    teacherController.getStudentsBySubject
);

// Attendance
router.post('/teacher/:teacherId/attendance', verifyToken, isTeacher, teacherController.markAttendance);
router.get('/teacher/:teacherId/attendance-report', verifyToken, isTeacher, teacherController.getAttendanceReport);

// Assignments
router.get('/teacher/:teacherId/assignments', verifyToken, isTeacher, teacherController.getTeacherAssignments);
router.post('/teacher/:teacherId/assignments',
    verifyToken,
    isTeacher,
    upload.single('file'),
    teacherController.addAssignment
);

// Marks
router.post('/teacher/:teacherId/marks', verifyToken, isTeacher, teacherController.addMarks);
router.get('/teacher/:teacherId/marks/:subjectId', verifyToken, isTeacher, teacherController.getAllStudentsMarks);

// Notes + Materials + Notices
router.post('/teacher/:teacherId/notes', verifyToken, isTeacher, upload.single('file'), teacherController.addNotes);
router.post('/teacher/:teacherId/materials', verifyToken, isTeacher, upload.single('file'), teacherController.addStudyMaterial);
router.post('/teacher/:teacherId/notices', verifyToken, isTeacher, teacherController.addNotice);

router.get('/teacher/:teacherId/notes', verifyToken, isTeacher, teacherController.getTeacherNotes);
router.get('/teacher/:teacherId/materials', verifyToken, isTeacher, teacherController.getTeacherMaterials);
router.get('/teacher/:teacherId/notices', verifyToken, isTeacher, teacherController.getTeacherNotices);


// ======================================================
//                      STUDENT ROUTES
// ======================================================
router.post('/student/register', studentController.studentRegister);
router.post('/student/login', studentController.studentLogin);

router.get('/student/:studentId/dashboard', verifyToken, studentController.getStudentDashboard);
router.get('/student/:studentId/profile', verifyToken, studentController.getStudentProfile);
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
router.get('/admin/students', verifyToken, isAdmin, adminController.getAllStudents);
router.post('/admin/students', verifyToken, isAdmin, adminController.addStudent);
router.put('/admin/students/:studentId', verifyToken, isAdmin, adminController.updateStudent);
router.delete('/admin/students/:studentId', verifyToken, isAdmin, adminController.deleteStudent);

// Teachers
router.get('/admin/teachers', verifyToken, isAdmin, adminController.getAllTeachers);
router.post('/admin/teachers', verifyToken, isAdmin, adminController.addTeacher);
router.put('/admin/teachers/:teacherId', verifyToken, isAdmin, adminController.updateTeacher);
router.delete('/admin/teachers/:teacherId', verifyToken, isAdmin, adminController.deleteTeacher);

// Courses
router.post('/admin/courses', verifyToken, isAdmin, adminController.addCourse);
router.delete('/admin/courses/:courseId', verifyToken, isAdmin, adminController.deleteCourse);

// Subjects
router.post('/admin/subjects', verifyToken, isAdmin, adminController.addSubject);
router.delete('/admin/subjects/:subjectId', verifyToken, isAdmin, adminController.deleteSubject);

// Teacher ↔ Subject assignment
router.post('/admin/assign-teacher', verifyToken, isAdmin, adminController.assignTeacherToSubject);
router.post('/admin/remove-teacher', verifyToken, isAdmin, adminController.removeTeacherFromSubject);

// Attendance report
router.get('/admin/attendance-report', verifyToken, isAdmin, adminController.getComprehensiveAttendanceReport);


// ======================================================
//              ADMIN USING TEACHER FUNCTIONS
// ======================================================
router.post('/teacher/admin/attendance', verifyToken, isAdmin, teacherController.markAttendance);
router.post('/teacher/admin/assignments', verifyToken, isAdmin, upload.single('file'), teacherController.addAssignment);
router.post('/teacher/admin/notices', verifyToken, isAdmin, teacherController.addNotice);
router.post('/teacher/admin/materials', verifyToken, isAdmin, upload.single('file'), teacherController.addStudyMaterial);
router.get('/teacher/admin/dashboard', verifyToken, isAdmin, teacherController.getTeacherDashboard);


// ======================================================
module.exports = router;

