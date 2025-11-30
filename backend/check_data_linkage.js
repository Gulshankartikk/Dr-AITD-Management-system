const mongoose = require('mongoose');
const { Student, Course, Subject, LearningResource } = require('./models/CompleteModels');
const dotenv = require('dotenv');

dotenv.config();

const checkLinkage = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college-erp');
        console.log('MongoDB Connected');

        // 1. Find Student
        const student = await Student.findOne({ rollNo: '2301660100001' });
        if (!student) {
            console.log('Student not found');
            process.exit(1);
        }
        console.log(`Student ID: ${student._id}`);
        console.log(`Student: ${student.name}, CourseId: ${student.courseId}`);

        // 2. Find Course
        const course = await Course.findById(student.courseId);
        if (!course) {
            console.log('Course not found');
        } else {
            console.log(`Course: ${course.courseName} (${course.courseCode})`);
        }

        // 3. Find Subjects for Course
        const subjects = await Subject.find({ courseId: student.courseId });
        console.log(`Found ${subjects.length} subjects for this course.`);
        subjects.forEach(s => console.log(` - Subject: ${s.subjectName} (${s._id})`));

        const subjectIds = subjects.map(s => s._id);

        // 4. Find Resources
        const resources = await LearningResource.find({
            subjectId: { $in: subjectIds },
            isActive: true,
            isPublished: true
        });
        console.log(`[RESULT] Found ${resources.length} ACTIVE & PUBLISHED resources.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkLinkage();
