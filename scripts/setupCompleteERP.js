const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const { Admin, Course, Subject, Teacher, Student } = require('./backend/models/CompleteModels');

const setupERP = async () => {
  try {
    console.log('🚀 Starting College ERP Setup...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create Admin User
    const adminExists = await Admin.findOne({ email: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      const admin = new Admin({
        name: 'System Administrator',
        email: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created (admin / admin)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create Sample Courses
    const courseExists = await Course.findOne({ courseCode: 'CSE' });
    if (!courseExists) {
      const courses = [
        { courseName: 'Computer Science Engineering', courseCode: 'CSE', courseDuration: '4 Years' },
        { courseName: 'Information Technology', courseCode: 'IT', courseDuration: '4 Years' },
        { courseName: 'Electronics Engineering', courseCode: 'ECE', courseDuration: '4 Years' }
      ];
      
      await Course.insertMany(courses);
      console.log('✅ Sample courses created');
    } else {
      console.log('ℹ️ Courses already exist');
    }

    // Create Sample Subjects
    const subjectExists = await Subject.findOne({ subjectCode: 'CSE101' });
    if (!subjectExists) {
      const cseCourse = await Course.findOne({ courseCode: 'CSE' });
      const subjects = [
        { subjectName: 'Programming Fundamentals', subjectCode: 'CSE101', courseId: cseCourse._id },
        { subjectName: 'Data Structures', subjectCode: 'CSE201', courseId: cseCourse._id },
        { subjectName: 'Database Management', subjectCode: 'CSE301', courseId: cseCourse._id }
      ];
      
      await Subject.insertMany(subjects);
      console.log('✅ Sample subjects created');
    } else {
      console.log('ℹ️ Subjects already exist');
    }

    console.log('🎉 College ERP Setup Complete!');
    console.log('📋 Login Credentials:');
    console.log('   Admin: admin / admin');
    console.log('🌐 Access URLs:');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend: http://localhost:4000');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupERP();
}

module.exports = setupERP;