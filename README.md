# Dr AITD Management System

A comprehensive, modern Enterprise Resource Planning (ERP) solution designed specifically for **Dr AITD**. This system streamlines administrative tasks, empowers teachers with digital tools, and engages students through a unified, user-friendly platform.

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-yellow)
![Architecture](https://img.shields.io/badge/Architecture-MVC%20%2B%20Modular-orange)

---

## 🚀 Key Features

### 🎓 Student Portal
*   **Dashboard**: Real-time overview of attendance, notices, and upcoming events.
*   **Academics**: Access to lecture notes, study materials, assignments, and exam results.
*   **Administrative**: View fee status, payment history, and apply for leave.
*   **Timetable**: Personalized class schedules.
*   **Profile Management**: Update personal details and manage account security.
*   **Learning Resources**: Access a digital library of course materials (Videos, PDFs, Notes).
*   **Library Access**: Browse and search available books.

### 👨‍🏫 Teacher Portal
*   **Class Management**: Efficiently mark attendance and manage subject-wise student lists.
*   **Academic Tools**: Upload and manage assignments, marks, and learning resources.
*   **Communication**: Post class-specific notices and announcements.
*   **Analytics**: View detailed attendance reports and student performance metrics.
*   **Timetable**: View assigned teaching schedules.
*   **Leave Management**: Apply for leave and track status.
*   **Resource Management**: Upload and organize learning materials for students.

### 🛡️ Admin Portal
*   **User Management**: Full control over Student, Teacher, and Admin accounts.
*   **Course & Subject Management**: Create and configure courses, branches, and subjects.
*   **Timetable Management**: Create and modify class schedules for all courses.
*   **Fee Management**: Track student fee payments, dues, and generate reports.
*   **Library Management**: Manage book inventory, issue/return books, and track overdue items.
*   **Reports**: Generate comprehensive reports for attendance, academics, and enrollment.
*   **Notices Management**: Create and manage institution-wide announcements.
*   **System Settings**: Configure institution details and system preferences.

---

## 🛠️ Tech Stack & Architecture

### Backend (Clean Architecture)
*   **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
*   **Models**: Domain-Driven Design (Users, Academics, Activities, Operations)
*   **Security**: 
    *   JWT (JSON Web Tokens) for stateless authentication (30-day expiry)
    *   BCrypt for password hashing
    *   CORS configured for secure cross-origin requests
    *   HttpOnly cookies for enhanced security
*   **File Handling**: Multer for local file storage (assignments, materials, resources)
*   **Email**: Nodemailer for password reset and notifications

### Frontend
*   **Framework**: [React.js](https://reactjs.org/) (v18) with [Vite](https://vitejs.dev/)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
*   **Routing**: [React Router DOM](https://reactrouter.com/) v6
*   **HTTP Client**: Axios with interceptors for token management
*   **UI Components**: Custom ShadCN-style components
*   **Icons**: Lucide React
*   **Notifications**: React Toastify

---

## 📋 System Requirements

### Development Environment
*   **Node.js**: v18.0.0 or higher
*   **MongoDB**: v5.0 or higher (local or Atlas)
*   **npm**: v8.0.0 or higher
*   **Operating System**: Windows, macOS, or Linux

### Production Environment
*   **Memory**: Minimum 512MB RAM (1GB recommended)
*   **Storage**: 1GB minimum for application and uploads
*   **Network**: Stable internet connection for cloud deployment

---

## ⚙️ Local Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Dr AITD Management system"
```

### 2. Install All Dependencies (Recommended)
```bash
npm run install-all
```
This will install dependencies for both backend and frontend.

### 3. Backend Configuration

Navigate to backend directory:
```bash
cd backend
```

Create a `.env` file in `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college-erp
JWT_SECRET=your_secure_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

### 4. Frontend Configuration

Create a `.env.local` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```

### 5. Enterprise Demo Data Seeding & Testing

The system features an automated, idempotent demo seeder providing interconnected academic records:
```bash
# Seed or update full interconnected demo dataset (Courses, Faculty, Students, Timetables, Fees, Library, Marks)
npm run seed:demo

# Inspect current collection counts across the database
npm run seed:inspect

# Safely purge only demo-tagged records without touching production or manual data
npm run seed:clean

# Run the full automated QA & functional test suite (71 tests)
npm test
```

**Verified Test Credentials:**
*   **System Admin**: `admin` / `admin123`
*   **Faculty (CSE)**: `prof_sunita` / `teacher123`
*   **Faculty (IT)**: `dr_priyanshu` / `teacher123`
*   **Faculty (General)**: `teacher` / `teacher123`
*   **Student (CSE)**: `STU2025` / `student123` (Roll No: `STU2025`)
*   **Student (IT)**: `26it001` / `student123` (Roll No: `26IT001`)

---

## 🏃‍♂️ Running the Application

### Option 1: Concurrent Start (Recommended)
From the root directory:
```bash
npm start
```
This runs both backend and frontend simultaneously.

### Option 2: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Accessing the Application
*   **Frontend**: `http://localhost:5173`
*   **Backend API**: `http://localhost:5000/api`
*   **API Health Check**: `http://localhost:5000/`

---

## 🔧 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "role": "admin"
}
```

#### Logout
```http
POST /api/auth/logout
```

### Public Endpoints
*   `GET /api/courses` - Get all active courses
*   `GET /api/subjects` - Get all active subjects

### Protected Endpoints (Require Authentication)

#### Admin Routes
*   `GET /api/admin/dashboard` - Dashboard statistics
*   `GET /api/admin/students` - All students
*   `POST /api/admin/students` - Create student
*   `PUT /api/admin/students/:id` - Update student
*   `DELETE /api/admin/students/:id` - Delete student
*   `GET /api/admin/teachers` - All teachers
*   `POST /api/admin/teachers` - Create teacher
*   `GET /api/admin/courses` - All courses
*   `POST /api/admin/courses` - Create course
*   `GET /api/admin/subjects` - All subjects
*   `POST /api/admin/subjects` - Create subject

#### Teacher Routes
*   `GET /api/teacher/:teacherId/dashboard` - Teacher dashboard
*   `GET /api/teacher/:teacherId/subjects` - Assigned subjects
*   `GET /api/teacher/:teacherId/students` - Students list
*   `POST /api/teacher/:teacherId/attendance` - Mark attendance
*   `POST /api/teacher/:teacherId/assignments` - Create assignment
*   `POST /api/teacher/:teacherId/marks` - Add marks

#### Student Routes
*   `GET /api/student/:studentId/dashboard` - Student dashboard
*   `GET /api/student/:studentId/subjects` - Enrolled subjects
*   `GET /api/student/:studentId/attendance` - Attendance records
*   `GET /api/student/:studentId/marks` - Marks/grades
*   `GET /api/student/:studentId/assignments` - Assignments
*   `GET /api/student/:studentId/fees` - Fee details

---

## 📂 Project Structure

```
Dr AITD Management system/
├── backend/
│   ├── controller/              # Business Logic
│   │   ├── adminController.js
│   │   ├── teacherController.js
│   │   ├── studentController.js
│   │   └── authController.js
│   ├── database/
│   │   └── db.js               # MongoDB Connection
│   ├── middleware/
│   │   ├── Auth.js             # JWT Verification
│   │   ├── upload.js           # File Upload Handler
│   │   ├── errorHandler.js     # Global Error Handler
│   │   └── validateId.js       # ID Validation
│   ├── models/                 # Mongoose Schemas
│   │   ├── Users.js            # Admin, Teacher, Student
│   │   ├── Academics.js        # Course, Subject, Timetable
│   │   ├── Activities.js       # Attendance, Marks, Assignments
│   │   ├── Operations.js       # Fee, Library, Leave
│   │   └── index.js            # Model Exports
│   ├── routes/
│   │   └── completeRoutes.js   # All API Routes
│   ├── uploads/                # File Storage
│   ├── .env                    # Environment Variables
│   ├── index.js                # Server Entry Point
│   ├── package.json
│   └── seed_auth_users.js      # Database Seeding Script
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js    # Configured Axios
│   │   ├── app/
│   │   │   └── Store.js            # Redux Store
│   │   ├── components/
│   │   │   ├── layout/             # Sidebar, Navbar
│   │   │   ├── ui/                 # Reusable UI Components
│   │   │   ├── RequireAuth.jsx     # Route Protection
│   │   │   └── ErrorBoundary.jsx
│   │   ├── constants/
│   │   │   └── api.js              # API Base URL
│   │   ├── features/
│   │   │   └── UserSlice.js        # Redux User State
│   │   ├── hooks/
│   │   │   └── useAutoLogout.js    # Auto Logout Hook
│   │   ├── Pages/
│   │   │   ├── Admin/              # Admin Pages
│   │   │   ├── Teacher/            # Teacher Pages
│   │   │   ├── Student/            # Student Pages
│   │   │   └── Common/             # Login, Register
│   │   ├── services/
│   │   │   ├── adminService.js     # Admin API Calls
│   │   │   └── authService.js      # Auth API Calls
│   │   ├── Layout.jsx              # Main Layout
│   │   ├── main.jsx                # App Entry Point
│   │   └── index.css               # Global Styles
│   ├── .env.local                  # Frontend Environment
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── package.json                    # Root Package (Scripts)
└── README.md                       # This File
```

---

## 🔍 Troubleshooting

### Common Issues & Solutions

#### 1. "No courses available" in Registration
**Cause**: API endpoint mismatch or backend not running  
**Solution**:
```bash
# Ensure backend is running
cd backend
npm start

# Verify courses exist
node check_courses.js
```

#### 2. Login fails with 401 Unauthorized
**Cause**: Invalid credentials or database not seeded  
**Solution**:
```bash
cd backend
node seed_auth_users.js
```

#### 3. Sidebar not visible
**Cause**: Token not stored properly  
**Solution**: Clear browser cache and localStorage, then login again

#### 4. Port already in use
**Cause**: Previous instance still running  
**Solution**:
```bash
# Windows
netstat -ano | findstr :4000
taskkill /F /PID <process_id>

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

#### 5. CORS errors
**Cause**: Frontend and backend origins mismatch  
**Solution**: Verify `VITE_API_URL` in frontend `.env.local` matches backend URL

#### 6. MongoDB connection failed
**Cause**: MongoDB not running or wrong connection string  
**Solution**:
```bash
# Start MongoDB (Windows)
net start MongoDB

# Or use MongoDB Atlas cloud database
```

---

## 🚀 Deployment & Hosting Guide

This project is set up for easy deployment: the **backend** is optimized for [Render](https://render.com), and the **frontend** can be deployed on either [Netlify](https://netlify.com) or Render.

---

### 🌐 Frontend Deployment (Netlify) - *Recommended*

We have configured `netlify.toml` in the root of the project to automate the frontend build and routing.

> [!NOTE]
> **Netlify Subdirectory Build Fix:**
> The `netlify.toml` is configured with `base = "frontend"`. In Netlify, when `base` is specified, the build command runs inside that directory, and the `publish` directory is resolved relative to the base directory. The publish directory has been corrected to `dist` (resolving to `frontend/dist`), fixing the previous deployment failure.

#### Step-by-Step Netlify Setup:
1. Log in to your [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project** and connect your GitHub repository.
3. Netlify will automatically detect the `netlify.toml` and configure the settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Configure Environment Variables**:
   - Go to **Site settings** → **Environment variables**
   - Click **Add a variable** and set:
     - `VITE_API_URL`: `https://your-backend-url.onrender.com` (Your deployed Render backend URL)
5. Click **Deploy** (or trigger a new deploy if already connected).

---

### 🖥️ Backend Deployment (Render)

#### Step-by-Step Render Setup:
1. Log in to [Render](https://render.com) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the Web Service settings:
   - **Name**: `dr-aitd-backend`
   - **Region**: Choose the region closest to your users.
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`
4. **Configure Environment Variables**:
   - Click on the **Environment** tab and add:
     - `NODE_ENV`: `production`
     - `MONGO_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/college-erp`)
     - `JWT_SECRET`: A secure random string (minimum 32 characters)
     - `FRONTEND_URL`: `https://your-app-name.netlify.app` (Your Netlify frontend URL)
5. Click **Create Web Service**. Once the build finishes, copy the generated service URL and update the `VITE_API_URL` variable in your Netlify settings.

---

### 📦 Option 2: Render Blueprint (Full Stack)

You can also deploy the entire stack using Render's Blueprint.
1. Ensure your repository has a `render.yaml` (or configure a blueprint manually).
2. Go to Render → **New +** → **Blueprint**.
3. Select your repository and fill in the required environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `VITE_API_URL` (Points to the backend service URL)

---

### 🔧 Troubleshooting Deployment Issues

#### 1. "Network Error" on Login / Redirection to Login
*   **Cause**: The frontend is unable to reach the backend.
*   **Solution**: Double-check that `VITE_API_URL` in Netlify matches your Render backend URL exactly (including `https://` and without a trailing slash).

#### 2. CORS Errors (Origin Blocked)
*   **Cause**: The backend is blocking requests from the frontend origin.
*   **Solution**: Ensure the `FRONTEND_URL` environment variable is set in your Render backend configuration and matches your Netlify URL (e.g., `https://your-site.netlify.app`).

#### 3. MongoDB Connection Failures
*   **Cause**: The database connection string is invalid or Render's IP is blocked.
*   **Solution**:
    1. Verify your `MONGO_URI` connection string.
    2. In MongoDB Atlas, go to **Network Access** and ensure you have whitelisted `0.0.0.0/0` (allow access from anywhere) so Render's dynamic IPs can connect.

#### 4. JWT Authentication Fails (401 Unauthorized)
*   **Cause**: `JWT_SECRET` is missing, short, or mismatched.
*   **Solution**: Ensure `JWT_SECRET` is defined in the backend environment variables on Render. Use a strong, random 32+ character string.


---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] Admin can login and access dashboard
- [ ] Admin can create/edit/delete students
- [ ] Admin can create/edit/delete teachers
- [ ] Admin can create courses and subjects
- [ ] Teacher can mark attendance
- [ ] Teacher can upload assignments
- [ ] Student can view marks and attendance
- [ ] Student can register with course selection
- [ ] Password reset flow works
- [ ] File uploads work correctly

---

## 🔐 Security Features

*   **JWT Authentication**: Secure token-based authentication with 30-day expiry
*   **Password Hashing**: BCrypt with salt rounds for secure password storage
*   **HttpOnly Cookies**: Prevents XSS attacks on authentication tokens
*   **CORS Protection**: Configured allowed origins
*   **Input Validation**: Mongoose schema validation
*   **Error Handling**: Global error handler prevents information leakage
*   **Role-Based Access Control**: Separate routes and permissions for Admin/Teacher/Student
*   **Auto Logout**: Configurable session timeout for inactive users

---

## 📊 Database Schema

### Users Collection
*   **Admin**: System administrators
*   **Teacher**: Faculty members
*   **Student**: Enrolled students

### Academics Collection
*   **Course**: Degree programs (B.Tech, M.Tech, etc.)
*   **Subject**: Individual subjects/courses
*   **Timetable**: Class schedules

### Activities Collection
*   **Attendance**: Daily attendance records
*   **Marks**: Exam and assessment marks
*   **Assignments**: Homework and projects
*   **Notices**: Announcements

### Operations Collection
*   **Fee**: Fee structure and payments
*   **Library**: Book inventory and transactions
*   **Leave**: Leave applications

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
*   Follow ESLint configuration
*   Use meaningful variable and function names
*   Add comments for complex logic
*   Write unit tests for new features
*   Update documentation for API changes

---

## 📝 Changelog

### Version 3.0.0 (2026-10-30) - Complete Professional College ERP Upgrade
*   🏛️ **Institutional Identity**: Integrated official Dr. Ambedkar Institute of Technology for Divyangjan (AITD), Kanpur branding across the platform.
*   🧭 **Sticky Top Navbar**: Modern header featuring role indicator badge, quick search modal (`⌘K`), interactive notification dropdown with live campus circulars, and profile dropdown with verified sign-out.
*   📑 **Enterprise ERP Sidebar**: Reorganized into 9 standard ERP categories (Overview, Academic Management, Student Management, Faculty & Staff, Attendance, Examinations, Fees & Finance, Library, Administration) with collapsible sections and route highlighting.
*   🍞 **Dynamic Breadcrumbs**: Context-aware path navigation on internal pages mapping dynamic route segments to friendly section names.
*   ⚖️ **Dual-Mode Footer**: Clean single-line dashboard footer on authenticated views and comprehensive institutional footer on public pages with verified Kanpur address and support contacts.
*   🚫 **Duplicate Header & Button Overlap Elimination**: Removed stacked `AdminHeader` occurrences across 15 admin modules and converted `BackButton` to inline positioning.
*   🤖 **Gemini 2.5 AI Integration**: AI-powered features for all three roles: Campus AI Copilot, quiz generator, leave application drafter, notice generator, and study plan assistant.
*   🌱 **Enriched AutoSeed**: Realistic mock academic records across courses, subjects, timetables, attendance, exam marks, fees, library books, and notes.
*   🧪 **Automated Integration Test Suite**: `npm test` runs comprehensive validation of models, encryption, JWT tokens, AI service, and Express route table with 100% pass rate.

### Version 2.1.0 (2026-03-25)
*   ✅ Conducted a full repository audit and removed unused dead components/hooks to optimize the application footprint.
*   ✅ Validated and preserved all core MERN domain models and modules.
*   ✅ Prepared structural blueprint for enterprise-grade MERN architectures.

### Version 2.0.0 (2025-12-13)
*   ✅ Fixed course API endpoint mismatch
*   ✅ Enhanced CORS configuration
*   ✅ Added localStorage token fallback
*   ✅ Fixed sidebar visibility issues
*   ✅ Improved error handling and logging
*   ✅ Updated documentation

### Version 1.0.0 (2025-11-18)
*   Initial release
*   Complete MERN stack implementation
*   Role-based access control
*   File upload functionality
*   Responsive UI design

---

## 📞 Support

For issues and questions:
*   **Email**: support@draitd.edu
*   **Issues**: Create an issue on GitHub

---

## 📄 License

MIT License - Developed for **Dr AITD**

Copyright (c) 2025 Dr AITD Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

---

## 🙏 Acknowledgments

*   Built with ❤️ for educational institutions
*   Powered by the MERN stack
*   UI inspired by modern design principles
*   Special thanks to all contributors

---

**Made with 💙 by the Gulshan Kumar**
