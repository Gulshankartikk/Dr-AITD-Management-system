const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const config = {
  // Server Configuration
  PORT: process.env.PORT || 4001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database Configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'college-erp-jwt-secret-key-2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // Cloudinary Configuration
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET
  },

  // Email Configuration
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    FROM: process.env.EMAIL_FROM || 'noreply@college.edu'
  },

  // Default Passwords
  DEFAULT_PASSWORDS: {
    TEACHER: process.env.TEACHER_DEFAULT_PASSWORD || 'teacher123',
    STUDENT: process.env.STUDENT_DEFAULT_PASSWORD || 'student123'
  },

  // Admin Configuration
  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL || 'admin',
    PASSWORD: process.env.ADMIN_PASSWORD || 'admin'
  },

  // File Upload Configuration
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt'],
    UPLOAD_PATH: './uploads'
  },

  // CORS Configuration
  CORS: {
    ORIGIN: process.env.FRONTEND_URL || 'http://localhost:5173',
    CREDENTIALS: true
  }
};

module.exports = config;