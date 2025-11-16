const express = require("express");
const {
  addTeacher,
  loginTeacher,
  updatePassword,
  deleteTeacher,
  getTeacherDetails,
  forgetPassword,
  verifyOtp,
} = require("../controller/teacher");

const {
  updateTeacherProfile,
  uploadProfilePhoto,
  getMyStudents,
  getStudentDetails,
  addStudentRemark,
  createAttendance,
  getAttendanceSummary,
  createAssignment,
  getMyAssignments,
  gradeSubmission,
  uploadStudyMaterial,
  createNotice,
  getMyTimetable,
  requestExtraClass,
  getDashboardData
} = require("../controller/teacherModule");

const { isAdmin, isTeacher } = require("../middleware/Auth");

const router = express.Router();

// ============= BASIC TEACHER ROUTES =============
// get all teachers
router.get("/", async (req, res) => {
  try {
    const Teacher = require("../models/Teacher");
    const teachers = await Teacher.find({}, 'name teacher_Id email department qualification designation');
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Failed to fetch teachers" });
  }
});

// get teacher details
router.get("/:teacherId/details", getTeacherDetails);
// add Teacher --Admin
router.post("/addTeacher", isAdmin, addTeacher);
// login teacher
router.post("/login", loginTeacher);
//update Password
router.put("/updatePassword/:id", updatePassword);
// delete teacher --admin
router.delete("/deleteTeacher", isAdmin, deleteTeacher);
// forget password
router.post("/forgetPassword", forgetPassword);
// verify otp
router.post("/forgetPassword/verifyotp", verifyOtp);

// ============= TEACHER MODULE ROUTES =============

// Profile Management
router.put("/:teacherId/profile", updateTeacherProfile);
router.put("/:teacherId/profile-photo", uploadProfilePhoto);

// Dashboard - simple version
router.get("/:teacherId/dashboard", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const Teacher = require('../models/Teacher');
    
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, msg: 'Teacher not found' });
    }
    
    res.json({
      success: true,
      teacher,
      assignments: []
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Student Management
router.get("/:teacherId/students", getMyStudents);
router.get("/:teacherId/students/:studentId", getStudentDetails);
router.post("/:teacherId/students/remarks", addStudentRemark);

// Attendance Management
router.post("/:teacherId/attendance", createAttendance);
router.get("/:teacherId/attendance", getAttendanceSummary);

// Assignment Management
router.post("/:teacherId/assignments", createAssignment);
router.get("/:teacherId/assignments", getMyAssignments);
router.put("/assignments/:assignmentId/submissions/:submissionId/grade", gradeSubmission);

// Study Materials
router.post("/:teacherId/materials", uploadStudyMaterial);

// Notices
router.post("/:teacherId/notices", createNotice);

// Timetable
router.get("/:teacherId/timetable", getMyTimetable);
router.post("/:teacherId/extra-class", requestExtraClass);

module.exports = router;
