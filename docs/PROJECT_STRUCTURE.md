# College ERP - Project Structure

## 📁 Root Directory Structure

```
College-ERP-main/
├── backend/                    # Backend API server
├── frontend/                   # React frontend application
├── config/                     # Global configuration files
├── docs/                       # Project documentation
├── scripts/                    # Utility and setup scripts
├── tests/                      # Integration and E2E tests
├── logs/                       # Application logs
├── backups/                    # Database backups
├── deployment/                 # Deployment configurations
├── package.json               # Root package configuration
└── README.md                  # Main project documentation
```

## 🔧 Backend Structure

```
backend/
├── controller/                 # Route controllers
│   ├── adminController.js
│   ├── teacherController.js
│   ├── studentController.js
│   └── notificationController.js
├── models/                     # Database models
│   └── CompleteModels.js
├── routes/                     # API route definitions
│   ├── completeRoutes.js
│   └── subjects.js
├── middleware/                 # Custom middleware
│   ├── Auth.js
│   └── upload.js
├── config/                     # Configuration files
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   ├── database.js            # Database configuration
│   └── environment.js         # Environment setup
├── services/                   # Business logic services
│   ├── authService.js         # Authentication service
│   └── emailService.js        # Email service
├── validators/                 # Input validation
│   └── userValidator.js       # User data validation
├── utils/                      # Utility scripts
│   ├── clearDB.js             # Database cleanup
│   ├── createAdmin.js         # Admin creation
│   ├── createStudents.js      # Student creation
│   ├── debugLogin.js          # Login debugging
│   ├── enableAllFeatures.js   # Feature enablement
│   ├── initializeSystem.js    # System initialization
│   ├── setupCompleteERP.js    # Complete setup
│   └── testLogin.js           # Login testing
├── uploads/                    # File upload directory
├── logs/                       # Backend logs
├── tests/                      # Backend tests
├── index.js                    # Server entry point
└── package.json               # Backend dependencies
```

## ⚛️ Frontend Structure

```
frontend/
├── public/                     # Static assets
│   └── vite.svg
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AdminHeader.jsx
│   │   ├── StudentHeader.jsx
│   │   ├── TeacherHeader.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── BackButton.jsx
│   │   ├── LoginToggle.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── CourseForm.jsx
│   │   ├── SubjectForm.jsx
│   │   └── TeacherModals.jsx
│   ├── Pages/                 # Page components
│   │   ├── admin/            # Admin pages
│   │   ├── Teacher/          # Teacher pages
│   │   ├── Student/          # Student pages
│   │   └── Common/           # Shared pages
│   ├── features/             # Redux slices
│   │   ├── UserSlice.js
│   │   ├── StudentSlice.js
│   │   ├── TeacherSlice.js
│   │   └── CourseSlice.js
│   ├── services/             # API services
│   │   ├── api.js            # Base API configuration
│   │   └── authService.js    # Authentication service
│   ├── utils/                # Utility functions
│   │   ├── validation.js     # Form validation
│   │   └── constants.js      # Application constants
│   ├── hooks/                # Custom React hooks
│   ├── context/              # React context providers
│   ├── layouts/              # Layout components
│   ├── styles/               # CSS and styling files
│   │   ├── index.css
│   │   ├── AdminHeader.css
│   │   ├── LoginToggle.css
│   │   └── Loader.css
│   ├── assets/               # Images and static files
│   │   ├── logo.jpeg
│   │   └── dr-ambedkar-institute-of-technology-for-handicapped-kanpur.jpeg.jpg
│   ├── app/                  # Redux store configuration
│   │   └── Store.js
│   ├── Layout.jsx            # Main layout component
│   └── main.jsx              # Application entry point
├── package.json              # Frontend dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── .eslintrc.cjs             # ESLint configuration
```

## 📋 Configuration Files

### Global Configuration
- `config/app.config.js` - Main application configuration
- `scripts/` - Setup and utility scripts
- `docs/` - Project documentation

### Backend Configuration
- `backend/config/.env` - Environment variables
- `backend/config/environment.js` - Environment setup
- `backend/config/database.js` - Database configuration

### Frontend Configuration
- `frontend/src/utils/constants.js` - Application constants
- `frontend/src/services/api.js` - API configuration
- `frontend/vite.config.js` - Build configuration
- `frontend/tailwind.config.js` - Styling configuration

## 🔄 Data Flow

1. **Frontend** → API calls → **Backend Services**
2. **Backend Services** → **Controllers** → **Models** → **Database**
3. **Middleware** handles authentication and file uploads
4. **Validators** ensure data integrity
5. **Services** contain business logic

## 🚀 Key Features by Module

### Admin Module
- User management (students, teachers)
- Course and subject management
- System configuration
- Reports and analytics

### Teacher Module
- Attendance management
- Assignment creation and grading
- Study material upload
- Student progress tracking

### Student Module
- Attendance viewing
- Assignment submission
- Study material access
- Personal dashboard

## 📝 Development Guidelines

1. **Backend**: Follow MVC pattern with service layer
2. **Frontend**: Use component-based architecture with Redux
3. **Styling**: Tailwind CSS with custom theme
4. **Validation**: Client and server-side validation
5. **Authentication**: JWT-based with role-based access
6. **File Handling**: Multer for uploads with validation

## 🔧 Environment Setup

1. Install dependencies: `npm run install-all`
2. Setup environment: `npm run setup-env`
3. Start development: `npm start`
4. Run tests: `npm test`
5. Build production: `npm run build`

## 📊 Database Schema

- **Users**: Admin, Teacher, Student models
- **Academic**: Course, Subject, Semester models
- **Activities**: Attendance, Assignment, Material models
- **System**: Notification, Log models

This structure promotes:
- ✅ Separation of concerns
- ✅ Scalability and maintainability
- ✅ Code reusability
- ✅ Clear development workflow
- ✅ Easy testing and deployment