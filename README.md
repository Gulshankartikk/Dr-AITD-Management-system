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

### 👨‍🏫 Teacher Portal
*   **Class Management**: Efficiently mark attendance and manage subject-wise student lists.
*   **Academic Tools**: Upload and manage assignments, marks, and learning resources.
*   **Communication**: Post class-specific notices and announcements.
*   **Analytics**: View detailed attendance reports and student performance metrics.
*   **Timetable**: View assigned teaching schedules.
*   **Leave Management**: Apply for leave and track status.

### 🛡️ Admin Portal
*   **User Management**: Full control over Student, Teacher, and Admin accounts.
*   **Course & Subject Management**: Create and configure courses, branches, and subjects.
*   **Timetable Management**: Create and modify class schedules for all courses.
*   **Fee Management**: Track student fee payments, dues, and generate reports.
*   **Library Management**: Manage book inventory, issue/return books, and track overdue items.
*   **Reports**: Generate comprehensive reports for attendance, academics, and enrollment.
*   **System Health**: Monitor system status and logs.

---

## 🛠️ Tech Stack & Architecture

### Backend (Clean Architecture)
*   **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
*   **Models**: Domain-Driven Design (Users, Academics, Activities, Operations)
*   **Security**: 
    *   JWT (JSON Web Tokens) for stateless authentication
    *   BCrypt for password hashing
    *   CORS configured for secure cross-origin requests
*   **File Handling**: Multer for local file storage

### Frontend
*   **Framework**: [React.js](https://reactjs.org/) (v18) with [Vite](https://vitejs.dev/)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [React Router DOM](https://reactrouter.com/)
*   **HTTP Client**: Axios with interceptors

---

## 🚀 Deployment (Render)

This project is configured for **One-Click Deployment** on Render using Infrastructure as Code (IaC).

1.  Push this repository to GitHub.
2.  Log in to [Render](https://render.com).
3.  Click **New +** -> **Blueprint**.
4.  Select your repository.
5.  Render will automatically obtain the configuration from `render.yaml`.
6.  **Environment Variables**: You will be prompted to enter:
    *   `MONGO_URL`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A secure random string.

---

## ⚙️ Local Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Dr AITD Management system"
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` (or use the provided defaults for dev):
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/college-erp
JWT_SECRET=your_local_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Seeding (Recommended)
Initialize the database with default Admin and Demo accounts:
```bash
cd ../backend
node seed_auth_users.js
```
*   **Admin**: `admin` / `admin123`
*   **Teacher**: `teacher` / `teacher123`
*   **Student**: `student` / `student123`

---

## 🏃‍♂️ Running Locally

### Option 1: One-Click Script (Windows)
Double-click `start-servers.bat` in the root directory.

### Option 2: Manual Terminals
**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```
*Access the app at `http://localhost:5173` (or `5174` if port is busy).*

---

## 📂 Project Structure

```
Dr AITD Management system/
├── backend/
│   ├── controller/         # Business Logic
│   ├── database/           # DB Connection
│   ├── middleware/         # Auth, Upload, Error Handling
│   ├── models/             # Domain Models (Refactored)
│   │   ├── Users.js        # Admin, Teacher, Student
│   │   ├── Academics.js    # Course, Subject, Timetable
│   │   ├── Activities.js   # Attendance, Marks, Assignments
│   │   └── ...
│   ├── routes/             # API Endpoints
│   └── uploads/            # Static Files
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── features/       # Redux Slices
│   │   ├── Pages/          # Views (Admin, Teacher, Student)
│   │   └── services/       # API Calls
│
├── render.yaml             # Deployment Blueprint
└── README.md               # Documentation
```

---

## 🤝 Contributing
1.  Fork the repo and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  Ensure the test suite passes.
4.  Issue that pull request!

---

## 📄 License
MIT License - Developed for **Dr AITD**