const mongoose = require('mongoose');
const { Subject, Course, Teacher } = require('./models/CompleteModels');
const dotenv = require('dotenv');

dotenv.config();

const seedSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college-erp');
        console.log('MongoDB Connected');

        // 1. Find Course
        const course = await Course.findOne({ courseCode: 'CSE' });
        if (!course) {
            console.error('Course CSE not found. Run seed_demo_students.js first.');
            process.exit(1);
        }

        // 2. Find Teacher
        const teacher = await Teacher.findOne({ username: 'teacher' });
        if (!teacher) {
            console.error('Teacher not found. Run seed_auth_users.js first.');
            process.exit(1);
        }

        // 3. Create Subject
        let subject = await Subject.findOne({ subjectCode: 'CS101' });
        if (!subject) {
            subject = await Subject.create({
                subjectName: 'Data Structures',
                subjectCode: 'CS101',
                courseId: course._id,
                teacherId: teacher._id,
                semester: 1,
                credits: 4,
                subjectType: 'Theory',
                branch: 'CSE'
            });
            console.log('Created Subject: Data Structures');
        } else {
            console.log('Subject Data Structures already exists');
        }

        // 4. Assign Subject to Teacher (Update Teacher model)
        if (!teacher.assignedSubjects.includes(subject._id)) {
            teacher.assignedSubjects.push(subject._id);
            await teacher.save();
            console.log('Assigned Data Structures to Teacher');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding subjects:', error);
        process.exit(1);
    }
};

seedSubjects();
