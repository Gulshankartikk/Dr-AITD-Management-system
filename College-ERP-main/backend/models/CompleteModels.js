// Import all existing models
const Course = require('./Course');
const Subject = require('./Subject');
const Teacher = require('./Teacher');
const Student = require('./Student');
const Attendance = require('./Attendance');
const Assignment = require('./Assignment');
const Marks = require('./Marks');
const Notice = require('./Notice');
const StudyMaterial = require('./StudyMaterial');
const Message = require('./Message');
const StudentNote = require('./StudentNote');
const StudentRemark = require('./StudentRemark');
const TeacherTimetable = require('./TeacherTimetable');
const Notification = require('./Notification');

const mongoose = require('mongoose');

// Only create models that don't exist as separate files
const TeacherSubjectAssignmentSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

// Create only new models
let TeacherSubjectAssignment, Admin;
try {
  TeacherSubjectAssignment = mongoose.model('TeacherSubjectAssignment');
} catch {
  TeacherSubjectAssignment = mongoose.model('TeacherSubjectAssignment', TeacherSubjectAssignmentSchema);
}

try {
  Admin = mongoose.model('Admin');
} catch {
  Admin = mongoose.model('Admin', AdminSchema);
}

module.exports = {
  Course,
  Subject,
  Teacher,
  Student,
  TeacherSubjectAssignment,
  Attendance,
  Notes: StudentNote,
  StudyMaterial,
  Assignments: Assignment,
  Marks,
  Notices: Notice,
  Admin,
  Message,
  StudentRemark,
  TeacherTimetable,
  Notification
};