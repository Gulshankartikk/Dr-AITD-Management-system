const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  Teacher,
  Student,
  Subject,
  Course,
  TeacherSubjectAssignment,
  Attendance,
  Notes,
  StudyMaterial,
  Assignments,
  Marks,
  Notices
} = require('../models/CompleteModels');
const { sendNotification } = require('./notificationController');

// Teacher Registration
const teacherRegister = async (req, res) => {
  try {
    const { name, email, phone, password, department, designation } = req.body;
    
    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, msg: 'Teacher already exists with this email' });
    }
    
    // Generate username from email
    const username = email.split('@')[0];
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      department,
      designation
    });
    
    await teacher.save();
    
    res.status(201).json({ 
      success: true, 
      msg: 'Teacher registered successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        username: teacher.username
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Teacher Login
const teacherLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Predefined teachers
    const predefinedTeachers = {
      'gulshan': { name: 'Gulshan Kartik', email: 'gulshan@college.edu' },
      'ankita': { name: 'Ankita Maurya', email: 'ankita@college.edu' },
      'aditya': { name: 'Aditya Kumar Sharma', email: 'aditya@college.edu' },
      'abhishek': { name: 'Abhishek Gond', email: 'abhishek@college.edu' }
    };
    
    if (predefinedTeachers[username.toLowerCase()] && password === 'teacher123') {
      const teacherData = predefinedTeachers[username.toLowerCase()];
      const token = jwt.sign({ id: username, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token);
      
      return res.json({ 
        success: true, 
        token, 
        teacher: { 
          id: username, 
          name: teacherData.name, 
          email: teacherData.email,
          assignedCourse: [],
          assignedSubjects: [],
          role: 'teacher' 
        } 
      });
    }
    
    // Check for simple teacher login
    if (username === 'teacher' && password === 'teacher123') {
      const token = jwt.sign({ id: 'teacher', role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token);
      
      return res.json({ 
        success: true, 
        token, 
        teacher: { 
          id: 'teacher', 
          name: 'Demo Teacher', 
          email: 'teacher@college.edu',
          assignedCourse: [],
          assignedSubjects: [],
          role: 'teacher' 
        } 
      });
    }
    
    // Check if admin is trying to access teacher view
    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign({ id: 'admin', role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token);
      
      return res.json({ 
        success: true, 
        token, 
        teacher: { 
          id: 'admin', 
          name: 'Administrator (Teacher View)', 
          email: 'admin',
          assignedCourse: [],
          assignedSubjects: [],
          role: 'teacher' 
        } 
      });
    }
    
    // Find teacher by email or username
    const teacher = await Teacher.findOne({
      $or: [{ email: username }, { username: username }],
      isActive: true
    }).populate('assignedCourse', 'courseName courseCode')
      .populate('assignedSubjects', 'subjectName subjectCode');
    
    if (!teacher) {
      return res.status(400).json({ success: false, msg: 'Teacher not found' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token);
    
    res.json({ 
      success: true, 
      token, 
      teacher: { 
        id: teacher._id, 
        name: teacher.name, 
        email: teacher.email,
        assignedCourse: teacher.assignedCourse,
        assignedSubjects: teacher.assignedSubjects,
        role: 'teacher' 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Teacher Dashboard
const getTeacherDashboard = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    // Handle predefined teachers
    const predefinedTeachers = ['gulshan', 'ankita', 'aditya', 'abhishek'];
    if (predefinedTeachers.includes(teacherId)) {
      const teacher = await Teacher.findOne({ username: teacherId })
        .populate('assignedCourse', 'courseName courseCode')
        .populate('assignedSubjects', 'subjectName subjectCode');
      
      if (teacher) {
        const assignments = await TeacherSubjectAssignment.find({ teacherId: teacher._id, isActive: true })
          .populate('subjectId', 'subjectName subjectCode')
          .populate('courseId', 'courseName courseCode');
        
        return res.json({ success: true, teacher, assignments });
      }
    }
    
    // Handle demo teacher access
    if (teacherId === 'teacher') {
      const courses = await Course.find({ isActive: true }).limit(2);
      const subjects = await Subject.find({ isActive: true }).limit(3);
      
      return res.json({ 
        success: true, 
        teacher: {
          _id: 'teacher',
          name: 'Demo Teacher',
          email: 'teacher@college.edu',
          assignedCourse: courses,
          assignedSubjects: subjects,
          department: 'Computer Science',
          designation: 'Assistant Professor'
        }, 
        assignments: [] 
      });
    }
    
    // Handle admin access
    if (teacherId === 'admin') {
      const courses = await Course.find({ isActive: true }).limit(2);
      const subjects = await Subject.find({ isActive: true }).limit(3);
      
      return res.json({ 
        success: true, 
        teacher: {
          _id: 'admin',
          name: 'Administrator (Teacher View)',
          email: 'admin@college.edu',
          assignedCourse: courses,
          assignedSubjects: subjects,
          department: 'Administration',
          designation: 'System Administrator'
        }, 
        assignments: [] 
      });
    }
    
    const teacher = await Teacher.findById(teacherId)
      .populate('assignedCourse', 'courseName courseCode')
      .populate('assignedSubjects', 'subjectName subjectCode');
    
    if (!teacher) {
      return res.status(404).json({ success: false, msg: 'Teacher not found' });
    }
    
    const assignments = await TeacherSubjectAssignment.find({ teacherId, isActive: true })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('courseId', 'courseName courseCode');
    
    res.json({ success: true, teacher, assignments });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Students by Subject
const getStudentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const subject = await Subject.findById(subjectId).populate('courseId');
    const students = await Student.find({ courseId: subject.courseId, isActive: true });
    
    res.json({ success: true, students, subject });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjectId, date, attendance } = req.body;
    
    // Handle admin access
    const actualTeacherId = teacherId === 'admin' ? 'admin' : teacherId;
    
    // Delete existing attendance for the date
    await Attendance.deleteMany({ subjectId, teacherId: actualTeacherId, date });
    
    // Create new attendance records
    const attendanceRecords = attendance.map(record => ({
      studentId: record.studentId,
      subjectId,
      teacherId: actualTeacherId,
      date,
      status: record.status
    }));
    
    const savedRecords = await Attendance.insertMany(attendanceRecords);
    
    res.json({ success: true, msg: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Detailed Attendance Report
const getAttendanceReport = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjectId, courseId, startDate, endDate } = req.query;
    
    // Get teacher's assigned subjects and courses
    const teacher = await Teacher.findById(teacherId).populate('assignedSubjects assignedCourse');
    
    let query = { teacherId };
    if (subjectId) query.subjectId = subjectId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const attendance = await Attendance.find(query)
      .populate('studentId', 'name rollNo email courseId')
      .populate('subjectId', 'subjectName subjectCode courseId')
      .populate({ path: 'studentId', populate: { path: 'courseId', select: 'courseName courseCode' } })
      .sort({ date: -1 });
    
    // Calculate attendance statistics
    const studentStats = {};
    attendance.forEach(record => {
      const studentId = record.studentId._id.toString();
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          student: record.studentId,
          totalClasses: 0,
          presentClasses: 0,
          absentClasses: 0,
          subjects: {}
        };
      }
      
      const subjectId = record.subjectId._id.toString();
      if (!studentStats[studentId].subjects[subjectId]) {
        studentStats[studentId].subjects[subjectId] = {
          subject: record.subjectId,
          total: 0,
          present: 0,
          absent: 0
        };
      }
      
      studentStats[studentId].totalClasses++;
      studentStats[studentId].subjects[subjectId].total++;
      
      if (record.status === 'Present') {
        studentStats[studentId].presentClasses++;
        studentStats[studentId].subjects[subjectId].present++;
      } else {
        studentStats[studentId].absentClasses++;
        studentStats[studentId].subjects[subjectId].absent++;
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
    
    res.json({ 
      success: true, 
      attendance, 
      studentStats: Object.values(studentStats),
      teacher: {
        assignedSubjects: teacher.assignedSubjects,
        assignedCourses: teacher.assignedCourse
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Marks
const addMarks = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { studentId, subjectId, marks, totalMarks, examType } = req.body;
    
    const markRecord = new Marks({ studentId, subjectId, teacherId, marks, totalMarks, examType });
    await markRecord.save();
    
    // Get teacher and subject details for notification
    const teacher = await Teacher.findById(teacherId);
    const subject = await Subject.findById(subjectId);
    
    // Send notification to specific student
    await sendNotification('marks', {
      sender: { id: teacherId, role: 'teacher', name: teacher.name },
      subjectName: subject.subjectName,
      studentId,
      entityId: markRecord._id
    });
    
    res.status(201).json({ success: true, msg: 'Marks added successfully', markRecord });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get All Students Marks by Subject
const getAllStudentsMarks = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjectId } = req.query;
    
    // Get all students for the subject's course
    const subject = await Subject.findById(subjectId);
    const students = await Student.find({ courseId: subject.courseId, isActive: true });
    
    // Get marks for all students in this subject
    const marks = await Marks.find({ subjectId, teacherId })
      .populate('studentId', 'name rollNo email')
      .sort({ examType: 1, createdAt: -1 });
    
    // Organize marks by student and exam type
    const studentMarks = {};
    students.forEach(student => {
      studentMarks[student._id] = {
        student,
        marks: {},
        totalMarks: 0,
        totalPossible: 0,
        percentage: 0
      };
    });
    
    marks.forEach(mark => {
      const studentId = mark.studentId._id.toString();
      if (studentMarks[studentId]) {
        if (!studentMarks[studentId].marks[mark.examType]) {
          studentMarks[studentId].marks[mark.examType] = [];
        }
        studentMarks[studentId].marks[mark.examType].push(mark);
        studentMarks[studentId].totalMarks += mark.marks;
        studentMarks[studentId].totalPossible += mark.totalMarks;
      }
    });
    
    // Calculate percentages
    Object.keys(studentMarks).forEach(studentId => {
      const data = studentMarks[studentId];
      data.percentage = data.totalPossible > 0 ? 
        ((data.totalMarks / data.totalPossible) * 100).toFixed(2) : 0;
    });
    
    res.json({ 
      success: true, 
      studentMarks: Object.values(studentMarks),
      subject
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Notes
const addNotes = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjectId, title, description } = req.body;
    
    let fileUrl = null;
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    const note = new Notes({ teacherId, subjectId, title, fileUrl, description });
    await note.save();
    
    res.status(201).json({ success: true, msg: 'Note added successfully', note });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Study Material
const addStudyMaterial = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjectId, title, description, fileUrl } = req.body;
    
    if (!title || !subjectId) {
      return res.status(400).json({ success: false, msg: 'Title and subject are required' });
    }
    
    // Handle admin access
    const actualTeacherId = teacherId === 'admin' ? 'admin' : teacherId;
    
    let materialFileUrl = fileUrl;
    if (req.file) {
      materialFileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    if (!materialFileUrl) {
      return res.status(400).json({ success: false, msg: 'Please provide a file or file URL' });
    }
    
    const material = new StudyMaterial({ teacherId: actualTeacherId, subjectId, title, fileUrl: materialFileUrl, description });
    await material.save();
    
    // Get teacher and subject details for notification
    const teacher = actualTeacherId === 'admin' ? { name: 'Administrator' } : await Teacher.findById(actualTeacherId);
    const subject = await Subject.findById(subjectId).populate('courseId');
    
    // Send notification to students
    await sendNotification('material', {
      sender: { id: actualTeacherId, role: 'teacher', name: teacher.name },
      title,
      courseId: subject.courseId._id,
      subjectId,
      entityId: material._id
    });
    
    res.status(201).json({ success: true, msg: 'Study material added successfully', material });
  } catch (error) {
    console.error('Add material error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Assignment
const addAssignment = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjectId, title, description, deadline, fileUrl } = req.body;
    
    if (!title || !subjectId || !deadline) {
      return res.status(400).json({ success: false, msg: 'Title, subject, and deadline are required' });
    }
    
    // Handle admin access
    const actualTeacherId = teacherId === 'admin' ? 'admin' : teacherId;
    
    let assignmentFileUrl = fileUrl || null;
    if (req.file) {
      assignmentFileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    const assignment = new Assignments({ teacherId: actualTeacherId, subjectId, title, description, deadline, fileUrl: assignmentFileUrl });
    await assignment.save();
    
    // Get teacher and subject details for notification
    const teacher = actualTeacherId === 'admin' ? { name: 'Administrator' } : await Teacher.findById(actualTeacherId);
    const subject = await Subject.findById(subjectId).populate('courseId');
    
    // Send notification to students
    await sendNotification('assignment', {
      sender: { id: actualTeacherId, role: 'teacher', name: teacher.name },
      title,
      courseId: subject.courseId._id,
      subjectId,
      entityId: assignment._id
    });
    
    res.status(201).json({ success: true, msg: 'Assignment added successfully', assignment });
  } catch (error) {
    console.error('Add assignment error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Notice
const addNotice = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { courseId, title, description } = req.body;
    
    if (!title || !description || !courseId) {
      return res.status(400).json({ success: false, msg: 'Title, description, and course are required' });
    }
    
    // Handle admin access
    const actualTeacherId = teacherId === 'admin' ? 'admin' : teacherId;
    
    const notice = new Notices({ teacherId: actualTeacherId, courseId, title, description });
    await notice.save();
    
    // Get teacher details for notification
    const teacher = actualTeacherId === 'admin' ? { name: 'Administrator' } : await Teacher.findById(actualTeacherId);
    
    // Send notification to students
    await sendNotification('notice', {
      sender: { id: actualTeacherId, role: 'teacher', name: teacher.name },
      title,
      courseId,
      entityId: notice._id
    });
    
    res.status(201).json({ success: true, msg: 'Notice added successfully', notice });
  } catch (error) {
    console.error('Add notice error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Teacher's Notes
const getTeacherNotes = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const notes = await Notes.find({ teacherId }).populate('subjectId', 'subjectName');
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Teacher's Study Materials
const getTeacherMaterials = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const materials = await StudyMaterial.find({ teacherId }).populate('subjectId', 'subjectName');
    res.json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get Teacher's Assignments with Submissions
const getTeacherAssignments = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjectId } = req.query;
    
    let query = { teacherId };
    if (subjectId) query.subjectId = subjectId;
    
    const assignments = await Assignments.find(query)
      .populate('subjectId', 'subjectName subjectCode courseId')
      .populate({
        path: 'submissions.studentId',
        select: 'name rollNo email'
      })
      .sort({ deadline: -1 });
    
    // Get all students for each subject to show who hasn't submitted
    const assignmentsWithDetails = await Promise.all(assignments.map(async (assignment) => {
      const subject = await Subject.findById(assignment.subjectId._id);
      const allStudents = await Student.find({ courseId: subject.courseId, isActive: true });
      
      const submittedStudentIds = assignment.submissions.map(sub => sub.studentId._id.toString());
      const notSubmitted = allStudents.filter(student => 
        !submittedStudentIds.includes(student._id.toString())
      );
      
      return {
        ...assignment.toObject(),
        totalStudents: allStudents.length,
        submittedCount: assignment.submissions.length,
        pendingCount: notSubmitted.length,
        notSubmittedStudents: notSubmitted
      };
    }));
    
    res.json({ success: true, assignments: assignmentsWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Course - Teacher
const addCourse = async (req, res) => {
  try {
    const { courseName, courseCode, courseDuration } = req.body;
    
    const course = new Course({ courseName, courseCode, courseDuration });
    await course.save();
    
    res.status(201).json({ success: true, msg: 'Course added successfully', course });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Add Subject - Teacher
const addSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, courseId } = req.body;
    
    const subject = new Subject({ subjectName, subjectCode, courseId });
    await subject.save();
    
    res.status(201).json({ success: true, msg: 'Subject added successfully', subject });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get All Notices for Teacher's Courses
const getTeacherNotices = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const teacher = await Teacher.findById(teacherId);
    const notices = await Notices.find({ 
      teacherId,
      isActive: true 
    })
    .populate('courseId', 'courseName courseCode')
    .sort({ createdAt: -1 });
    
    // Get student count for each notice
    const noticesWithStudentCount = await Promise.all(notices.map(async (notice) => {
      const studentCount = await Student.countDocuments({ 
        courseId: notice.courseId._id, 
        isActive: true 
      });
      
      return {
        ...notice.toObject(),
        studentCount
      };
    }));
    
    res.json({ success: true, notices: noticesWithStudentCount });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  teacherRegister,
  teacherLogin,
  getTeacherDashboard,
  getStudentsBySubject,
  markAttendance,
  getAttendanceReport,
  addMarks,
  getAllStudentsMarks,
  addNotes,
  addStudyMaterial,
  addAssignment,
  addNotice,
  addCourse,
  addSubject,
  getTeacherNotes,
  getTeacherMaterials,
  getTeacherAssignments,
  getTeacherNotices
};