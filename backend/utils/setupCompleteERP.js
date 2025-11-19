const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const {
  Course,
  Subject,
  Teacher,
  Student,
  TeacherSubjectAssignment,
  Admin
} = require('./models/CompleteModels');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp');

async function setupCompleteERP() {
  try {
    console.log('Setting up Complete College ERP System...');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await Admin.findOneAndUpdate(
      { email: 'admin@college.edu' },
      {
        name: 'System Administrator',
        email: 'admin@college.edu',
        password: adminPassword
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin created:', admin.email);

    // Create Courses
    const courses = [
      {
        courseName: 'Bachelor of Technology - Computer Science',
        courseCode: 'BTECH-CSE',
        courseDuration: '4 Years',
        courseDescription: 'Comprehensive computer science engineering program'
      },
      {
        courseName: 'Master of Computer Applications',
        courseCode: 'MCA',
        courseDuration: '3 Years',
        courseDescription: 'Advanced computer applications program'
      }
    ];

    const createdCourses = [];
    for (const courseData of courses) {
      const course = await Course.findOneAndUpdate(
        { courseCode: courseData.courseCode },
        courseData,
        { upsert: true, new: true }
      );
      createdCourses.push(course);
      console.log('✅ Course created:', course.courseName);
    }

    // Create Subjects
    const subjects = [
      {
        subjectName: 'Data Structures and Algorithms',
        subjectCode: 'CSE201',
        courseId: createdCourses[0]._id,
        subjectDescription: 'Fundamental data structures and algorithms'
      },
      {
        subjectName: 'Database Management Systems',
        subjectCode: 'CSE301',
        courseId: createdCourses[0]._id,
        subjectDescription: 'Database design and management'
      },
      {
        subjectName: 'Web Development',
        subjectCode: 'MCA101',
        courseId: createdCourses[1]._id,
        subjectDescription: 'Full-stack web development'
      }
    ];

    const createdSubjects = [];
    for (const subjectData of subjects) {
      const subject = await Subject.findOneAndUpdate(
        { subjectCode: subjectData.subjectCode },
        subjectData,
        { upsert: true, new: true }
      );
      createdSubjects.push(subject);
      console.log('✅ Subject created:', subject.subjectName);
    }

    // Create Teachers
    const teachers = [
      {
        name: 'Ankita Maurya',
        email: 'ankita.maurya@college.edu',
        phone: '+91-9876543210',
        password: await bcrypt.hash('teacher123', 10),
        assignedCourse: [createdCourses[0]._id],
        assignedSubjects: [createdSubjects[0]._id, createdSubjects[1]._id]
      },
      {
        name: 'Kartik',
        email: 'kartik@college.edu',
        phone: '+91-9876543211',
        password: await bcrypt.hash('teacher123', 10),
        assignedCourse: [createdCourses[1]._id],
        assignedSubjects: [createdSubjects[2]._id]
      }
    ];

    const createdTeachers = [];
    for (const teacherData of teachers) {
      const teacher = await Teacher.findOneAndUpdate(
        { email: teacherData.email },
        teacherData,
        { upsert: true, new: true }
      );
      createdTeachers.push(teacher);
      console.log('✅ Teacher created:', teacher.name);
    }

    // Create Students
    const students = [
      {
        name: 'Gulshan Kartik',
        email: 'gulshan@student.edu',
        phone: '+91-9876543220',
        rollNo: 'CSE2021001',
        password: await bcrypt.hash('student123', 10),
        courseId: createdCourses[0]._id,
        semester: 3
      },
      {
        name: 'Aditya Sharma',
        email: 'aditya@student.edu',
        phone: '+91-9876543221',
        rollNo: 'CSE2021002',
        password: await bcrypt.hash('student123', 10),
        courseId: createdCourses[0]._id,
        semester: 3
      },
      {
        name: 'Abhishek Gond',
        email: 'abhishek@student.edu',
        phone: '+91-9876543222',
        rollNo: 'MCA2022001',
        password: await bcrypt.hash('student123', 10),
        courseId: createdCourses[1]._id,
        semester: 2
      }
    ];

    for (const studentData of students) {
      const student = await Student.findOneAndUpdate(
        { rollNo: studentData.rollNo },
        studentData,
        { upsert: true, new: true }
      );
      console.log('✅ Student created:', student.name);
    }

    // Create Teacher-Subject Assignments
    const assignments = [
      {
        teacherId: createdTeachers[0]._id,
        subjectId: createdSubjects[0]._id,
        courseId: createdCourses[0]._id
      },
      {
        teacherId: createdTeachers[0]._id,
        subjectId: createdSubjects[1]._id,
        courseId: createdCourses[0]._id
      },
      {
        teacherId: createdTeachers[1]._id,
        subjectId: createdSubjects[2]._id,
        courseId: createdCourses[1]._id
      }
    ];

    for (const assignmentData of assignments) {
      await TeacherSubjectAssignment.findOneAndUpdate(
        {
          teacherId: assignmentData.teacherId,
          subjectId: assignmentData.subjectId
        },
        assignmentData,
        { upsert: true, new: true }
      );
      console.log('✅ Teacher-Subject assignment created');
    }

    console.log('\n🎉 Complete College ERP System Setup Successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👨‍💼 Admin: admin@college.edu / admin123');
    console.log('👨‍🏫 Teacher 1: ankita.maurya@college.edu / teacher123');
    console.log('👨‍🏫 Teacher 2: kartik@college.edu / teacher123');
    console.log('👨‍🎓 Student 1: gulshan@student.edu / student123');
    console.log('👨‍🎓 Student 2: aditya@student.edu / student123');
    console.log('👨‍🎓 Student 3: abhishek@student.edu / student123');

  } catch (error) {
    console.error('❌ Error setting up ERP:', error);
  } finally {
    mongoose.connection.close();
  }
}

setupCompleteERP();