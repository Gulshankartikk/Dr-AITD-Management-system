const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const {
  Course,
  Subject,
  Teacher,
  Student,
  Admin
} = require('./models/CompleteModels');

const db = require('./database/db');

const initializeSystem = async () => {
  try {
    console.log('🚀 Initializing College ERP System...');
    
    // Connect to database
    await db();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Course.deleteMany({});
    await Subject.deleteMany({});
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Admin.deleteMany({});
    
    // Create default courses
    console.log('📚 Creating default courses...');
    const courses = await Course.insertMany([
      {
        courseName: 'Computer Science Engineering',
        courseCode: 'CSE',
        courseDuration: '4 years'
      },
      {
        courseName: 'Information Technology',
        courseCode: 'IT',
        courseDuration: '4 years'
      },
      {
        courseName: 'Electronics and Communication',
        courseCode: 'ECE',
        courseDuration: '4 years'
      },
      {
        courseName: 'Mechanical Engineering',
        courseCode: 'ME',
        courseDuration: '4 years'
      }
    ]);
    
    // Create default subjects
    console.log('📖 Creating default subjects...');
    const subjects = await Subject.insertMany([
      {
        subjectName: 'Data Structures and Algorithms',
        subjectCode: 'CSE101',
        courseId: courses[0]._id
      },
      {
        subjectName: 'Database Management Systems',
        subjectCode: 'CSE102',
        courseId: courses[0]._id
      },
      {
        subjectName: 'Web Development',
        subjectCode: 'CSE103',
        courseId: courses[0]._id
      },
      {
        subjectName: 'Software Engineering',
        subjectCode: 'CSE104',
        courseId: courses[0]._id
      },
      {
        subjectName: 'Computer Networks',
        subjectCode: 'IT101',
        courseId: courses[1]._id
      },
      {
        subjectName: 'Operating Systems',
        subjectCode: 'IT102',
        courseId: courses[1]._id
      }
    ]);
    
    // Create predefined teachers
    console.log('👨‍🏫 Creating predefined teachers...');
    const hashedPassword = await bcrypt.hash('teacher123', 10);
    
    const teachers = await Teacher.insertMany([
      {
        name: 'Gulshan Kartik',
        email: 'gulshan@college.edu',
        username: 'gulshan',
        password: hashedPassword,
        phone: '9876543210',
        department: 'Computer Science',
        designation: 'Professor',
        assignedCourse: [courses[0]._id],
        assignedSubjects: [subjects[0]._id, subjects[1]._id]
      },
      {
        name: 'Ankita Maurya',
        email: 'ankita@college.edu',
        username: 'ankita',
        password: hashedPassword,
        phone: '9876543211',
        department: 'Computer Science',
        designation: 'Assistant Professor',
        assignedCourse: [courses[0]._id],
        assignedSubjects: [subjects[2]._id]
      },
      {
        name: 'Aditya Kumar Sharma',
        email: 'aditya@college.edu',
        username: 'aditya',
        password: hashedPassword,
        phone: '9876543212',
        department: 'Information Technology',
        designation: 'Associate Professor',
        assignedCourse: [courses[1]._id],
        assignedSubjects: [subjects[4]._id]
      },
      {
        name: 'Abhishek Gond',
        email: 'abhishek@college.edu',
        username: 'abhishek',
        password: hashedPassword,
        phone: '9876543213',
        department: 'Computer Science',
        designation: 'Assistant Professor',
        assignedCourse: [courses[0]._id],
        assignedSubjects: [subjects[3]._id]
      }
    ]);
    
    // Create default admin
    console.log('👑 Creating default admin...');
    const adminPassword = await bcrypt.hash('admin', 10);
    await Admin.create({
      name: 'Gulshankartikk',
      email: 'admin@college.edu',
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    });
    
    // Create sample students
    console.log('👨‍🎓 Creating sample students...');
    const studentPassword = await bcrypt.hash('student123', 10);
    
    await Student.insertMany([
      {
        name: 'Demo Student 1',
        email: 'student1@college.edu',
        username: 'student1',
        password: studentPassword,
        rollNo: 'STU001',
        phone: '8765432101',
        courseId: courses[0]._id
      },
      {
        name: 'Demo Student 2',
        email: 'student2@college.edu',
        username: 'student2',
        password: studentPassword,
        rollNo: 'STU002',
        phone: '8765432102',
        courseId: courses[1]._id
      }
    ]);
    
    console.log('✅ System initialization completed successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('Admin: admin / admin');
    console.log('Teachers: gulshan, ankita, aditya, abhishek / teacher123');
    console.log('Students: student1, student2 / student123');
    console.log('\n🏢 Project Owner: Gulshankartikk');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error initializing system:', error);
    process.exit(1);
  }
};

// Run initialization
initializeSystem();