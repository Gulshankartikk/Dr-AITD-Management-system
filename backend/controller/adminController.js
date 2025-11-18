const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  Course,
  Subject,
  Teacher,
  Student,
  TeacherSubjectAssignment,
  Attendance,
  Marks,
  Admin,
  Assignments,
  Notices,
  StudyMaterial
} = require('../models/CompleteModels');
const { sendNotification } = require('./notificationController');

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username !== 'admin' || password !== 'admin') {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token);
    
    res.json({ success: true, token, admin: { id: 'admin', name: 'Administrator', role: 'admin' } });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Course
const addCourse = async (req, res) => {
  try {
    const { courseName, courseCode, courseDuration, courseDescription } = req.body;
    
    const course = new Course({ courseName, courseCode, courseDuration, courseDescription });
    await course.save();
    
    res.status(201).json({ success: true, msg: 'Course added successfully', course });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Subject
const addSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, courseId, subjectDescription } = req.body;
    
    const subject = new Subject({ subjectName, subjectCode, courseId, subjectDescription });
    await subject.save();
    
    res.status(201).json({ success: true, msg: 'Subject added successfully', subject });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Teacher
const addTeacher = async (req, res) => {
  try {
    const { name, email, phone, password, assignedCourse, assignedSubjects } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({
      name, email, phone, password: hashedPassword, assignedCourse, assignedSubjects
    });
    await teacher.save();
    
    res.status(201).json({ success: true, msg: 'Teacher added successfully', teacher });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Student
const addStudent = async (req, res) => {
  try {
    const { name, email, phone, rollNo, password, courseId, semester } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      name, email, phone, rollNo, password: hashedPassword, courseId, semester
    });
    await student.save();
    
    res.status(201).json({ success: true, msg: 'Student added successfully', student });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Assign Teacher to Subject
const assignTeacherToSubject = async (req, res) => {
  try {
    const { teacherId, subjectId, courseId } = req.body;
    
    const assignment = new TeacherSubjectAssignment({ teacherId, subjectId, courseId });
    await assignment.save();
    
    // Update teacher's assigned subjects
    await Teacher.findByIdAndUpdate(teacherId, {
      $addToSet: { assignedSubjects: subjectId, assignedCourse: courseId }
    });
    
    res.status(201).json({ success: true, msg: 'Teacher assigned successfully', assignment });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Remove Teacher from Subject
const removeTeacherFromSubject = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.body;
    
    await TeacherSubjectAssignment.findOneAndUpdate(
      { teacherId, subjectId },
      { isActive: false }
    );
    
    await Teacher.findByIdAndUpdate(teacherId, {
      $pull: { assignedSubjects: subjectId }
    });
    
    res.json({ success: true, msg: 'Teacher removed from subject successfully' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get All Data for Dashboard
const getDashboardData = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    const subjects = await Subject.find({ isActive: true }).populate('courseId');
    const teachers = await Teacher.find({ isActive: true });
    const students = await Student.find({ isActive: true }).populate('courseId');
    
    const totalAttendance = await Attendance.countDocuments();
    const totalMarks = await Marks.countDocuments();
    
    res.json({
      success: true,
      data: {
        courses,
        subjects,
        teachers,
        students,
        stats: {
          totalCourses: courses.length,
          totalSubjects: subjects.length,
          totalTeachers: teachers.length,
          totalStudents: students.length,
          totalAttendance,
          totalMarks
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete Course - Admin Only
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Access denied. Admin only.' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, msg: 'Course not found' });
    }
    
    await Course.findByIdAndUpdate(courseId, { isActive: false });
    
    // Send notification to all teachers
    await sendNotification('general', {
      sender: { id: req.user.id, role: 'admin', name: 'Administrator' },
      title: 'Course Deleted',
      message: `Course ${course.courseName} has been deleted by administrator`,
      recipients: { type: 'teachers' }
    });
    
    res.json({ success: true, msg: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete Subject - Admin Only
const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Access denied. Admin only.' });
    }
    
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, msg: 'Subject not found' });
    }
    
    await Subject.findByIdAndUpdate(subjectId, { isActive: false });
    
    // Send notification to teachers
    await sendNotification('general', {
      sender: { id: req.user.id, role: 'admin', name: 'Administrator' },
      title: 'Subject Deleted',
      message: `Subject ${subject.subjectName} has been deleted by administrator`,
      recipients: { type: 'teachers' }
    });
    
    res.json({ success: true, msg: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete Teacher - Admin Only
const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Access denied. Admin only.' });
    }
    
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, msg: 'Teacher not found' });
    }
    
    await Teacher.findByIdAndUpdate(teacherId, { isActive: false });
    
    res.json({ success: true, msg: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete Student - Admin Only
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Access denied. Admin only.' });
    }
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, msg: 'Student not found' });
    }
    
    await Student.findByIdAndUpdate(studentId, { isActive: false });
    
    res.json({ success: true, msg: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete Assignment - Admin Only
const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    console.log('Attempting to delete assignment:', assignmentId);
    
    const assignment = await Assignments.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, msg: 'Assignment not found' });
    }
    
    await Assignments.findByIdAndUpdate(assignmentId, { isActive: false });
    res.json({ success: true, msg: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete Notice - Admin Only
const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    console.log('Attempting to delete notice:', noticeId);
    
    const notice = await Notices.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ success: false, msg: 'Notice not found' });
    }
    
    await Notices.findByIdAndUpdate(noticeId, { isActive: false });
    res.json({ success: true, msg: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete Material - Admin Only
const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    console.log('Attempting to delete material:', materialId);
    
    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ success: false, msg: 'Material not found' });
    }
    
    await StudyMaterial.findByIdAndUpdate(materialId, { isActive: false });
    res.json({ success: true, msg: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Update Teacher - Admin Only
const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, email, phone } = req.body;
    
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { name, email, phone },
      { new: true }
    );
    
    res.json({ success: true, msg: 'Teacher updated successfully', teacher });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Comprehensive Attendance Report
const getComprehensiveAttendanceReport = async (req, res) => {
  try {
    const { courseId, subjectId, startDate, endDate, studentId } = req.query;
    
    // Build query
    let query = {};
    if (courseId) query.course = courseId;
    if (subjectId) query.subject = subjectId;
    if (studentId) query.student = studentId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    // Get attendance records
    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNo email')
      .populate('subject', 'subject_name subject_code')
      .populate('course', 'courseName courseCode')
      .populate('teacher', 'name')
      .sort({ date: -1, 'student.name': 1 });
    
    // Get all courses and subjects for filters
    const allCourses = await Course.find({ isActive: true }, 'courseName courseCode');
    const allSubjects = await Subject.find({}, 'subject_name subject_code');
    
    // Calculate statistics
    const studentStats = {};
    const subjectStats = {};
    const courseStats = {};
    
    attendance.forEach(record => {
      const studentId = record.student._id.toString();
      const subjectId = record.subject._id.toString();
      const courseId = record.course._id.toString();
      
      // Student statistics
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          student: record.student,
          course: record.course,
          totalClasses: 0,
          presentClasses: 0,
          absentClasses: 0,
          subjects: {}
        };
      }
      
      studentStats[studentId].totalClasses++;
      if (record.isPresent) {
        studentStats[studentId].presentClasses++;
      } else {
        studentStats[studentId].absentClasses++;
      }
      
      // Subject-wise student stats
      if (!studentStats[studentId].subjects[subjectId]) {
        studentStats[studentId].subjects[subjectId] = {
          subject: record.subject,
          total: 0,
          present: 0,
          absent: 0
        };
      }
      
      studentStats[studentId].subjects[subjectId].total++;
      if (record.isPresent) {
        studentStats[studentId].subjects[subjectId].present++;
      } else {
        studentStats[studentId].subjects[subjectId].absent++;
      }
      
      // Subject statistics
      if (!subjectStats[subjectId]) {
        subjectStats[subjectId] = {
          subject: record.subject,
          totalClasses: 0,
          totalStudents: new Set(),
          presentCount: 0,
          absentCount: 0
        };
      }
      
      subjectStats[subjectId].totalClasses++;
      subjectStats[subjectId].totalStudents.add(studentId);
      if (record.isPresent) {
        subjectStats[subjectId].presentCount++;
      } else {
        subjectStats[subjectId].absentCount++;
      }
      
      // Course statistics
      if (!courseStats[courseId]) {
        courseStats[courseId] = {
          course: record.course,
          totalClasses: 0,
          totalStudents: new Set(),
          presentCount: 0,
          absentCount: 0
        };
      }
      
      courseStats[courseId].totalClasses++;
      courseStats[courseId].totalStudents.add(studentId);
      if (record.isPresent) {
        courseStats[courseId].presentCount++;
      } else {
        courseStats[courseId].absentCount++;
      }
    });
    
    // Calculate percentages
    Object.keys(studentStats).forEach(studentId => {
      const stats = studentStats[studentId];
      stats.attendancePercentage = stats.totalClasses > 0 ? 
        ((stats.presentClasses / stats.totalClasses) * 100).toFixed(2) : 0;
      
      Object.keys(stats.subjects).forEach(subjectId => {
        const subjectStats = stats.subjects[subjectId];
        subjectStats.percentage = subjectStats.total > 0 ? 
          ((subjectStats.present / subjectStats.total) * 100).toFixed(2) : 0;
      });
    });
    
    // Convert sets to counts and calculate percentages for subject and course stats
    Object.keys(subjectStats).forEach(subjectId => {
      const stats = subjectStats[subjectId];
      stats.totalStudents = stats.totalStudents.size;
      stats.attendancePercentage = stats.totalClasses > 0 ? 
        ((stats.presentCount / (stats.presentCount + stats.absentCount)) * 100).toFixed(2) : 0;
    });
    
    Object.keys(courseStats).forEach(courseId => {
      const stats = courseStats[courseId];
      stats.totalStudents = stats.totalStudents.size;
      stats.attendancePercentage = stats.totalClasses > 0 ? 
        ((stats.presentCount / (stats.presentCount + stats.absentCount)) * 100).toFixed(2) : 0;
    });
    
    res.json({
      success: true,
      data: {
        attendance,
        studentStats: Object.values(studentStats),
        subjectStats: Object.values(subjectStats),
        courseStats: Object.values(courseStats),
        filters: {
          courses: allCourses,
          subjects: allSubjects
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  adminLogin,
  addCourse,
  addSubject,
  addTeacher,
  addStudent,
  assignTeacherToSubject,
  removeTeacherFromSubject,
  getDashboardData,
  deleteCourse,
  deleteSubject,
  deleteTeacher,
  deleteStudent,
  deleteAssignment,
  deleteNotice,
  deleteMaterial,
  updateTeacher,
  getComprehensiveAttendanceReport
};