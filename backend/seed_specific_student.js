const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Student, Course } = require('./models/CompleteModels');
const dotenv = require('dotenv');

dotenv.config();

const seedStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college-erp');
        console.log('MongoDB Connected');

        const rollNo = '2301660100001';
        const password = 'student1';

        let student = await Student.findOne({ rollNo });

        if (student) {
            student.password = password;
            await student.save();
            console.log(`Updated password for student ${rollNo}`);
        } else {
            // Find a course to assign (fallback to creating one if needed, but usually courses exist)
            let course = await Course.findOne();
            if (!course) {
                course = await Course.create({
                    courseName: 'Computer Science',
                    courseCode: 'CSE',
                    courseDuration: 4
                });
                console.log('Created dummy course');
            }

            student = await Student.create({
                name: 'Test Student',
                email: 'teststudent@example.com',
                username: rollNo, // Using rollNo as username for consistency if needed, though login uses rollNo query now
                rollNo: rollNo,
                password: password,
                courseId: course._id,
                phone: '1234567890'
            });
            console.log(`Created new student ${rollNo}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding student:', error);
        process.exit(1);
    }
};

seedStudent();
