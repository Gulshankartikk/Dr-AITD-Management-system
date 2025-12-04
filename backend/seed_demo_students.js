const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Student, Course } = require('./models/CompleteModels');
const dotenv = require('dotenv');

dotenv.config();

const seedDemoStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college-erp');
        console.log('MongoDB Connected');

        // Ensure a course exists
        let course = await Course.findOne({ courseCode: 'CSE' });
        if (!course) {
            course = await Course.create({
                courseName: 'Computer Science',
                courseCode: 'CSE',
                courseDuration: 4
            });
            console.log('Created CSE Course');
        }

        const demoStudents = [
            {
                rollNo: '2301660100001',
                name: 'Demo Student 1',
                email: 'student1@demo.com',
                password: 'student1',
                isDemo: true
            },
            {
                rollNo: '2301660100002',
                name: 'Demo Student 2',
                email: 'student2@demo.com',
                password: 'student2',
                isDemo: true
            }
        ];

        for (const data of demoStudents) {
            let student = await Student.findOne({ rollNo: data.rollNo });

            if (student) {
                // Reset demo student
                student.password = data.password;
                student.isDemo = true;
                student.passwordChanged = false; // Force password change
                student.name = data.name;
                student.email = data.email;
                student.courseId = course._id;
                await student.save();
                console.log(`Reset demo student: ${data.rollNo}`);
            } else {
                // Create new demo student
                await Student.create({
                    name: data.name,
                    email: data.email,
                    rollNo: data.rollNo,
                    password: data.password,
                    courseId: course._id,
                    isDemo: true,
                    passwordChanged: false,
                    phone: '0000000000'
                });
                console.log(`Created demo student: ${data.rollNo}`);
            }
        }

        console.log('Demo students seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding demo students:', error);
        process.exit(1);
    }
};

seedDemoStudents();
