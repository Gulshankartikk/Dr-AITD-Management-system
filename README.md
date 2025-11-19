# College ERP Management System

A comprehensive Enterprise Resource Planning (ERP) system designed for educational institutions to manage students, teachers, courses, and administrative tasks.

## 🚀 Features

### Admin Panel
- **Dashboard**: Overview of system statistics
- **User Management**: Create and manage students and teachers
- **Course Management**: Add courses and subjects
- **Assignment Tracking**: Monitor teacher activities
- **Attendance Reports**: Comprehensive attendance analytics

### Teacher Portal
- **Dashboard**: Personal teaching overview
- **Attendance Management**: Mark and track student attendance
- **Assignment Upload**: Create and manage assignments
- **Study Materials**: Upload and share learning resources
- **Student Progress**: Monitor individual student performance

### Student Portal
- **Dashboard**: Personal academic overview
- **Attendance Tracking**: View attendance records
- **Assignments**: Access and submit assignments
- **Study Materials**: Download course materials
- **Notes**: Access teacher-uploaded notes

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Cloudinary** for media storage (optional)

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Icons** for UI icons

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd College-ERP-main
npm run install-all
```

### 2. Environment Configuration
```bash
# Backend environment is auto-created
# Modify backend/.env if needed
```

### 3. Initialize Database
```bash
npm run setup-env
```

### 4. Start the Application
```bash
npm start
```

### 5. Access the System
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

## 🔐 Default Login Credentials

### Admin Access
- **Username**: admin
- **Password**: admin

### Teacher Access
- Teachers are created by admin
- Default password: teacher123

### Student Access
- Students are created by admin
- Default password: student123

## 📁 Project Structure

```
College-ERP-main/
├── backend/                 # Backend API server
│   ├── controller/         # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication & middleware
│   ├── config/            # Configuration files
│   ├── services/          # Business logic services
│   ├── validators/        # Input validation
│   ├── utils/             # Utility scripts
│   ├── uploads/           # File upload directory
│   ├── logs/              # Backend logs
│   └── index.js           # Server entry point
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── Pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context
│   │   ├── layouts/       # Layout components
│   │   ├── styles/        # CSS files
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── config/                # Global configuration
├── docs/                  # Documentation
├── scripts/               # Setup & utility scripts
├── tests/                 # Integration tests
├── logs/                  # Application logs
├── backups/               # Database backups
├── deployment/            # Deployment configs
└── package.json           # Root configuration
```

📖 **Detailed Structure**: See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

## 🔧 Available Scripts

```bash
# Quick Start
npm run install-all     # Install all dependencies
npm run setup-env       # Initialize database
npm start              # Start both servers

# Development
npm run backend        # Start backend only
npm run frontend       # Start frontend only
npm run dev           # Start both in development mode

# Production
npm run build         # Build for production

# Maintenance
npm run health-check  # System health check
npm run clean         # Clean node_modules
npm run clean-logs    # Clean log files
npm run backup-db     # Backup database
npm run restore-db    # Restore database

# Testing & Quality
npm test              # Run all tests
npm run lint          # Run linting
```

📖 **Setup Guide**: See [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

## 🌐 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/teacher/login` - Teacher login
- `POST /api/student/login` - Student login

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard data
- `POST /api/admin/teachers` - Create teacher
- `POST /api/admin/students` - Create student
- `POST /api/admin/courses` - Create course
- `POST /api/admin/subjects` - Create subject

### Teacher Routes
- `GET /api/teacher/dashboard` - Teacher dashboard
- `POST /api/teacher/attendance` - Mark attendance
- `POST /api/teacher/assignments` - Create assignment
- `POST /api/teacher/materials` - Upload materials

### Student Routes
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/attendance` - View attendance
- `GET /api/student/assignments` - View assignments
- `GET /api/student/materials` - Access materials

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, Teacher, Student roles
- **Password Hashing**: Bcrypt encryption
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin request security

## 📊 Database Schema

### Core Models
- **Admin**: System administrators
- **Teacher**: Faculty members
- **Student**: Enrolled students
- **Course**: Academic programs
- **Subject**: Course subjects
- **Attendance**: Attendance records
- **Assignment**: Student assignments
- **StudyMaterial**: Learning resources

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
# Deploy backend to your server
# Deploy frontend build to static hosting
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in backend/.env

2. **Port Already in Use**
   - Change PORT in backend/.env
   - Update BASE_URL in frontend/src/constants/baseUrl.js

3. **Dependencies Issues**
   - Run `npm run install-all`
   - Clear node_modules and reinstall

### Health Check
```bash
npm run health-check
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the documentation
- Create an issue in the repository

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Integration with external systems
- [ ] Advanced analytics dashboard
- [ ] Bulk operations
- [ ] Export functionality

---

**College ERP Management System** - Streamlining educational administration with modern technology.