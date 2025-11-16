const express = require("express");
const {
  getStudents,
  addStudent,
  loginStudent,
  updatePass,
  deleteStudent,
  getStudentAttendance,
  updateStudentInfo,
  getStudentDetails,
  updateStudentPhoto,
  forgetPassword,
  verifyOtp,
} = require("../controller/student");
const { verifyToken, isAdmin } = require("../middleware/Auth");
const upload = require("../middleware/multer");
const router = express.Router();

// get all students
router.get("/", getStudents);
// get Student Details
router.get("/:studentId/details", getStudentDetails);
// add student --admin
router.post("/register", isAdmin, addStudent);
// login student
router.post("/login", loginStudent);
// update password
router.put("/updatePass/:id", updatePass);
// delete students --admin
router.delete("/deleteStudent", isAdmin, deleteStudent);
// update student info
router.put("/:studentId/updateInfo", upload.single("image"), updateStudentInfo);
// update student photo
router.put(
  "/:studentId/updatePhoto",
  upload.single("image"),
  updateStudentPhoto
);
// get student attendance
router.get("/getAttendance/:id", getStudentAttendance);
// get student dashboard - simple version
router.get("/:studentId/dashboard", verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const Student = require('../models/Student');
    const Course = require('../models/Course');
    
    const student = await Student.findById(studentId).populate('course');
    if (!student) {
      return res.status(404).json({ success: false, msg: 'Student not found' });
    }
    
    res.json({
      success: true,
      dashboard: {
        student,
        subjectAttendance: [],
        assignments: [],
        notices: [],
        notes: [],
        studyMaterials: [],
        overallStats: {
          totalSubjects: 0,
          totalAssignments: 0,
          submittedAssignments: 0,
          overdueAssignments: 0,
          totalNotices: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
// forget password
router.post("/forgetPassword", forgetPassword);
// verify password
router.post("/forgetPassword/verifyotp", verifyOtp);

module.exports = router;
