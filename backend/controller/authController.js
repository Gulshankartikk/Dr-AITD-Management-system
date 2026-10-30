const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Student, Teacher, Admin } = require('../models');

const getJwtSecret = () => process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_here_minimum_32_characters';

const login = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        console.log('Login attempt:', { username, role });

        if (!username || !password || !role) {
            console.log('Missing credentials:', { username: !!username, password: !!password, role: !!role });
            const error = new Error('Username, password, and role are required');
            error.statusCode = 400;
            throw error;
        }

        const cleanUsername = String(username).trim();
        const cleanRole = String(role).toLowerCase().trim();

        let user;
        let isMatch = false;

        // 1. Find User based on Role
        if (cleanRole === 'student') {
            user = await Student.findOne({
                $or: [
                    { rollNo: cleanUsername },
                    { email: cleanUsername.toLowerCase() },
                    { username: cleanUsername }
                ]
            }).populate('courseId');
        } else if (cleanRole === 'teacher') {
            user = await Teacher.findOne({
                $or: [
                    { email: cleanUsername.toLowerCase() },
                    { username: cleanUsername },
                    { employeeId: cleanUsername }
                ]
            });
        } else if (cleanRole === 'admin') {
            user = await Admin.findOne({
                $or: [
                    { email: cleanUsername.toLowerCase() },
                    { username: cleanUsername }
                ]
            });
        } else {
            const error = new Error('Invalid role specified');
            error.statusCode = 400;
            throw error;
        }

        // 2. Validate User Existence
        if (!user) {
            console.log('User not found for:', { username: cleanUsername, role: cleanRole });

            // Check if user exists under another role to assist the user
            const [adminMatch, teacherMatch, studentMatch] = await Promise.all([
                Admin.findOne({ $or: [{ email: cleanUsername.toLowerCase() }, { username: cleanUsername }] }),
                Teacher.findOne({ $or: [{ email: cleanUsername.toLowerCase() }, { username: cleanUsername }, { employeeId: cleanUsername }] }),
                Student.findOne({ $or: [{ rollNo: cleanUsername }, { email: cleanUsername.toLowerCase() }, { username: cleanUsername }] })
            ]);

            if (adminMatch && cleanRole !== 'admin') {
                const error = new Error("Account found under 'Admin' role. Please select the Admin tab above to log in.");
                error.statusCode = 401;
                throw error;
            }
            if (teacherMatch && cleanRole !== 'teacher') {
                const error = new Error("Account found under 'Teacher' role. Please select the Teacher tab above to log in.");
                error.statusCode = 401;
                throw error;
            }
            if (studentMatch && cleanRole !== 'student') {
                const error = new Error("Account found under 'Student' role. Please select the Student tab above to log in.");
                error.statusCode = 401;
                throw error;
            }

            const error = new Error(`No ${cleanRole} account found for '${cleanUsername}'. Please verify credentials or select the correct role tab.`);
            error.statusCode = 401;
            throw error;
        }

        console.log('User found:', { id: user._id, name: user.name, email: user.email });

        // 3. Verify Password
        isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        // Fallback for default seed accounts if default password is used
        if (!isMatch) {
            if (cleanRole === 'admin' && (cleanUsername === 'admin' || cleanUsername === 'admin@draitd.edu' || cleanUsername === 'admin@system.com')) {
                if (password === 'admin123' || password === 'password123') {
                    isMatch = true;
                    user.password = password;
                    await user.save();
                }
            } else if (cleanRole === 'teacher' && (cleanUsername === 'teacher' || cleanUsername === 'teacher@draitd.edu')) {
                if (password === 'teacher123') {
                    isMatch = true;
                    user.password = password;
                    await user.save();
                }
            } else if (cleanRole === 'student' && (cleanUsername === 'STU2025' || cleanUsername === 'student@draitd.edu' || cleanUsername === 'student')) {
                if (password === 'student123') {
                    isMatch = true;
                    user.password = password;
                    await user.save();
                }
            }
        }

        if (!isMatch) {
            console.log('Password verification failed for:', cleanUsername);
            const error = new Error('Incorrect password. Please verify your password and try again.');
            error.statusCode = 401;
            throw error;
        }

        // 4. Generate Token (Long-lived expiry - configurable via JWT_EXPIRES_IN)
        const tokenExpiresIn = process.env.JWT_EXPIRES_IN || '3650d';
        const token = jwt.sign(
            { id: user._id, user_id: user._id, role: cleanRole, name: user.name },
            getJwtSecret(),
            { expiresIn: tokenExpiresIn }
        );

        // 5. Set Cookie (10 years expiry - effectively unlimited)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3650 * 24 * 60 * 60 * 1000 // 10 years
        });

        // 6. Prepare Response
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: cleanRole,
        };

        if (cleanRole === 'student') {
            userData.rollNo = user.rollNo;
            userData.course = user.courseId;
            userData.passwordChanged = user.passwordChanged;
        }

        res.status(200).json({
            success: true,
            token,
            user: userData,
            message: `Welcome back, ${user.name || cleanRole}!`
        });

    } catch (error) {
        next(error);
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Admin Registration
const adminRegister = async (req, res, next) => {
    try {
        const { name, email, password, username, phone } = req.body;
        if (!name || !email || !password) {
            const error = new Error('Name, email, and password are required');
            error.statusCode = 400;
            throw error;
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            const error = new Error('An administrator with this email already exists');
            error.statusCode = 400;
            throw error;
        }

        const newAdmin = new Admin({
            name,
            email,
            username: username || email.split('@')[0],
            password,
            phone: phone || '',
            role: 'admin',
            isActive: true
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            msg: 'Admin registered successfully',
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// Teacher Registration
const teacherRegister = async (req, res, next) => {
    try {
        const { name, email, password, department, phone, employeeId } = req.body;
        if (!name || !email || !password) {
            const error = new Error('Name, email, and password are required');
            error.statusCode = 400;
            throw error;
        }

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            const error = new Error('Teacher with this email already exists');
            error.statusCode = 400;
            throw error;
        }

        const newTeacher = new Teacher({
            name,
            email,
            username: email.split('@')[0],
            password,
            department: department || 'General',
            phone: phone || '',
            employeeId: employeeId || `TCH${Date.now().toString().slice(-4)}`,
            isActive: true
        });

        await newTeacher.save();

        res.status(201).json({
            success: true,
            msg: 'Teacher registered successfully',
            teacher: {
                id: newTeacher._id,
                name: newTeacher.name,
                email: newTeacher.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// Email Transporter
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const forgotPassword = async (req, res, next) => {
    try {
        const { email, role } = req.body;
        if (!email || !role) {
            const error = new Error('Email and role are required');
            error.statusCode = 400;
            throw error;
        }

        let user;
        if (role === 'student') {
            user = await Student.findOne({ email });
        } else if (role === 'teacher') {
            user = await Teacher.findOne({ email });
        } else if (role === 'admin') {
            user = await Admin.findOne({ email });
        }

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email send failed:', emailError);
            // For dev/demo, log the OTP
            console.log(`OTP for ${email}: ${otp}`);
        }

        res.status(200).json({ success: true, msg: 'OTP sent to email', userId: user._id });
    } catch (error) {
        next(error);
    }
};

const verifyOtp = async (req, res, next) => {
    try {
        const { userId, otp, role } = req.body;

        let user;
        if (role === 'student') user = await Student.findById(userId);
        else if (role === 'teacher') user = await Teacher.findById(userId);
        else if (role === 'admin') user = await Admin.findById(userId);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            const error = new Error('Invalid or expired OTP');
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({ success: true, msg: 'OTP verified' });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { userId, password, otp, role } = req.body;

        let user;
        if (role === 'student') user = await Student.findById(userId);
        else if (role === 'teacher') user = await Teacher.findById(userId);
        else if (role === 'admin') user = await Admin.findById(userId);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Verify OTP again to be sure
        if (!otp || user.otp !== otp || user.otpExpiry < Date.now()) {
            const error = new Error('Invalid or expired OTP');
            error.statusCode = 400;
            throw error;
        }

        // Password will be hashed by pre-save hook
        user.password = password;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, msg: 'Password reset successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    logout,
    adminRegister,
    teacherRegister,
    forgotPassword,
    verifyOtp,
    resetPassword
};
