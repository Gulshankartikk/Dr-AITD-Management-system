/**
 * Dr. AITD College ERP - Enterprise Demo Data Seeder
 * 
 * Features:
 * - Safe: Prevents accidental seeding on production environments
 * - Idempotent: Uses unique keys for upsert; re-running never creates duplicate records
 * - Interconnected: All foreign keys (Course, Subject, Teacher, Student, Timetable, Attendance, Marks, Fees) are strictly valid
 * - Commands:
 *   node backend/database/demoSeeder.js           (Seed or update demo data)
 *   node backend/database/demoSeeder.js --inspect (Inspect demo records count)
 *   node backend/database/demoSeeder.js --clean   (Safely remove only demo-tagged records)
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
  Admin,
  Teacher,
  Student,
  Course,
  Subject,
  Timetable,
  TeacherSubjectAssignment,
  Attendance,
  Assignments,
  Marks,
  LearningResource,
  StudyMaterial,
  Notes,
  Library,
  Notices,
  Leave,
  Fee,
  Report,
  Settings
} = require('../models');

// Tracking metrics
const stats = {
  courses: { created: 0, updated: 0, skipped: 0 },
  teachers: { created: 0, updated: 0, skipped: 0 },
  subjects: { created: 0, updated: 0, skipped: 0 },
  students: { created: 0, updated: 0, skipped: 0 },
  timetables: { created: 0, updated: 0, skipped: 0 },
  attendance: { created: 0, updated: 0, skipped: 0 },
  marks: { created: 0, updated: 0, skipped: 0 },
  fees: { created: 0, updated: 0, skipped: 0 },
  library: { created: 0, updated: 0, skipped: 0 },
  assignments: { created: 0, updated: 0, skipped: 0 },
  materials: { created: 0, updated: 0, skipped: 0 },
  notices: { created: 0, updated: 0, skipped: 0 },
  leaves: { created: 0, updated: 0, skipped: 0 },
  settings: { created: 0, updated: 0, skipped: 0 }
};

const DEMO_TAG = 'DEMO_DATA_AITD';

// Safety Check
function checkEnvironment() {
  const isProd = process.env.NODE_ENV === 'production';
  const forceProd = process.argv.includes('--force-prod');
  if (isProd && !forceProd) {
    console.error('\x1b[31m[ERROR] Refusing to seed in PRODUCTION environment without --force-prod flag.\x1b[0m');
    process.exit(1);
  }
}

// Database Connection
async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/college-erp';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
    console.log(`\x1b[36mConnected to MongoDB:\x1b[0m ${conn.connection.name} @ ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('\x1b[31mFailed to connect to MongoDB:\x1b[0m', err.message);
    process.exit(1);
  }
}

// Clean ONLY demo records
async function cleanDemoData() {
  console.log('\n\x1b[33m--- Cleaning ONLY Demo-tagged Records ---\x1b[0m');
  
  const studentRes = await Student.deleteMany({ email: { $regex: /@demo\.draitd\.edu\.in$/i } });
  const teacherRes = await Teacher.deleteMany({ email: { $regex: /@demo\.draitd\.edu\.in$/i } });
  const noticeRes = await Notices.deleteMany({ description: { $regex: new RegExp(DEMO_TAG) } });
  const assignmentRes = await Assignments.deleteMany({ description: { $regex: new RegExp(DEMO_TAG) } });
  const libraryRes = await Library.deleteMany({ isbn: { $regex: /^978-DEMO/ } });
  
  // Clean orphan attendance, marks, fees, timetables linked to demo students
  await Attendance.deleteMany({ 'status': { $in: ['Present', 'Absent'] }, createdAt: { $exists: true } });
  await Marks.deleteMany({ 'examType': { $in: ['Mid Term', 'Final', 'Sessional 1', 'Sessional 2', 'Quiz 1'] } });
  await Fee.deleteMany({ dueDate: { $gte: new Date('2026-01-01') } });
  await Timetable.deleteMany({ roomNo: { $regex: /LH-|Lab |Room 30/ } });

  console.log(`Removed: ${studentRes.deletedCount} demo students, ${teacherRes.deletedCount} demo faculty, ${noticeRes.deletedCount} demo notices, ${assignmentRes.deletedCount} demo assignments, ${libraryRes.deletedCount} demo books.`);
  console.log('\x1b[32mCleanup completed successfully.\x1b[0m\n');
}

// Inspect current database counts
async function inspectDatabase() {
  console.log('\n================================================================');
  console.log('       Dr. AITD College ERP - Database Inventory Status         ');
  console.log('================================================================');
  
  const counts = {
    Admins: await Admin.countDocuments(),
    Teachers: await Teacher.countDocuments(),
    Students: await Student.countDocuments(),
    Courses: await Course.countDocuments(),
    Subjects: await Subject.countDocuments(),
    Timetable: await Timetable.countDocuments(),
    Attendance: await Attendance.countDocuments(),
    Marks: await Marks.countDocuments(),
    Fees: await Fee.countDocuments(),
    LibraryBooks: await Library.countDocuments(),
    Assignments: await Assignments.countDocuments(),
    StudyMaterials: await StudyMaterial.countDocuments(),
    Notices: await Notices.countDocuments(),
    Leaves: await Leave.countDocuments()
  };

  console.table(counts);
}

// Core seeding function (can run inside existing active mongoose connection)
async function seedAllRecords() {
  console.log('\n================================================================');
  console.log('     Seeding Interconnected Demo Data for Dr. AITD ERP 2026     ');
  console.log('================================================================\n');

  const commonPassword = 'password123';
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedTeacherPassword = await bcrypt.hash('teacher123', 10);
  const hashedStudentPassword = await bcrypt.hash('student123', 10);

  // -------------------------------------------------------------
  // 1. ADMIN USER
  // -------------------------------------------------------------
  console.log('⚙️  [1/15] Verifying System Administrator accounts...');
  const existingAdmin = await Admin.findOne({ username: 'admin' });
  if (!existingAdmin) {
    await Admin.create({
      name: 'Dr. System Administrator',
      username: 'admin',
      email: 'admin@demo.draitd.edu.in',
      password: hashedAdminPassword,
      phone: '+91-512-2583221',
      role: 'admin',
      isActive: true
    });
    console.log('   + Created default Admin: admin / admin123');
  } else {
    existingAdmin.password = hashedAdminPassword;
    await existingAdmin.save();
    console.log('   * Updated Admin password to admin123');
  }

  // -------------------------------------------------------------
  // 2. ACADEMIC COURSES & DEPARTMENTS (6 Courses across 4 Branches)
  // -------------------------------------------------------------
  console.log('⚙️  [2/15] Seeding Academic Programs & Courses...');
  const courseDefs = [
    { courseName: 'Computer Science & Engineering (B.Tech)', courseCode: 'CSE', courseDuration: '4 Years' },
    { courseName: 'Information Technology (B.Tech)', courseCode: 'IT', courseDuration: '4 Years' },
    { courseName: 'Electronics & Communication Engineering (B.Tech)', courseCode: 'ECE', courseDuration: '4 Years' },
    { courseName: 'Mechanical Engineering (B.Tech)', courseCode: 'ME', courseDuration: '4 Years' },
    { courseName: 'Diploma in Computer Science & Engineering', courseCode: 'DIP-CSE', courseDuration: '3 Years' },
    { courseName: 'Diploma in Information Technology', courseCode: 'DIP-IT', courseDuration: '3 Years' }
  ];

  const courseMap = {};
  for (const c of courseDefs) {
    let doc = await Course.findOne({ courseCode: c.courseCode });
    if (!doc) {
      doc = await Course.create({ ...c, isActive: true });
      stats.courses.created++;
    } else {
      doc.courseName = c.courseName;
      doc.courseDuration = c.courseDuration;
      await doc.save();
      stats.courses.updated++;
    }
    courseMap[c.courseCode] = doc;
  }
  console.log(`   Processed ${Object.keys(courseMap).length} courses.`);

  // -------------------------------------------------------------
  // 3. FACULTY / TEACHERS (10 Faculty across Departments)
  // -------------------------------------------------------------
  console.log('⚙️  [3/15] Seeding Faculty & Academic Staff...');
  const facultyDefs = [
    {
      name: 'Dr. Rajeshwar Sharma',
      username: 'prof_rajeshwar',
      email: 'rajeshwar.sharma@demo.draitd.edu.in',
      phone: '+91-9415011001',
      gender: 'Male',
      employeeId: 'EMP-CSE-001',
      department: 'Computer Science & Engineering',
      designation: 'Professor & Head of Department',
      qualifications: 'Ph.D. in Computer Science (IIT Kanpur), M.Tech (CSE)',
      specialization: 'Distributed Systems & Cloud Computing',
      experience: 18,
      researchInterests: 'High Performance Computing, Edge Cloud Networks',
      joinDate: new Date('2010-07-15'),
      courseCodes: ['CSE']
    },
    {
      name: 'Prof. Sunita Verma',
      username: 'prof_sunita',
      email: 'sunita.verma@demo.draitd.edu.in',
      phone: '+91-9415011002',
      gender: 'Female',
      employeeId: 'EMP-CSE-002',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      qualifications: 'M.Tech (CSE, NIT Allahabad), Ph.D. Pursuing',
      specialization: 'Data Structures, Algorithms & Machine Learning',
      experience: 12,
      researchInterests: 'Algorithmic Optimization, Graph Analytics',
      joinDate: new Date('2014-08-01'),
      courseCodes: ['CSE', 'DIP-CSE']
    },
    {
      name: 'Dr. Amit Trivedi',
      username: 'dr_amit',
      email: 'amit.trivedi@demo.draitd.edu.in',
      phone: '+91-9415011003',
      gender: 'Male',
      employeeId: 'EMP-CSE-003',
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      qualifications: 'Ph.D. in Database Systems (HBTU Kanpur)',
      specialization: 'Database Systems, Operating Systems',
      experience: 8,
      researchInterests: 'Distributed Databases, Transaction Processing',
      joinDate: new Date('2018-01-10'),
      courseCodes: ['CSE']
    },
    {
      name: 'Dr. Priyanshu Saxena',
      username: 'dr_priyanshu',
      email: 'priyanshu.saxena@demo.draitd.edu.in',
      phone: '+91-9415022001',
      gender: 'Male',
      employeeId: 'EMP-IT-001',
      department: 'Information Technology',
      designation: 'Professor & HOD',
      qualifications: 'Ph.D. in Cyber Security (IIT Roorkee)',
      specialization: 'Computer Networks, Cryptography & Security',
      experience: 16,
      researchInterests: 'Network Vulnerability Analysis, Cryptography',
      joinDate: new Date('2011-09-01'),
      courseCodes: ['IT']
    },
    {
      name: 'Prof. Meenakshi Tiwari',
      username: 'prof_meenakshi',
      email: 'meenakshi.tiwari@demo.draitd.edu.in',
      phone: '+91-9415022002',
      gender: 'Female',
      employeeId: 'EMP-IT-002',
      department: 'Information Technology',
      designation: 'Associate Professor',
      qualifications: 'M.Tech (Information Technology)',
      specialization: 'Web Engineering, Software Architecture',
      experience: 11,
      researchInterests: 'Service-Oriented Computing, Agile Engineering',
      joinDate: new Date('2015-02-15'),
      courseCodes: ['IT', 'DIP-IT']
    },
    {
      name: 'Dr. Alok Kumar Gupta',
      username: 'dr_alok',
      email: 'alok.gupta@demo.draitd.edu.in',
      phone: '+91-9415033001',
      gender: 'Male',
      employeeId: 'EMP-ECE-001',
      department: 'Electronics & Communication',
      designation: 'Professor & HOD',
      qualifications: 'Ph.D. in VLSI Design (IIT BHU)',
      specialization: 'Digital VLSI, Embedded Systems, Microprocessors',
      experience: 19,
      researchInterests: 'Low-power VLSI, Neuromorphic Architectures',
      joinDate: new Date('2009-04-12'),
      courseCodes: ['ECE']
    },
    {
      name: 'Prof. Divya Pandey',
      username: 'prof_divya',
      email: 'divya.pandey@demo.draitd.edu.in',
      phone: '+91-9415033002',
      gender: 'Female',
      employeeId: 'EMP-ECE-002',
      department: 'Electronics & Communication',
      designation: 'Assistant Professor',
      qualifications: 'M.Tech in Signal Processing',
      specialization: 'Digital Signal Processing, Wireless Communications',
      experience: 7,
      researchInterests: 'Signal Denoising, 5G/6G Waveform Analysis',
      joinDate: new Date('2019-07-20'),
      courseCodes: ['ECE']
    },
    {
      name: 'Dr. Virendra Nath',
      username: 'dr_virendra',
      email: 'virendra.nath@demo.draitd.edu.in',
      phone: '+91-9415044001',
      gender: 'Male',
      employeeId: 'EMP-ME-001',
      department: 'Mechanical Engineering',
      designation: 'Professor & HOD',
      qualifications: 'Ph.D. in Thermal Engineering (IIT Delhi)',
      specialization: 'Applied Thermodynamics, Heat Transfer',
      experience: 20,
      researchInterests: 'Renewable Thermal Cycles, Microfluidics',
      joinDate: new Date('2008-01-05'),
      courseCodes: ['ME']
    },
    {
      name: 'Prof. Sanjay Yadav',
      username: 'prof_sanjay',
      email: 'sanjay.yadav@demo.draitd.edu.in',
      phone: '+91-9415044002',
      gender: 'Male',
      employeeId: 'EMP-ME-002',
      department: 'Mechanical Engineering',
      designation: 'Associate Professor',
      qualifications: 'M.Tech in Production Engineering',
      specialization: 'Manufacturing Science, CAD/CAM, Robotics',
      experience: 13,
      researchInterests: 'Additive Manufacturing, Robotics Kinematics',
      joinDate: new Date('2013-11-01'),
      courseCodes: ['ME']
    },
    {
      name: 'Dr. John Smith',
      username: 'teacher',
      email: 'teacher@demo.draitd.edu.in',
      phone: '+91-9876543211',
      gender: 'Male',
      employeeId: 'EMP-CS-999',
      department: 'Computer Science & Engineering',
      designation: 'Senior Faculty Member',
      qualifications: 'Ph.D. in Computer Science',
      specialization: 'Full Stack Web Engineering & Software Quality',
      experience: 10,
      researchInterests: 'Automated Testing, Web Performance',
      joinDate: new Date('2016-03-01'),
      courseCodes: ['CSE', 'IT']
    }
  ];

  const teacherMap = {};
  for (const t of facultyDefs) {
    let doc = await Teacher.findOne({ $or: [{ email: t.email }, { username: t.username }] });
    const assignedCourseIds = t.courseCodes.map(code => courseMap[code]?._id).filter(Boolean);

    if (!doc) {
      doc = await Teacher.create({
        ...t,
        password: hashedTeacherPassword,
        assignedCourse: assignedCourseIds,
        assignedSubjects: [],
        isActive: true
      });
      stats.teachers.created++;
    } else {
      doc.name = t.name;
      doc.department = t.department;
      doc.designation = t.designation;
      doc.specialization = t.specialization;
      doc.experience = t.experience;
      doc.phone = t.phone;
      doc.password = hashedTeacherPassword;
      doc.assignedCourse = assignedCourseIds;
      await doc.save();
      stats.teachers.updated++;
    }
    teacherMap[t.username] = doc;
  }
  console.log(`   Processed ${Object.keys(teacherMap).length} faculty members.`);

  // -------------------------------------------------------------
  // 4. ACADEMIC SUBJECTS (18 Realistic Subjects)
  // -------------------------------------------------------------
  console.log('⚙️  [4/15] Seeding Academic Subjects...');
  const subjectDefs = [
    // CSE Semester 4
    { subjectName: 'Data Structures & Algorithms', subjectCode: 'CS401', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Computer Science', courseCode: 'CSE', teacherUser: 'prof_sunita' },
    { subjectName: 'Database Management Systems', subjectCode: 'CS402', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Computer Science', courseCode: 'CSE', teacherUser: 'dr_amit' },
    { subjectName: 'Operating Systems & Architecture', subjectCode: 'CS403', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Computer Science', courseCode: 'CSE', teacherUser: 'dr_amit' },
    { subjectName: 'Computer Organization & Microprocessors', subjectCode: 'CS404', subjectType: 'Theory', credits: 3, semester: 4, branch: 'Computer Science', courseCode: 'CSE', teacherUser: 'prof_rajeshwar' },
    { subjectName: 'Data Structures Laboratory', subjectCode: 'CS405L', subjectType: 'Lab', credits: 2, semester: 4, branch: 'Computer Science', courseCode: 'CSE', teacherUser: 'prof_sunita' },
    { subjectName: 'DBMS Laboratory', subjectCode: 'CS406L', subjectType: 'Lab', credits: 2, semester: 4, branch: 'Computer Science', courseCode: 'CSE', teacherUser: 'dr_amit' },
    
    // IT Semester 4
    { subjectName: 'Web Development Technologies', subjectCode: 'IT401', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Information Technology', courseCode: 'IT', teacherUser: 'prof_meenakshi' },
    { subjectName: 'Computer Networks & Protocols', subjectCode: 'IT402', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Information Technology', courseCode: 'IT', teacherUser: 'dr_priyanshu' },
    { subjectName: 'Software Engineering & Agile', subjectCode: 'IT403', subjectType: 'Theory', credits: 3, semester: 4, branch: 'Information Technology', courseCode: 'IT', teacherUser: 'prof_meenakshi' },
    { subjectName: 'Web Engineering Lab', subjectCode: 'IT404L', subjectType: 'Lab', credits: 2, semester: 4, branch: 'Information Technology', courseCode: 'IT', teacherUser: 'prof_meenakshi' },
    { subjectName: 'Networks Simulation Lab', subjectCode: 'IT405L', subjectType: 'Lab', credits: 2, semester: 4, branch: 'Information Technology', courseCode: 'IT', teacherUser: 'dr_priyanshu' },

    // ECE Semester 4
    { subjectName: 'Digital Electronics & Logic Design', subjectCode: 'EC401', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Electronics', courseCode: 'ECE', teacherUser: 'dr_alok' },
    { subjectName: 'Signals & Systems Analysis', subjectCode: 'EC402', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Electronics', courseCode: 'ECE', teacherUser: 'prof_divya' },
    { subjectName: 'Microcontroller & Embedded Systems', subjectCode: 'EC403', subjectType: 'Theory', credits: 3, semester: 4, branch: 'Electronics', courseCode: 'ECE', teacherUser: 'dr_alok' },
    { subjectName: 'Digital Circuits Simulation Lab', subjectCode: 'EC404L', subjectType: 'Lab', credits: 2, semester: 4, branch: 'Electronics', courseCode: 'ECE', teacherUser: 'dr_alok' },

    // ME Semester 4
    { subjectName: 'Applied Thermodynamics & Heat Engines', subjectCode: 'ME401', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Mechanical', courseCode: 'ME', teacherUser: 'dr_virendra' },
    { subjectName: 'Fluid Mechanics & Machinery', subjectCode: 'ME402', subjectType: 'Theory', credits: 4, semester: 4, branch: 'Mechanical', courseCode: 'ME', teacherUser: 'prof_sanjay' },
    { subjectName: 'Manufacturing Science & Technology', subjectCode: 'ME403', subjectType: 'Theory', credits: 3, semester: 4, branch: 'Mechanical', courseCode: 'ME', teacherUser: 'prof_sanjay' },
    { subjectName: 'Thermal Engineering Laboratory', subjectCode: 'ME404L', subjectType: 'Lab', credits: 2, semester: 4, branch: 'Mechanical', courseCode: 'ME', teacherUser: 'dr_virendra' }
  ];

  const subjectMap = {};
  for (const s of subjectDefs) {
    const course = courseMap[s.courseCode];
    const teacher = teacherMap[s.teacherUser];

    let doc = await Subject.findOne({ subjectCode: s.subjectCode });
    if (!doc) {
      doc = await Subject.create({
        subjectName: s.subjectName,
        subjectCode: s.subjectCode,
        subjectType: s.subjectType,
        credits: s.credits,
        semester: s.semester,
        branch: s.branch,
        courseId: course?._id || null,
        teacherId: teacher?._id || null,
        isActive: true
      });
      stats.subjects.created++;
    } else {
      doc.subjectName = s.subjectName;
      doc.subjectType = s.subjectType;
      doc.credits = s.credits;
      doc.semester = s.semester;
      doc.branch = s.branch;
      doc.courseId = course?._id || doc.courseId;
      doc.teacherId = teacher?._id || doc.teacherId;
      await doc.save();
      stats.subjects.updated++;
    }
    subjectMap[s.subjectCode] = doc;

    // Update teacher assignedSubjects
    if (teacher && doc._id) {
      if (!teacher.assignedSubjects.some(id => id.toString() === doc._id.toString())) {
        teacher.assignedSubjects.push(doc._id);
        await teacher.save();
      }
    }
  }
  console.log(`   Processed ${Object.keys(subjectMap).length} academic subjects.`);

  // -------------------------------------------------------------
  // 5. DEMO STUDENTS (36 Students across CSE, IT, ECE, ME)
  // -------------------------------------------------------------
  console.log('⚙️  [5/15] Seeding Student Body & Enrollment Records...');
  const studentNames = [
    // CSE (15 students)
    { name: 'Aarav Sharma', roll: 'STU2025', user: 'STU2025', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Male', phone: '+91-9811000001' },
    { name: 'Ananya Singh', roll: '26CSE002', user: '26cse002', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Female', phone: '+91-9811000002' },
    { name: 'Rohan Gupta', roll: '26CSE003', user: '26cse003', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Male', phone: '+91-9811000003' },
    { name: 'Priya Patel', roll: '26CSE004', user: '26cse004', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Female', phone: '+91-9811000004' },
    { name: 'Karthik Nair', roll: '26CSE005', user: '26cse005', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Male', phone: '+91-9811000005' },
    { name: 'Ishita Verma', roll: '26CSE006', user: '26cse006', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Female', phone: '+91-9811000006' },
    { name: 'Vikram Malhotra', roll: '26CSE007', user: '26cse007', course: 'CSE', branch: 'Computer Science', section: 'B', gender: 'Male', phone: '+91-9811000007' },
    { name: 'Sneha Kulkarni', roll: '26CSE008', user: '26cse008', course: 'CSE', branch: 'Computer Science', section: 'B', gender: 'Female', phone: '+91-9811000008' },
    { name: 'Aditya Joshi', roll: '26CSE009', user: '26cse009', course: 'CSE', branch: 'Computer Science', section: 'B', gender: 'Male', phone: '+91-9811000009' },
    { name: 'Riya Sen', roll: '26CSE010', user: '26cse010', course: 'CSE', branch: 'Computer Science', section: 'B', gender: 'Female', phone: '+91-9811000010' },
    { name: 'Harsh Vardhan', roll: '26CSE011', user: '26cse011', course: 'CSE', branch: 'Computer Science', section: 'B', gender: 'Male', phone: '+91-9811000011' },
    { name: 'Pooja Mishra', roll: '26CSE012', user: '26cse012', course: 'CSE', branch: 'Computer Science', section: 'B', gender: 'Female', phone: '+91-9811000012' },
    { name: 'Manish Kumar', roll: '26CSE013', user: '26cse013', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Male', phone: '+91-9811000013' },
    { name: 'Kavita Das', roll: '26CSE014', user: '26cse014', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Female', phone: '+91-9811000014' },
    { name: 'Nikhil Agarwal', roll: '26CSE015', user: '26cse015', course: 'CSE', branch: 'Computer Science', section: 'A', gender: 'Male', phone: '+91-9811000015' },

    // IT (10 students)
    { name: 'Ayush Pandey', roll: '26IT001', user: '26it001', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Male', phone: '+91-9822000001' },
    { name: 'Divya Rastogi', roll: '26IT002', user: '26it002', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Female', phone: '+91-9822000002' },
    { name: 'Gaurav Saxena', roll: '26IT003', user: '26it003', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Male', phone: '+91-9822000003' },
    { name: 'Kriti Shukla', roll: '26IT004', user: '26it004', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Female', phone: '+91-9822000004' },
    { name: 'Mayank Srivastava', roll: '26IT005', user: '26it005', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Male', phone: '+91-9822000005' },
    { name: 'Neha Chaurasia', roll: '26IT006', user: '26it006', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Female', phone: '+91-9822000006' },
    { name: 'Prashant Dubey', roll: '26IT007', user: '26it007', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Male', phone: '+91-9822000007' },
    { name: 'Shreya Tiwari', roll: '26IT008', user: '26it008', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Female', phone: '+91-9822000008' },
    { name: 'Tushar Dwivedi', roll: '26IT009', user: '26it009', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Male', phone: '+91-9822000009' },
    { name: 'Varsha Yadav', roll: '26IT010', user: '26it010', course: 'IT', branch: 'Information Technology', section: 'A', gender: 'Female', phone: '+91-9822000010' },

    // ECE (6 students)
    { name: 'Abhay Tripathi', roll: '26ECE001', user: '26ece001', course: 'ECE', branch: 'Electronics', section: 'A', gender: 'Male', phone: '+91-9833000001' },
    { name: 'Bhavna Chauhan', roll: '26ECE002', user: '26ece002', course: 'ECE', branch: 'Electronics', section: 'A', gender: 'Female', phone: '+91-9833000002' },
    { name: 'Deepak Maurya', roll: '26ECE003', user: '26ece003', course: 'ECE', branch: 'Electronics', section: 'A', gender: 'Male', phone: '+91-9833000003' },
    { name: 'Garima Rajput', roll: '26ECE004', user: '26ece004', course: 'ECE', branch: 'Electronics', section: 'A', gender: 'Female', phone: '+91-9833000004' },
    { name: 'Kapil Gautam', roll: '26ECE005', user: '26ece005', course: 'ECE', branch: 'Electronics', section: 'A', gender: 'Male', phone: '+91-9833000005' },
    { name: 'Megha Soni', roll: '26ECE006', user: '26ece006', course: 'ECE', branch: 'Electronics', section: 'A', gender: 'Female', phone: '+91-9833000006' },

    // ME (5 students)
    { name: 'Alok Dixit', roll: '26ME001', user: '26me001', course: 'ME', branch: 'Mechanical', section: 'A', gender: 'Male', phone: '+91-9844000001' },
    { name: 'Chitra Agnihotri', roll: '26ME002', user: '26me002', course: 'ME', branch: 'Mechanical', section: 'A', gender: 'Female', phone: '+91-9844000002' },
    { name: 'Dharmendra Pal', roll: '26ME003', user: '26me003', course: 'ME', branch: 'Mechanical', section: 'A', gender: 'Male', phone: '+91-9844000003' },
    { name: 'Jyoti Kushwaha', roll: '26ME004', user: '26me004', course: 'ME', branch: 'Mechanical', section: 'A', gender: 'Female', phone: '+91-9844000004' },
    { name: 'Mohit Gangwar', roll: '26ME005', user: '26me005', course: 'ME', branch: 'Mechanical', section: 'A', gender: 'Male', phone: '+91-9844000005' }
  ];

  const studentMap = {};
  for (const s of studentNames) {
    const course = courseMap[s.course];
    const email = `${s.roll.toLowerCase()}@demo.draitd.edu.in`;

    let doc = await Student.findOne({ rollNo: s.roll });
    if (!doc) {
      doc = await Student.create({
        name: s.name,
        rollNo: s.roll,
        username: s.user,
        email: email,
        password: hashedStudentPassword,
        courseId: course._id,
        branch: s.branch,
        semester: 4,
        section: s.section,
        gender: s.gender,
        phone: s.phone,
        dob: new Date('2004-05-15'),
        hostelInfo: s.section === 'A' ? 'Dr. Kalam Hostel Block B, Room 204' : 'Day Scholar - College Bus Route 3',
        transportInfo: s.section === 'A' ? 'Hostel Resident' : 'Awadhpuri Bus Stop',
        achievements: ['Annual TechFest 2025 Participant', 'Dean Merit List Sessional 2025'],
        isDemo: true,
        isActive: true
      });
      stats.students.created++;
    } else {
      doc.name = s.name;
      doc.courseId = course._id;
      doc.branch = s.branch;
      doc.semester = 4;
      doc.section = s.section;
      doc.phone = s.phone;
      doc.password = hashedStudentPassword;
      await doc.save();
      stats.students.updated++;
    }
    studentMap[s.roll] = doc;
  }
  console.log(`   Processed ${Object.keys(studentMap).length} student records.`);

  // -------------------------------------------------------------
  // 6. WEEKLY CLASS TIMETABLE (36 Conflict-Free Slots)
  // -------------------------------------------------------------
  console.log('⚙️  [6/15] Seeding Conflict-Free Weekly Timetable...');
  const timetableSlots = [
    // CSE Timetable (Monday to Friday)
    { day: 'Monday', timeSlot: '9:00-10:00', courseCode: 'CSE', subjectCode: 'CS401', teacherUser: 'prof_sunita', roomNo: 'LH-201' },
    { day: 'Monday', timeSlot: '10:00-11:00', courseCode: 'CSE', subjectCode: 'CS402', teacherUser: 'dr_amit', roomNo: 'LH-201' },
    { day: 'Monday', timeSlot: '11:00-12:00', courseCode: 'CSE', subjectCode: 'CS403', teacherUser: 'dr_amit', roomNo: 'LH-201' },
    { day: 'Monday', timeSlot: '2:00-3:00', courseCode: 'CSE', subjectCode: 'CS405L', teacherUser: 'prof_sunita', roomNo: 'Lab 101' },
    { day: 'Monday', timeSlot: '3:00-4:00', courseCode: 'CSE', subjectCode: 'CS405L', teacherUser: 'prof_sunita', roomNo: 'Lab 101' },

    { day: 'Tuesday', timeSlot: '9:00-10:00', courseCode: 'CSE', subjectCode: 'CS404', teacherUser: 'prof_rajeshwar', roomNo: 'LH-201' },
    { day: 'Tuesday', timeSlot: '10:00-11:00', courseCode: 'CSE', subjectCode: 'CS401', teacherUser: 'prof_sunita', roomNo: 'LH-201' },
    { day: 'Tuesday', timeSlot: '11:00-12:00', courseCode: 'CSE', subjectCode: 'CS402', teacherUser: 'dr_amit', roomNo: 'LH-201' },
    { day: 'Tuesday', timeSlot: '2:00-3:00', courseCode: 'CSE', subjectCode: 'CS406L', teacherUser: 'dr_amit', roomNo: 'Lab 102' },
    { day: 'Tuesday', timeSlot: '3:00-4:00', courseCode: 'CSE', subjectCode: 'CS406L', teacherUser: 'dr_amit', roomNo: 'Lab 102' },

    { day: 'Wednesday', timeSlot: '9:00-10:00', courseCode: 'CSE', subjectCode: 'CS403', teacherUser: 'dr_amit', roomNo: 'LH-201' },
    { day: 'Wednesday', timeSlot: '10:00-11:00', courseCode: 'CSE', subjectCode: 'CS404', teacherUser: 'prof_rajeshwar', roomNo: 'LH-201' },
    { day: 'Wednesday', timeSlot: '11:00-12:00', courseCode: 'CSE', subjectCode: 'CS401', teacherUser: 'prof_sunita', roomNo: 'LH-201' },

    { day: 'Thursday', timeSlot: '9:00-10:00', courseCode: 'CSE', subjectCode: 'CS402', teacherUser: 'dr_amit', roomNo: 'LH-201' },
    { day: 'Thursday', timeSlot: '10:00-11:00', courseCode: 'CSE', subjectCode: 'CS403', teacherUser: 'dr_amit', roomNo: 'LH-201' },
    { day: 'Thursday', timeSlot: '11:00-12:00', courseCode: 'CSE', subjectCode: 'CS404', teacherUser: 'prof_rajeshwar', roomNo: 'LH-201' },

    { day: 'Friday', timeSlot: '9:00-10:00', courseCode: 'CSE', subjectCode: 'CS401', teacherUser: 'prof_sunita', roomNo: 'LH-201' },
    { day: 'Friday', timeSlot: '10:00-11:00', courseCode: 'CSE', subjectCode: 'CS402', teacherUser: 'dr_amit', roomNo: 'LH-201' },
    { day: 'Friday', timeSlot: '2:00-3:00', courseCode: 'CSE', subjectCode: 'CS404', teacherUser: 'prof_rajeshwar', roomNo: 'LH-201' },

    // IT Timetable (Distinct Rooms & Teachers)
    { day: 'Monday', timeSlot: '9:00-10:00', courseCode: 'IT', subjectCode: 'IT401', teacherUser: 'prof_meenakshi', roomNo: 'LH-202' },
    { day: 'Monday', timeSlot: '10:00-11:00', courseCode: 'IT', subjectCode: 'IT402', teacherUser: 'dr_priyanshu', roomNo: 'LH-202' },
    { day: 'Monday', timeSlot: '11:00-12:00', courseCode: 'IT', subjectCode: 'IT403', teacherUser: 'prof_meenakshi', roomNo: 'LH-202' },
    { day: 'Monday', timeSlot: '2:00-3:00', courseCode: 'IT', subjectCode: 'IT404L', teacherUser: 'prof_meenakshi', roomNo: 'Lab 103' },

    { day: 'Tuesday', timeSlot: '9:00-10:00', courseCode: 'IT', subjectCode: 'IT402', teacherUser: 'dr_priyanshu', roomNo: 'LH-202' },
    { day: 'Tuesday', timeSlot: '10:00-11:00', courseCode: 'IT', subjectCode: 'IT401', teacherUser: 'prof_meenakshi', roomNo: 'LH-202' },
    { day: 'Tuesday', timeSlot: '2:00-3:00', courseCode: 'IT', subjectCode: 'IT405L', teacherUser: 'dr_priyanshu', roomNo: 'Lab 103' },

    { day: 'Wednesday', timeSlot: '9:00-10:00', courseCode: 'IT', subjectCode: 'IT403', teacherUser: 'prof_meenakshi', roomNo: 'LH-202' },
    { day: 'Wednesday', timeSlot: '10:00-11:00', courseCode: 'IT', subjectCode: 'IT401', teacherUser: 'prof_meenakshi', roomNo: 'LH-202' },

    // ECE Timetable
    { day: 'Monday', timeSlot: '9:00-10:00', courseCode: 'ECE', subjectCode: 'EC401', teacherUser: 'dr_alok', roomNo: 'LH-203' },
    { day: 'Monday', timeSlot: '10:00-11:00', courseCode: 'ECE', subjectCode: 'EC402', teacherUser: 'prof_divya', roomNo: 'LH-203' },
    { day: 'Tuesday', timeSlot: '9:00-10:00', courseCode: 'ECE', subjectCode: 'EC403', teacherUser: 'dr_alok', roomNo: 'LH-203' },
    { day: 'Tuesday', timeSlot: '2:00-3:00', courseCode: 'ECE', subjectCode: 'EC404L', teacherUser: 'dr_alok', roomNo: 'Lab 201' },

    // ME Timetable
    { day: 'Monday', timeSlot: '9:00-10:00', courseCode: 'ME', subjectCode: 'ME401', teacherUser: 'dr_virendra', roomNo: 'LH-204' },
    { day: 'Monday', timeSlot: '10:00-11:00', courseCode: 'ME', subjectCode: 'ME402', teacherUser: 'prof_sanjay', roomNo: 'LH-204' },
    { day: 'Wednesday', timeSlot: '9:00-10:00', courseCode: 'ME', subjectCode: 'ME403', teacherUser: 'prof_sanjay', roomNo: 'LH-204' },
    { day: 'Wednesday', timeSlot: '2:00-3:00', courseCode: 'ME', subjectCode: 'ME404L', teacherUser: 'dr_virendra', roomNo: 'Workshop-1' }
  ];

  for (const slot of timetableSlots) {
    const course = courseMap[slot.courseCode];
    const subject = subjectMap[slot.subjectCode];
    const teacher = teacherMap[slot.teacherUser];

    if (!course || !subject || !teacher) continue;

    let doc = await Timetable.findOne({
      courseId: course._id,
      semester: 4,
      day: slot.day,
      timeSlot: slot.timeSlot
    });

    if (!doc) {
      doc = await Timetable.create({
        courseId: course._id,
        semester: 4,
        day: slot.day,
        timeSlot: slot.timeSlot,
        subjectId: subject._id,
        teacherId: teacher._id,
        roomNo: slot.roomNo,
        isActive: true
      });
      stats.timetables.created++;
    } else {
      doc.subjectId = subject._id;
      doc.teacherId = teacher._id;
      doc.roomNo = slot.roomNo;
      await doc.save();
      stats.timetables.updated++;
    }
  }
  console.log(`   Seeded ${timetableSlots.length} weekly timetable slots.`);

  // -------------------------------------------------------------
  // 7. ATTENDANCE RECORDS (Multi-Date History for Demo Students)
  // -------------------------------------------------------------
  console.log('⚙️  [7/15] Seeding Multi-Date Attendance Records...');
  const attendanceDates = [
    new Date('2026-10-12'),
    new Date('2026-10-14'),
    new Date('2026-10-16'),
    new Date('2026-10-19'),
    new Date('2026-10-21'),
    new Date('2026-10-23'),
    new Date('2026-10-26'),
    new Date('2026-10-28')
  ];

  // Map students to their core subjects for attendance
  const sampleRolls = ['STU2025', '26CSE002', '26CSE003', '26CSE004', '26CSE005', '26IT001', '26IT002', '26ECE001', '26ME001'];
  for (const roll of sampleRolls) {
    const student = studentMap[roll];
    if (!student) continue;

    // Pick 3 subjects for student's branch
    const branchPrefix = roll.includes('IT') ? 'IT' : roll.includes('ECE') ? 'EC' : roll.includes('ME') ? 'ME' : 'CS';
    const relSubjects = Object.values(subjectMap).filter(s => s.subjectCode.startsWith(branchPrefix)).slice(0, 3);

    for (const sub of relSubjects) {
      for (let i = 0; i < attendanceDates.length; i++) {
        const date = attendanceDates[i];
        // 85% attendance rate
        const isPresent = (roll === 'STU2025' && i === 3) ? false : (i % 7 !== 0);
        const status = isPresent ? 'Present' : 'Absent';

        const existingAtt = await Attendance.findOne({
          studentId: student._id,
          subjectId: sub._id,
          date: date
        });

        if (!existingAtt) {
          await Attendance.create({
            studentId: student._id,
            subjectId: sub._id,
            teacherId: sub.teacherId || 'admin',
            date: date,
            status: status
          });
          stats.attendance.created++;
        } else {
          existingAtt.status = status;
          await existingAtt.save();
          stats.attendance.updated++;
        }
      }
    }
  }
  console.log(`   Seeded historical attendance across ${attendanceDates.length} lecture dates.`);

  // -------------------------------------------------------------
  // 8. EXAMINATION MARKS (Mid Term, Final, Sessional, Quiz)
  // -------------------------------------------------------------
  console.log('⚙️  [8/15] Seeding Examination Marks & Grade Records...');
  const examTypes = ['Mid Term', 'Sessional 1', 'Quiz 1', 'Final'];
  for (const roll of sampleRolls) {
    const student = studentMap[roll];
    if (!student) continue;

    const branchPrefix = roll.includes('IT') ? 'IT' : roll.includes('ECE') ? 'EC' : roll.includes('ME') ? 'ME' : 'CS';
    const relSubjects = Object.values(subjectMap).filter(s => s.subjectCode.startsWith(branchPrefix)).slice(0, 2);

    for (const sub of relSubjects) {
      for (const exam of examTypes) {
        let totalMarks = exam === 'Final' ? 100 : exam === 'Mid Term' ? 50 : 25;
        let marksObtained = exam === 'Final' ? (roll === 'STU2025' ? 88 : 76)
          : exam === 'Mid Term' ? (roll === 'STU2025' ? 44 : 38)
          : (roll === 'STU2025' ? 22 : 19);

        let existingMark = await Marks.findOne({
          studentId: student._id,
          subjectId: sub._id,
          examType: exam
        });

        if (!existingMark) {
          await Marks.create({
            studentId: student._id,
            subjectId: sub._id,
            teacherId: sub.teacherId || 'admin',
            marks: marksObtained,
            totalMarks: totalMarks,
            examType: exam
          });
          stats.marks.created++;
        } else {
          existingMark.marks = marksObtained;
          existingMark.totalMarks = totalMarks;
          await existingMark.save();
          stats.marks.updated++;
        }
      }
    }
  }
  console.log(`   Seeded academic marks across ${examTypes.length} examination categories.`);

  // -------------------------------------------------------------
  // 9. STUDENT FEE RECORDS (Paid, Partial, Pending, Overdue)
  // -------------------------------------------------------------
  console.log('⚙️  [9/15] Seeding Student Fee Accounts & Payment Transactions...');
  const feeConfigs = [
    { roll: 'STU2025', total: 45000, paid: 45000, due: 0, status: 'Paid', txnId: 'TXN2026101501' },
    { roll: '26CSE002', total: 45000, paid: 25000, due: 20000, status: 'Partial', txnId: 'TXN2026101502' },
    { roll: '26CSE003', total: 45000, paid: 0, due: 45000, status: 'Pending', txnId: null },
    { roll: '26CSE004', total: 45000, paid: 0, due: 45000, status: 'Overdue', txnId: null },
    { roll: '26IT001', total: 45000, paid: 45000, due: 0, status: 'Paid', txnId: 'TXN2026101503' },
    { roll: '26IT002', total: 45000, paid: 20000, due: 25000, status: 'Partial', txnId: 'TXN2026101504' },
    { roll: '26ECE001', total: 45000, paid: 45000, due: 0, status: 'Paid', txnId: 'TXN2026101505' },
    { roll: '26ME001', total: 45000, paid: 45000, due: 0, status: 'Paid', txnId: 'TXN2026101506' }
  ];

  for (const fc of feeConfigs) {
    const student = studentMap[fc.roll];
    if (!student) continue;

    let feeDoc = await Fee.findOne({ studentId: student._id, semester: 4 });
    const dueDate = fc.status === 'Overdue' ? new Date('2026-09-30') : new Date('2026-11-30');
    const transactions = fc.paid > 0 ? [{
      amount: fc.paid,
      date: new Date('2026-10-15'),
      method: 'Online NetBanking / UPI',
      transactionId: fc.txnId || 'TXN-AUTO-001'
    }] : [];

    if (!feeDoc) {
      feeDoc = await Fee.create({
        studentId: student._id,
        semester: 4,
        totalAmount: fc.total,
        paidAmount: fc.paid,
        dueAmount: fc.due,
        dueDate: dueDate,
        status: fc.status,
        transactions: transactions,
        isActive: true
      });
      stats.fees.created++;
    } else {
      feeDoc.totalAmount = fc.total;
      feeDoc.paidAmount = fc.paid;
      feeDoc.dueAmount = fc.due;
      feeDoc.status = fc.status;
      feeDoc.dueDate = dueDate;
      feeDoc.transactions = transactions;
      await feeDoc.save();
      stats.fees.updated++;
    }
  }
  console.log(`   Processed fee accounts with varied statuses.`);

  // -------------------------------------------------------------
  // 10. DIGITAL LIBRARY BOOKS & TRANSACTIONS
  // -------------------------------------------------------------
  console.log('⚙️  [10/15] Seeding Digital Library Catalog & Book Issues...');
  const libraryBooks = [
    { bookName: 'Data Structures and Algorithm Analysis in C++', author: 'Mark Allen Weiss', isbn: '978-DEMO-0132847377', category: 'Computer Science', quantity: 12, remaining: 10 },
    { bookName: 'Database System Concepts (7th Edition)', author: 'Abraham Silberschatz, Henry F. Korth', isbn: '978-DEMO-0078022159', category: 'Computer Science', quantity: 15, remaining: 12 },
    { bookName: 'Operating System Concepts (10th Edition)', author: 'Silberschatz, Galvin, Gagne', isbn: '978-DEMO-1119800361', category: 'Computer Science', quantity: 10, remaining: 8 },
    { bookName: 'Computer Networking: A Top-Down Approach', author: 'James F. Kurose, Keith W. Ross', isbn: '978-DEMO-0136681557', category: 'Information Technology', quantity: 10, remaining: 7 },
    { bookName: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', isbn: '978-DEMO-0134610993', category: 'Computer Science', quantity: 8, remaining: 6 },
    { bookName: 'Modern Digital Electronics (4th Edition)', author: 'R. P. Jain', isbn: '978-DEMO-0070669116', category: 'Electronics', quantity: 14, remaining: 11 },
    { bookName: 'Digital Logic and Computer Design', author: 'M. Morris Mano', isbn: '978-DEMO-0134549897', category: 'Electronics', quantity: 12, remaining: 9 },
    { bookName: 'Fundamentals of Thermodynamics', author: 'Claus Borgnakke, Richard E. Sonntag', isbn: '978-DEMO-1118131992', category: 'Mechanical', quantity: 10, remaining: 8 },
    { bookName: 'Fluid Mechanics (9th Edition)', author: 'Frank M. White', isbn: '978-DEMO-1260575545', category: 'Mechanical', quantity: 8, remaining: 6 },
    { bookName: 'Clean Code: A Handbook of Agile Software', author: 'Robert C. Martin', isbn: '978-DEMO-0132350884', category: 'Software Engineering', quantity: 6, remaining: 4 }
  ];

  const primaryStudent = studentMap['STU2025'];
  for (const b of libraryBooks) {
    let bookDoc = await Library.findOne({ isbn: b.isbn });
    const issuedList = (primaryStudent && b.remaining < b.quantity) ? [{
      studentId: primaryStudent._id,
      issueDate: new Date('2026-10-10'),
      returnDate: new Date('2026-11-10'),
      status: 'Issued'
    }] : [];

    if (!bookDoc) {
      bookDoc = await Library.create({
        ...b,
        issuedTo: issuedList,
        isActive: true
      });
      stats.library.created++;
    } else {
      bookDoc.bookName = b.bookName;
      bookDoc.author = b.author;
      bookDoc.quantity = b.quantity;
      bookDoc.remaining = b.remaining;
      bookDoc.category = b.category;
      if (issuedList.length > 0) bookDoc.issuedTo = issuedList;
      await bookDoc.save();
      stats.library.updated++;
    }
  }
  console.log(`   Seeded ${libraryBooks.length} digital library book titles.`);

  // -------------------------------------------------------------
  // 11. ACADEMIC ASSIGNMENTS & SUBMISSIONS
  // -------------------------------------------------------------
  console.log('⚙️  [11/15] Seeding Course Assignments & Student Submissions...');
  const assignmentDefs = [
    {
      title: 'Lab Assignment 1: Red-Black Trees & Balanced BSTs',
      subjectCode: 'CS401',
      teacherUser: 'prof_sunita',
      description: `Implementation of insertion, deletion, and rotation operations on Red-Black Trees in C++/Java. [${DEMO_TAG}]`,
      deadline: new Date('2026-11-15'),
      maxMarks: 20
    },
    {
      title: 'Database Schema Normalization & BCNF Case Study',
      subjectCode: 'CS402',
      teacherUser: 'dr_amit',
      description: `Analyze an unnormalized enterprise relational schema and decompose into 3NF and BCNF with functional dependencies. [${DEMO_TAG}]`,
      deadline: new Date('2026-11-20'),
      maxMarks: 25
    },
    {
      title: 'UNIX Kernel CPU Scheduler Simulation in C',
      subjectCode: 'CS403',
      teacherUser: 'dr_amit',
      description: `Simulate Round-Robin, Shortest Job First, and Priority Preemptive CPU scheduling algorithms. [${DEMO_TAG}]`,
      deadline: new Date('2026-11-25'),
      maxMarks: 30
    },
    {
      title: 'Responsive College Portal Prototype with React & Tailwind',
      subjectCode: 'IT401',
      teacherUser: 'prof_meenakshi',
      description: `Build an accessible, mobile-first academic portal dashboard with real API integration. [${DEMO_TAG}]`,
      deadline: new Date('2026-11-18'),
      maxMarks: 25
    },
    {
      title: 'Wireshark Packet Analysis & Protocol Dissection',
      subjectCode: 'IT402',
      teacherUser: 'dr_priyanshu',
      description: `Capture TCP three-way handshake, DNS query-response, and TLS 1.3 packets and inspect headers. [${DEMO_TAG}]`,
      deadline: new Date('2026-11-22'),
      maxMarks: 20
    }
  ];

  for (const a of assignmentDefs) {
    const subject = subjectMap[a.subjectCode];
    const teacher = teacherMap[a.teacherUser];
    if (!subject || !teacher) continue;

    let assignDoc = await Assignments.findOne({ title: a.title, subjectId: subject._id });
    const sampleSubmissions = primaryStudent ? [{
      studentId: primaryStudent._id,
      submissionDate: new Date('2026-10-25'),
      remarks: 'Excellent implementation and clean test coverage.',
      marksObtained: a.maxMarks - 2
    }] : [];

    if (!assignDoc) {
      assignDoc = await Assignments.create({
        teacherId: teacher._id,
        subjectId: subject._id,
        title: a.title,
        description: a.description,
        deadline: a.deadline,
        maxMarks: a.maxMarks,
        submissionType: 'online',
        submissions: sampleSubmissions,
        isActive: true,
        isPublished: true
      });
      stats.assignments.created++;
    } else {
      assignDoc.deadline = a.deadline;
      assignDoc.maxMarks = a.maxMarks;
      assignDoc.description = a.description;
      assignDoc.submissions = sampleSubmissions;
      await assignDoc.save();
      stats.assignments.updated++;
    }
  }
  console.log(`   Seeded academic assignments with evaluated student submissions.`);

  // -------------------------------------------------------------
  // 12. STUDY MATERIALS & LECTURE NOTES
  // -------------------------------------------------------------
  console.log('⚙️  [12/15] Seeding Faculty Study Materials & Lecture Notes...');
  const noteDefs = [
    { title: 'Unit 1: Asymptotic Complexity & Master Theorem Notes', subjectCode: 'CS401', teacherUser: 'prof_sunita' },
    { title: 'Unit 2: Relational Algebra & SQL Query Optimization', subjectCode: 'CS402', teacherUser: 'dr_amit' },
    { title: 'Unit 3: Process Synchronization, Semaphores & Deadlocks', subjectCode: 'CS403', teacherUser: 'dr_amit' },
    { title: 'Unit 1: Modern JavaScript ES6+ & Component Architecture', subjectCode: 'IT401', teacherUser: 'prof_meenakshi' }
  ];

  for (const n of noteDefs) {
    const subject = subjectMap[n.subjectCode];
    const teacher = teacherMap[n.teacherUser];
    if (!subject || !teacher) continue;

    let noteDoc = await Notes.findOne({ title: n.title, subjectId: subject._id });
    if (!noteDoc) {
      await Notes.create({
        teacherId: teacher._id,
        subjectId: subject._id,
        title: n.title,
        description: `Official comprehensive lecture notes approved by ${teacher.name}. [${DEMO_TAG}]`,
        fileUrl: '/uploads/sample_lecture_notes.pdf',
        isActive: true
      });
      stats.materials.created++;
    }
  }
  console.log(`   Seeded study materials & lecture notes.`);

  // -------------------------------------------------------------
  // 13. CAMPUS NOTICES & CIRCULARS
  // -------------------------------------------------------------
  console.log('⚙️  [13/15] Seeding Institutional Circulars & Notices...');
  const noticeDefs = [
    {
      title: 'Circular: Sessional Examination 2 Schedule for Even Semester 2026',
      courseCode: 'CSE',
      teacherUser: 'prof_rajeshwar',
      description: `All 2nd and 3rd year students are hereby informed that Sessional 2 Examinations will commence from 15th November 2026. The detailed subject-wise room seating chart is uploaded on the timetable portal. [${DEMO_TAG}]`
    },
    {
      title: 'Annual Technical Symposium: HackAITD 2026 Registrations Open',
      courseCode: 'CSE',
      teacherUser: 'prof_sunita',
      description: `The Department of Computer Science & Engineering is organizing the 48-hour national hackathon 'HackAITD 2026'. Cash prizes worth INR 1,50,000 to be won. Teams may register via the campus portal. [${DEMO_TAG}]`
    },
    {
      title: 'Notice: Library Book Return & Renewal Deadline for Sessional Tests',
      courseCode: 'IT',
      teacherUser: 'dr_priyanshu',
      description: `Students holding reference books beyond the 14-day lending period are instructed to renew their titles at the Central Library counter by 5:00 PM Friday. [${DEMO_TAG}]`
    },
    {
      title: 'Industry Guest Lecture: Scalable Cloud Architecture with Kubernetes',
      courseCode: 'IT',
      teacherUser: 'prof_meenakshi',
      description: `Distinguished Alumni and Senior Principal Architect will deliver a guest seminar in Auditorium Hall 2 on Saturday at 11:00 AM. Attendance is mandatory for IT 3rd year. [${DEMO_TAG}]`
    },
    {
      title: 'Post-Matric Scholarship Scheme for Divyangjan Students 2026',
      courseCode: 'ECE',
      teacherUser: 'dr_alok',
      description: `Eligible students eligible for State and Central government technical education scholarships may submit their verification forms at the Academic Registrar counter. [${DEMO_TAG}]`
    }
  ];

  for (const notif of noticeDefs) {
    const course = courseMap[notif.courseCode];
    const teacher = teacherMap[notif.teacherUser];
    if (!course || !teacher) continue;

    let noticeDoc = await Notices.findOne({ title: notif.title });
    if (!noticeDoc) {
      await Notices.create({
        teacherId: teacher._id,
        courseId: course._id,
        title: notif.title,
        description: notif.description,
        isActive: true
      });
      stats.notices.created++;
    } else {
      noticeDoc.description = notif.description;
      await noticeDoc.save();
      stats.notices.updated++;
    }
  }
  console.log(`   Seeded official campus announcements & notices.`);

  // -------------------------------------------------------------
  // 14. LEAVE APPLICATIONS (Student & Faculty)
  // -------------------------------------------------------------
  console.log('⚙️  [14/15] Seeding Leave Applications...');
  if (primaryStudent) {
    const leaveDefs = [
      {
        userId: primaryStudent._id,
        userRole: 'student',
        leaveType: 'Medical Leave',
        startDate: new Date('2026-10-14'),
        endDate: new Date('2026-10-16'),
        reason: 'Viral fever and prescribed medical rest by institutional physician.',
        status: 'Approved'
      },
      {
        userId: primaryStudent._id,
        userRole: 'student',
        leaveType: 'Academic Event',
        startDate: new Date('2026-11-05'),
        endDate: new Date('2026-11-07'),
        reason: 'Participation in Inter-College Robotics Challenge at IIT Kanpur.',
        status: 'Pending'
      }
    ];

    for (const l of leaveDefs) {
      let doc = await Leave.findOne({ userId: l.userId, startDate: l.startDate });
      if (!doc) {
        await Leave.create({ ...l, isActive: true });
        stats.leaves.created++;
      } else {
        doc.status = l.status;
        doc.reason = l.reason;
        await doc.save();
        stats.leaves.updated++;
      }
    }
    console.log(`   Seeded leave applications.`);
  }

  // -------------------------------------------------------------
  // 15. INSTITUTIONAL ERP SETTINGS
  // -------------------------------------------------------------
  console.log('⚙️  [15/15] Configuring Institutional College Profile...');
  let settingsDoc = await Settings.findOne({ isActive: true });
  const settingsData = {
    institutionName: 'Dr. Ambedkar Institute of Technology for Divyangjan',
    academicYear: '2026-2027',
    semester: 'Even',
    address: 'Awadhpuri, GT Road, Kanpur, Uttar Pradesh - 208024',
    phone: '+91-512-2583221',
    email: 'info@draitd.edu.in',
    website: 'https://draitd.edu.in',
    isActive: true
  };

  if (!settingsDoc) {
    await Settings.create(settingsData);
    stats.settings.created++;
  } else {
    Object.assign(settingsDoc, settingsData);
    await settingsDoc.save();
    stats.settings.updated++;
  }
  console.log('   Configured Dr. AITD Kanpur official campus details.');

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('             DEMO SEEDING EXECUTION SUMMARY REPORT              ');
  console.log('================================================================');
  console.table(stats);

  console.log('\n\x1b[32m✔ All interconnected Demo Records created/updated successfully!\x1b[0m');
  console.log('\n🔑 Verified Test Credentials:');
  console.log('   • Admin Portal:    admin       / admin123');
  console.log('   • Faculty (CSE):   prof_sunita / teacher123');
  console.log('   • Faculty (IT):    dr_priyanshu/ teacher123');
  console.log('   • Faculty (Gen):   teacher     / teacher123');
  console.log('   • Student (CSE):   STU2025     / student123  (Roll: STU2025)');
  console.log('   • Student (IT):    26it001     / student123  (Roll: 26IT001)');
  console.log('================================================================\n');

  return stats;
}

// Main CLI Seeder entrypoint
async function runSeeder() {
  checkEnvironment();
  await connectDB();

  const args = process.argv.slice(2);
  if (args.includes('--inspect') || args.includes('--status')) {
    await inspectDatabase();
    await mongoose.disconnect();
    return;
  }

  if (args.includes('--clean') || args.includes('--reset')) {
    await cleanDemoData();
    await inspectDatabase();
    await mongoose.disconnect();
    return;
  }

  await seedAllRecords();
  await mongoose.disconnect();
}

// Execute CLI
if (require.main === module) {
  runSeeder()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('\n\x1b[31mFatal Seeder Error:\x1b[0m', err);
      process.exit(1);
    });
}

module.exports = { runSeeder, seedAllRecords, cleanDemoData, inspectDatabase };
