const express = require("express");
const { isAdmin } = require("../middleware/Auth");
const { Subject, Teacher } = require("../models/CompleteModels");

const router = express.Router();

// Add subject
router.post("/add", isAdmin, async (req, res) => {
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

    // Validate required fields
    if (!subjectName || !subjectCode || !semester || !branch) {
      return res.status(400).json({
        success: false,
        msg: "Subject Name, Code, Semester and Branch are required"
      });
    }

    // Check for duplicate subject code
    const existingSubject = await Subject.findOne({ subjectCode });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        msg: "Subject code already exists"
      });
    }

    // Build subject data
    const subjectData = {
      subjectName,
      subjectCode,
      subjectType,
      credits,
      semester,
      branch,
      isElective,
      teacherId: teacherId || null,
      courseId: courseId || null
    };

    const subject = new Subject(subjectData);
    await subject.save();

    // Assign subject to teacher (optional)
    if (teacherId) {
      await Teacher.findByIdAndUpdate(teacherId, {
        $push: { assignedSubjects: subject._id }
      });
    }

    res.status(201).json({
      success: true,
      msg: "Subject added successfully",
      subject
    });

  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({
      success: false,
      msg: error.message || "Failed to add subject"
    });
  }
});

module.exports = router;
