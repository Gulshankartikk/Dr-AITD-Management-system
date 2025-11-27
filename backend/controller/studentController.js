const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  Student,
  Course,
  Subject,
  Attendance,
  Notes,
  StudyMaterial,
  Assignments,
  Marks,
  Notices
} = require('../models/CompleteModels');

// Student Registration
const studentRegister = async (req, res) => {
  try {
    const { name, email, phone, password, courseId } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, msg: 'Student already exists with this email' });
    }
    
    // Generate roll number
    const studentCount = await Student.countDocuments();
    const rollNo = `STU${String(studentCount + 1).padStart(4, '0')}`;
    
    // Generate username from email
    const username = email.split('@')[0];
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      rollNo,
      courseId
    });
    
    await student.save();
    
    res.status(201).json({ 
      success: true, 
      msg: 'Student registered successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        username: student.username,
        rollNo: student.rollNo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Student Login
const studentLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, msg: 'Username and password are required' });
    }
    
    // STRICT validation - only accept exact match
    if (username !== 'student' || password !== 'student123') {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: 'student1', role: 'student' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true });
    
    return res.json({ 
      success: true, 
      token, 
      student: { 
        id: 'student1', 
        name: 'Demo Student', 
        email: 'student@college.edu',
        rollNo: 'STU001',
        course: { courseName: 'Computer Science', courseCode: 'CSE' },
        role: 'student' 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Handle demo students (including backward compatibility)
    if (studentId === 'demo-student' || studentId === 'admin-student' || studentId === 'student' || studentId === 'student1' || studentId === 'admin') {
      return res.json({
        success: true,
        student: {
          _id: studentId,
          name: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'Demo Student' : 'Administrator (Student View)',
          email: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'student@college.edu' : 'admin@college.edu',
          rollNo: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'STU001' : 'ADMIN001',
          phone: '+91 1234567890',
          courseId: {
            courseName: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'Computer Science' : 'System Administration',
            courseCode: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'CSE' : 'ADMIN',
            courseDuration: 4
          }
        }
      });
    }
    
    const student = await Student.findById(studentId).populate('courseId', 'courseName courseCode courseDuration');
    
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
/*
// Get Student Attendance
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId, month, year } = req.query;
    
    let query = { studentId };
    if (subjectId) query.subjectId = subjectId;
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const attendance = await Attendance.find(query)
      .populate('subjectId', 'subjectName subjectCode')
      .sort({ date: -1 });
    
    // Calculate attendance percentage
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === 'Present').length;
    const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;
    
    res.json({ 
      success: true, 
      attendance,
      student,
      stats: {
        totalClasses,
        presentClasses,
        absentClasses: totalClasses - presentClasses,
        attendancePercentage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};*/

// Get Student Attendance
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId, month, year } = req.query;

    // Handle demo students (including backward compatibility)
    if (studentId === 'demo-student' || studentId === 'admin-student' || studentId === 'student' || studentId === 'student1' || studentId === 'admin') {
      return res.json({
        success: true,
        attendance: [],
        student: {
          _id: studentId,
          name: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'Demo Student' : 'Administrator (Student View)',
          email: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'student@college.edu' : 'admin@college.edu'
        },
        stats: {
          totalClasses: 0,
          presentClasses: 0,
          absentClasses: 0,
          attendancePercentage: 0
        }
      });
    }

    // Fetch student data to include in response
    const student = await Student.findById(studentId).populate(
      "courseId",
      "courseName courseCode"
    );

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    let query = { studentId };

    if (subjectId) query.subjectId = subjectId;

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate("subjectId", "subjectName subjectCode")
      .sort({ date: -1 });

    // Calculate attendance stats
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(
      (a) => a.status === "Present"
    ).length;

    const attendancePercentage =
      totalClasses > 0
        ? ((presentClasses / totalClasses) * 100).toFixed(2)
        : 0;

    res.json({
      success: true,
      attendance,
      student,
      stats: {
        totalClasses,
        presentClasses,
        absentClasses: totalClasses - presentClasses,
        attendancePercentage,
      },
    });
  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};


// Get Student Subjects
const getStudentSubjects = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findById(studentId);
    const subjects = await Subject.find({ courseId: student.courseId, isActive: true });
    
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Notes by Subject
const getNotesBySubject = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId } = req.query;
    
    // Handle demo students (including backward compatibility)
    if (studentId === 'demo-student' || studentId === 'admin-student' || studentId === 'student' || studentId === 'student1' || studentId === 'admin') {
      return res.json({
        success: true,
        notes: [],
        student: {
          _id: studentId,
          name: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'Demo Student' : 'Administrator (Student View)'
        }
      });
    }
    
    const student = await Student.findById(studentId);
    const subjects = await Subject.find({ courseId: student.courseId });
    const subjectIds = subjectId ? [subjectId] : subjects.map(s => s._id);
    
    const notes = await Notes.find({ subjectId: { $in: subjectIds } })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, notes, student });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Study Materials
