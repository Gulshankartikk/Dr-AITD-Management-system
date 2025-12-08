# Dr AITD Management System

A comprehensive, modern Enterprise Resource Planning (ERP) solution designed specifically for **Dr AITD**. This system streamlines administrative tasks, empowers teachers with digital tools, and engages students through a unified, user-friendly platform.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-yellow)

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

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React.js](https://reactjs.org/) (v18) with [Vite](https://vitejs.dev/)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [React Router DOM](https://reactrouter.com/)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **Icons**: [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/)
*   **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
*   **Authentication**: JWT (JSON Web Tokens) & BCrypt
*   **File Handling**: [Multer](https://github.com/expressjs/multer) (Local Storage)
*   **Security**: CORS, Cookie Parser, Dotenv

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js** (v16 or higher)
*   **npm** (Node Package Manager)
*   **MongoDB** (Local instance or MongoDB Atlas connection string)

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Dr AITD Management system"
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following configuration:
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/college-erp
JWT_SECRET=your_super_secret_key_change_this
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
NODE_ENV=development
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

### 4. Database Seeding (Optional)
Populate the database with initial Admin and Teacher accounts:
```bash
cd ../backend
node seed_auth_users.js
```
*   **Default Admin**: `admin` / `admin123`
*   **Default Teacher**: `teacher` / `teacher123`

---

## 🏃‍♂️ Running the Application

### Start the Backend Server
```bash
cd backend
npm start
```
*The server will start on `http://localhost:4000`*

### Start the Frontend Client
```bash
cd frontend
npm run dev
```
*The application will run on `http://localhost:5173`*

Access the application by opening your browser and navigating to **`http://localhost:5173`**.

---

## 📂 Project Structure

```
Dr AITD Management system/
├── backend/                # Node.js/Express Server
│   ├── controller/         # Request logic (Admin, Teacher, Student, Auth)
│   ├── database/           # DB Connection logic
│   ├── middleware/         # Auth, Upload, Error handling
│   ├── models/             # Mongoose Schemas (User, Course, etc.)
│   ├── routes/             # API Route Definitions
│   └── uploads/            # Static file storage
│
├── frontend/               # React Client
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── features/       # Redux Slices (Auth, User, etc.)
│   │   ├── Pages/          # Application Pages (Admin, Teacher, Student)
│   │   ├── services/       # API Integration Services
│   │   └── App.jsx         # Main App Component
│   └── public/             # Static Assets
│
└── README.md               # Project Documentation
```

---

## 🔌 API Documentation (Brief)

The backend exposes a RESTful API. Key endpoints include:

*   **Auth**: `/api/auth/login`, `/api/auth/logout`
*   **Admin**:
    *   `/api/admin/students` (CRUD)
    *   `/api/admin/teachers` (CRUD)
    *   `/api/admin/courses` (CRUD)
    *   `/api/admin/reports/*`
*   **Teacher**:
    *   `/api/teacher/:id/dashboard`
    *   `/api/teacher/:id/attendance`
    *   `/api/teacher/:id/marks`
*   **Student**:
    *   `/api/student/:id/dashboard`
    *   `/api/student/:id/profile`
    *   `/api/student/:id/results`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

**Developed for Dr AITD**