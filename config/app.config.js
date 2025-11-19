module.exports = {
  // Application Configuration
  app: {
    name: 'College ERP Management System',
    version: '1.0.0',
    description: 'Comprehensive ERP system for educational institutions',
    author: 'College ERP Team',
    license: 'MIT'
  },

  // Environment Configuration
  environment: {
    development: {
      frontend: {
        port: 5173,
        url: 'http://localhost:5173'
      },
      backend: {
        port: 4001,
        url: 'http://localhost:4001'
      }
    },
    production: {
      frontend: {
        port: process.env.FRONTEND_PORT || 3000,
        url: process.env.FRONTEND_URL || 'https://your-domain.com'
      },
      backend: {
        port: process.env.PORT || 4000,
        url: process.env.BACKEND_URL || 'https://api.your-domain.com'
      }
    }
  },

  // Database Configuration
  database: {
    development: {
      uri: 'mongodb://localhost:27017/college-erp-dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    production: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  },

  // Security Configuration
  security: {
    jwt: {
      secret: process.env.JWT_SECRET || 'college-erp-jwt-secret-key-2024',
      expiresIn: '24h'
    },
    bcrypt: {
      saltRounds: 12
    }
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    uploadPath: './uploads'
  },

  // Email Configuration
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@college.edu'
  },

  // Default Credentials
  defaults: {
    admin: {
      email: 'admin',
      password: 'admin'
    },
    teacher: {
      password: 'teacher123'
    },
    student: {
      password: 'student123'
    }
  }
};