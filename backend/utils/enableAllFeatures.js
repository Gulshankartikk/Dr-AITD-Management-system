const mongoose = require('mongoose');
require('dotenv').config();

const {
  Course, Subject, Teacher, Student, Attendance, Assignments, 
  Marks, Notices, Notes, StudyMaterial
} = require('./models/CompleteModels');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp');

async function enableAllFeatures() {
  try {
    console.log('🚀 Enabling all features with sample data...\n');

    // Get existing data
    const students = await Student.find({ isActive: true });
    const teachers = await Teacher.find({ isActive: true });
    const subjects = await Subject.find({ isActive: true });
    const courses = await Course.find({ isActive: true });

    if (!students.length || !teachers.length || !subjects.length) {
      console.log('❌ Please run setupCompleteERP.js first');
      return;
    }

    // 1. Add Attendance Records
    console.log('📊 Adding attendance records...');
    const attendanceRecords = [];
    const dates = [
      new Date('2024-01-15'),
      new Date('2024-01-16'),
      new Date('2024-01-17'),
      new Date('2024-01-18'),
      new Date('2024-01-19')
    ];

    for (const student of students) {
      for (const subject of subjects.filter(s => s.courseId.toString() === student.courseId.toString())) {
        for (const date of dates) {
          attendanceRecords.push({
            studentId: student._id,
            subjectId: subject._id,
            teacherId: teachers[0]._id,
            date,
            status: Math.random() > 0.2 ? 'Present' : 'Absent'
          });
        }
      }
    }
    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Added ${attendanceRecords.length} attendance records`);

    // 2. Add Assignments
    console.log('📝 Adding assignments...');
    const assignments = [];
    for (const subject of subjects) {
      assignments.push({
        teacherId: teachers[0]._id,
        subjectId: subject._id,
        title: `${subject.subjectName} Assignment 1`,
        description: `Complete the exercises from Chapter 1-3 of ${subject.subjectName}`,
        deadline: new Date('2024-02-15'),
        submissions: students.slice(0, 2).map(s => ({
          studentId: s._id,
          submissionDate: new Date('2024-02-10'),
          fileUrl: 'https://example.com/submission.pdf'
        }))
      });
      
      assignments.push({
        teacherId: teachers[0]._id,
        subjectId: subject._id,
        title: `${subject.subjectName} Project`,
        description: `Final project for ${subject.subjectName}`,
        deadline: new Date('2024-03-01'),
        submissions: []
      });
    }
    await Assignments.insertMany(assignments);
    console.log(`✅ Added ${assignments.length} assignments`);

    // 3. Add Marks
    console.log('📈 Adding marks...');
    const marks = [];
    for (const student of students) {
      for (const subject of subjects.filter(s => s.courseId.toString() === student.courseId.toString())) {
        marks.push({
          studentId: student._id,
          subjectId: subject._id,
          teacherId: teachers[0]._id,
          marks: Math.floor(Math.random() * 30) + 70,
          totalMarks: 100,
          examType: 'Mid Term'
        });
        
        marks.push({
          studentId: student._id,
          subjectId: subject._id,
          teacherId: teachers[0]._id,
          marks: Math.floor(Math.random() * 25) + 15,
          totalMarks: 25,
          examType: 'Quiz'
        });
      }
    }
    await Marks.insertMany(marks);
    console.log(`✅ Added ${marks.length} marks records`);

    // 4. Add Notices
    console.log('📢 Adding notices...');
    const notices = [];
    for (const course of courses) {
      notices.push({
        teacherId: teachers[0]._id,
        courseId: course._id,
        title: `Important Notice for ${course.courseName}`,
        description: `All students of ${course.courseName} are requested to attend the special lecture on advanced topics scheduled for next week.`
      });
      
      notices.push({
        teacherId: teachers[0]._id,
        courseId: course._id,
        title: 'Exam Schedule Released',
        description: 'The examination schedule has been released. Please check the academic calendar for detailed timings.'
      });
    }
    await Notices.insertMany(notices);
    console.log(`✅ Added ${notices.length} notices`);

    // 5. Add Notes
    console.log('📚 Adding notes...');
    const notes = [];
    for (const subject of subjects) {
      notes.push({
        teacherId: teachers[0]._id,
        subjectId: subject._id,
        title: `${subject.subjectName} - Chapter 1 Notes`,
        description: `Comprehensive notes covering the fundamentals of ${subject.subjectName}`,
        fileUrl: 'https://example.com/chapter1-notes.pdf'
      });
      
      notes.push({
        teacherId: teachers[0]._id,
        subjectId: subject._id,
        title: `${subject.subjectName} - Quick Reference`,
        description: `Quick reference guide for ${subject.subjectName} formulas and concepts`,
        fileUrl: 'https://example.com/quick-reference.pdf'
      });
    }
    await Notes.insertMany(notes);
    console.log(`✅ Added ${notes.length} notes`);

    // 6. Add Study Materials
    console.log('📖 Adding study materials...');
    const materials = [];
    for (const subject of subjects) {
      materials.push({
        teacherId: teachers[0]._id,
        subjectId: subject._id,
        title: `${subject.subjectName} - Textbook PDF`,
        description: `Official textbook for ${subject.subjectName} course`,
        fileUrl: 'https://example.com/textbook.pdf'
      });
      
      materials.push({
        teacherId: teachers[0]._id,
        subjectId: subject._id,
        title: `${subject.subjectName} - Practice Problems`,
        description: `Collection of practice problems with solutions for ${subject.subjectName}`,
        fileUrl: 'https://example.com/practice-problems.pdf'
      });
    }
    await StudyMaterial.insertMany(materials);
    console.log(`✅ Added ${materials.length} study materials`);

    console.log('\n🎉 All features enabled successfully!');
    console.log('\n📋 Available Features:');
    console.log('👨🏫 Teacher Features:');
    console.log('  • View assigned courses and subjects');
    console.log('  • Mark attendance for students');
    console.log('  • Create and manage assignments');
    console.log('  • Add marks and grades');
    console.log('  • Post notices to students');
    console.log('  • Upload notes and study materials');
    console.log('  • View attendance reports');
    
    console.log('\n👨🎓 Student Features:');
    console.log('  • View personal dashboard');
    console.log('  • Check attendance records');
    console.log('  • View and submit assignments');
    console.log('  • Check marks and grades');
    console.log('  • Read notices from teachers');
    console.log('  • Access notes and study materials');
    console.log('  • View subject-wise performance');

  } catch (error) {
    console.error('❌ Error enabling features:', error);
  } finally {
    mongoose.connection.close();
  }
}

enableAllFeatures();