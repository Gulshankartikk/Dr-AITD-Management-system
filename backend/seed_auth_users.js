const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Teacher, Admin } = require('./models/CompleteModels');
const dotenv = require('dotenv');

dotenv.config();

const seedAuthUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college-erp');
        console.log('MongoDB Connected');

        // 1. Seed Admin
        let admin = await Admin.findOne({ username: 'admin' });
        if (!admin) {
            await Admin.create({
                name: 'Administrator',
                email: 'admin@college.edu',
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin account created: admin / admin123');
        } else {
            // Ensure password is correct
            admin.password = 'admin123';
            await admin.save();
            console.log('Admin password updated to default');
        }

        // 2. Seed Teacher
        let teacher = await Teacher.findOne({ username: 'teacher' });
        if (!teacher) {
            await Teacher.create({
                name: 'Demo Teacher',
                email: 'teacher@college.edu',
                username: 'teacher',
                password: 'teacher123',
                department: 'CSE',
                designation: 'Professor'
            });
            console.log('Teacher account created: teacher / teacher123');
        } else {
            // Ensure password is correct
            teacher.password = 'teacher123';
            await teacher.save();
            console.log('Teacher password updated to default');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding auth users:', error);
        process.exit(1);
    }
};

seedAuthUsers();
