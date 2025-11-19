const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/Auth");
const { Subject, Teacher, Course } = require("../models/CompleteModels");

const router = express.Router();

// =========================
// ADD NEW SUBJECT (ADMIN)
// =========================
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { 
      subjectName,
      subjectCode,
      subjectType,
      credits,
      semester,
      branch,
      isElective,
      teacherId,
      courseId
    } = req.body;

    // Required fields
    if (!subjectName || !subjectCode || !semester || !branch) {
      return res.status(400).json({
        success: false,
        msg: "Subject Name, Code, Semester, and Branch are required"
      });
    }

    // Check duplicate subject code
    const existingSubject = await Subject.findOne({ subjectCode });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        msg: "Subject code already exists"
      });
    }

    // Validate course if provided
    if (courseId) {
      const courseExists = await Course.findById(courseId);
      if (!courseExists) {
        return res.status(404).json({
          success: false,
          msg: "Invalid Course ID"
        });
      }
    }

    // Validate teacher if provided
    if (teacherId) {
      const teacherExists = await Teacher.findById(teacherId);
      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          msg: "Invalid Teacher ID"
        });
      }
    }

    // Prepare subject data
    const newSubject = new Subject({
      subjectName,
      subjectCode,
      subjectType,
      credits,
      semester,
      branch,
      isElective: isElective || false,
      teacherId: teacherId || null,
      courseId: courseId || null
    });

    // Save subject
    await newSubject.save();

    // Auto-assign subject to teacher
    if (teacherId) {
      await Teacher.findByIdAndUpdate(teacherId, {
        $push: { assignedSubjects: newSubject._id }
      });
    }

    res.status(201).json({
      success: true,
      msg: "Subject added successfully",
      subject: newSubject
    });

  } catch (error) {
    console.error("Subject Add Error:", error);
    res.status(500).json({
      success: false,
      msg: error.message || "Server error while adding subject"
    });
  }
});

module.exports = router;