const getStudyMaterials = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId } = req.query;
    
    // Handle demo students (including backward compatibility)
    if (studentId === 'demo-student' || studentId === 'admin-student' || studentId === 'student' || studentId === 'student1' || studentId === 'admin') {
      return res.json({
        success: true,
        materials: [],
        student: {
          _id: studentId,
          name: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'Demo Student' : 'Administrator (Student View)'
        }
      });
    }
    
    const student = await Student.findById(studentId);
    const subjects = await Subject.find({ courseId: student.courseId });
    const subjectIds = subjectId ? [subjectId] : subjects.map(s => s._id);
    
    const materials = await StudyMaterial.find({ subjectId: { $in: subjectIds } })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, materials, student });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Assignments
const getAssignments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId } = req.query;
    
    // Handle demo students (including backward compatibility)
    if (studentId === 'demo-student' || studentId === 'admin-student' || studentId === 'student' || studentId === 'student1' || studentId === 'admin') {
      return res.json({
        success: true,
        assignments: [],
        student: {
          _id: studentId,
          name: (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') ? 'Demo Student' : 'Administrator (Student View)'
        }
      });
    }
    
    const student = await Student.findById(studentId);
    const subjects = await Subject.find({ courseId: student.courseId });
    const subjectIds = subjectId ? [subjectId] : subjects.map(s => s._id);
    
    const assignments = await Assignments.find({ subjectId: { $in: subjectIds } })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('teacherId', 'name')
      .sort({ deadline: 1 });
    
    res.json({ success: true, assignments, student });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Submit Assignment
const submitAssignment = async (req, res) => {
  try {
    const { studentId, assignmentId } = req.params;
    const { fileUrl } = req.body;
    
    const assignment = await Assignments.findById(assignmentId);
    
    // Check if already submitted
    const existingSubmission = assignment.submissions.find(s => s.studentId.toString() === studentId);
    if (existingSubmission) {
      return res.status(400).json({ success: false, msg: 'Assignment already submitted' });
    }
    
    assignment.submissions.push({ studentId, fileUrl });
    await assignment.save();
    
    res.json({ success: true, msg: 'Assignment submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Student Marks
const getStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId, examType } = req.query;
    
    // Handle demo students (including backward compatibility)
    if (studentId === 'demo-student' || studentId === 'admin-student' || studentId === 'student' || studentId === 'student1' || studentId === 'admin') {
      return res.json({
        success: true,
        marks: []
      });
    }
    
    let query = { studentId };
    if (subjectId) query.subjectId = subjectId;
    if (examType) query.examType = examType;
    
    const marks = await Marks.find(query)
      .populate('subjectId', 'subjectName subjectCode')
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, marks });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Notices
const getNotices = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findById(studentId);
    const notices = await Notices.find({ courseId: student.courseId, isActive: true })
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Comprehensive Student Dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Handle admin access (including backward compatibility)
    if (studentId === 'admin-student' || studentId === 'admin') {
      const courses = await Course.find({ isActive: true }).limit(1);
      const subjects = await Subject.find({ isActive: true }).limit(2);
      
      return res.json({
        success: true,
        student: {
          _id: studentId,
          name: 'Administrator (Student View)',
          email: 'admin@college.edu',
          rollNo: 'ADMIN001',
          courseId: courses[0] || { courseName: 'System Administration', courseCode: 'ADMIN' }
        }
      });
    }
    
    // Handle demo student access (including backward compatibility)
    if (studentId === 'demo-student' || studentId === 'student' || studentId === 'student1') {
      const courses = await Course.find({ isActive: true }).limit(1);
      
      return res.json({
        success: true,
        student: {
          _id: studentId,
          name: 'Demo Student',
          email: 'student@college.edu',
          rollNo: 'STU001',
          courseId: courses[0] || { courseName: 'Computer Science', courseCode: 'CSE' }
        }
      });
    }
    
    const student = await Student.findById(studentId).populate('courseId');
    
    if (!student) {
      return res.status(404).json({ success: false, msg: 'Student not found' });
    }
    
    res.json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  studentRegister,
  studentLogin,
  getStudentProfile,
  getStudentAttendance,
  getStudentSubjects,
  getNotesBySubject,
  getStudyMaterials,
  getAssignments,
  submitAssignment,
  getStudentMarks,
  getNotices,
  getStudentDashboard
};