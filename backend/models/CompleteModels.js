const mongoose = require('mongoose');

// Course Schema
const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  courseDuration: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Subject Schema
// const SubjectSchema = new mongoose.Schema({
//   subjectName: { type: String, required: true },
//   subjectCode: { type: String, required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// Subject Schema
const SubjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },

  subjectType: {
    type: String,
    enum: ["Theory", "Practical", "Lab"],
    default: "Theory"
  },

  credits: { type: Number, default: 0 },

  semester: { type: Number, required: true },

  branch: { type: String, required: true },

  isElective: { type: Boolean, default: false },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    default: null
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: null
  },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });


// Teacher Schema
const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  phone: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  profilePhoto: { type: String }, // URL to photo

  // Professional
  employeeId: { type: String, unique: true, sparse: true },
  department: { type: String },
  designation: { type: String },
  qualifications: { type: String }, // e.g., "M.Tech, PhD"
  specialization: { type: String },
  experience: { type: Number, default: 0 }, // Years
  researchInterests: { type: String }, // Comma separated or description
  joinDate: { type: Date },
  cvUrl: { type: String },

  // Responsibilities
  assignedCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],

  otp: { type: String },
  otpExpiry: { type: Date },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Student Schema
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },

  // Academic
  rollNo: { type: String, required: true, unique: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  branch: { type: String },
  semester: { type: Number },
  section: { type: String },

  // Personal
  phone: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  profilePhoto: { type: String },

  // Additional
  hostelInfo: { type: String }, // e.g., "Block A, Room 101"
  transportInfo: { type: String }, // e.g., "Bus Route 5"

  cvUrl: { type: String },
  achievements: [{ type: String }],

  isDemo: { type: Boolean, default: false },
  passwordChanged: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Attendance Schema
const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: mongoose.Schema.Types.Mixed, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true }
}, { timestamps: true });

// Assignment Schema
const AssignmentSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.Mixed, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  maxMarks: { type: Number },
  submissionType: { type: String, enum: ['online', 'offline'], default: 'online' },
  files: [{
    name: String,
    url: String,
    type: String
  }],
  fileUrl: { type: String }, // Legacy support
  isActive: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: true },
  tags: [String],
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    submissionDate: { type: Date, default: Date.now },
    files: [{ name: String, url: String }],
    fileUrl: { type: String }, // Legacy support
    remarks: { type: String },
    marksObtained: { type: Number }
  }]
}, { timestamps: true });

// Learning Resource Schema (Unified)
const LearningResourceSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.Mixed, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    required: true,
    enum: ['lecture_note', 'video', 'syllabus', 'reference_book', 'paper', 'other']
  },
  files: [{
    name: String,
    url: String,
    size: Number,
    fileType: String
  }],
  links: [{
    title: String,
    url: String
  }],
  tags: [String],
  version: { type: Number, default: 1 },
  isPublished: { type: Boolean, default: true },
  releaseDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Marks Schema
const MarksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: mongoose.Schema.Types.Mixed, required: true },
  marks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  examType: { type: String, required: true }
}, { timestamps: true });

// Notice Schema
const NoticeSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.Mixed, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Study Material Schema
const StudyMaterialSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.Mixed, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Notes Schema
const NotesSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.Mixed, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Teacher Subject Assignment Schema
const TeacherSubjectAssignmentSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Admin Schema
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userRole: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  entityType: { type: String }
}, { timestamps: true });

const bcrypt = require('bcrypt');

// ... (previous schemas)

// Pre-save hook for Student
StudentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save hook for Teacher
TeacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save hook for Admin
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create models
const Course = mongoose.model('Course', CourseSchema);
const Subject = mongoose.model('Subject', SubjectSchema);
const Teacher = mongoose.model('Teacher', TeacherSchema);
const Student = mongoose.model('Student', StudentSchema);
const Attendance = mongoose.model('Attendance', AttendanceSchema);
const Assignments = mongoose.model('Assignment', AssignmentSchema);
const Marks = mongoose.model('Marks', MarksSchema);
const Notices = mongoose.model('Notice', NoticeSchema);
const StudyMaterial = mongoose.model('StudyMaterial', StudyMaterialSchema);
const Notes = mongoose.model('Notes', NotesSchema);
const TeacherSubjectAssignment = mongoose.model('TeacherSubjectAssignment', TeacherSubjectAssignmentSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

// Timetable Schema
const TimetableSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true },
  day: { type: String, required: true }, // Monday, Tuesday...
  timeSlot: { type: String, required: true }, // 9:00-10:00
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  roomNo: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Leave Schema
const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userRole: { type: String, enum: ['student', 'teacher'], required: true },
  leaveType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Fee Schema
const FeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue', 'Partial'], default: 'Pending' },
  transactions: [{
    amount: { type: Number },
    date: { type: Date, default: Date.now },
    method: { type: String },
    transactionId: { type: String }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Manual Report Schema
const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // Academic, Administrative, Other
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Library Schema
const LibrarySchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true, sparse: true },
  category: { type: String },
  quantity: { type: Number, default: 1 },
  remaining: { type: Number, default: 1 },
  issuedTo: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Timetable = mongoose.model('Timetable', TimetableSchema);
const Leave = mongoose.model('Leave', LeaveSchema);
const Fee = mongoose.model('Fee', FeeSchema);
const Report = mongoose.model('Report', ReportSchema);
const Library = mongoose.model('Library', LibrarySchema);

const LearningResource = mongoose.model('LearningResource', LearningResourceSchema);

module.exports = {
  Course,
  Subject,
  Teacher,
  Student,
  TeacherSubjectAssignment,
  Attendance,
  Notes,
  StudyMaterial,
  Assignments,
  Marks,
  Notices,
  Admin,
  Notification,
  Timetable,
  Leave,
  Fee,
  Report,
  Library,
  LearningResource
};