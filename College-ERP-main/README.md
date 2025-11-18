# 🎓 College ERP System

A streamlined College ERP System built with the MERN stack for managing academic and administrative processes. Features role-based access for Admin, Teacher, and Student users.

## ✨ Key Features

• **Complete Student & Teacher Management** - Profile creation, enrollment, and data management
• **Attendance Tracking & Reporting** - Real-time attendance monitoring with detailed reports
• **Marks & Assignment Management** - Grade tracking and assignment distribution
• **Course & Subject Administration** - Complete academic structure management
• **Role-Based Authentication** - Secure access for Admin, Teacher, and Student roles
• **Real-time Notifications** - Announcements and notices system

## 🛠️ Technology Stack

• **Frontend:** React, Redux, Tailwind CSS
• **Backend:** Node.js, Express.js
• **Database:** MongoDB with Mongoose
• **Authentication:** JWT with secure cookies

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB running

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd College-ERP-main
```

2. **Backend Setup:**
```bash
cd backend
npm install
```

3. **Create .env file in backend directory:**
```env
PORT=4000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
```

4. **Frontend Setup:**
```bash
cd ../frontend
npm install
```

5. **Initialize Database:**
```bash
cd ../backend
node setupCompleteERP.js
```

6. **Start the Application:**

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run dev
```

## 🔑 Default Login Credentials

**Admin:**
- Email: admin
- Password: admin123

**Test Teacher:**
- Email: teacher@college.edu
- Password: teacher123

**Test Student:**
- Email: student@college.edu
- Password: student123

## 📁 Project Structure

```
College-ERP-main/
├── backend/
│   ├── controller/          # Business logic
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   └── database/           # Database connection
└── frontend/
    └── src/
        ├── Pages/          # React components
        ├── components/     # Reusable components
        ├── features/       # Redux slices
        └── constants/      # Configuration
```

## 🌐 Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000

## 📧 Support

For issues or questions, please create an issue in the repository.