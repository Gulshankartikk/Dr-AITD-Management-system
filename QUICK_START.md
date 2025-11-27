# Quick Start Guide - College ERP System

## ✅ System Status
- **Backend**: Running on http://localhost:4000
- **Frontend**: Running on http://localhost:5173
- **Database**: MongoDB (local or cloud)

## 🔐 Login Credentials

### Admin Login
- **URL**: http://localhost:5173/login (select Admin)
- **Username**: `admin`
- **Password**: `admin123`
- **Dashboard**: http://localhost:5173/admin/dashboard

### Teacher Login
- **URL**: http://localhost:5173/login (select Teacher)
- **Username**: `teacher`
- **Password**: `teacher123`
- **Dashboard**: http://localhost:5173/teacher/teacher1/dashboard

### Student Login
- **URL**: http://localhost:5173/login (select Student)
- **Username**: `student`
- **Password**: `student123`
- **Dashboard**: http://localhost:5173/student/student1/dashboard

## 🚀 How to Start

### Option 1: Start Both Servers Together
```bash
npm start
```

### Option 2: Start Separately
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📍 Available Routes

### Public Routes
- `/` or `/login` - Login page
- `/register` - Student registration
- `/teacher-register` - Teacher registration

### Admin Routes (after login as admin)
- `/admin/dashboard` - Admin dashboard
- `/admin/add-course` - Add new course
- `/admin/add-subject` - Add new subject
- `/admin/create-teacher` - Create teacher
- `/admin/create-student` - Create student
- `/admin/students` - Student management
- `/admin/notifications` - Notifications

### Teacher Routes (after login as teacher)
- `/teacher/:id/dashboard` - Teacher dashboard
- `/teacher/:id/profile` - Teacher profile
- `/teacher/:id/students` - Student list
- `/teacher/:id/summary` - Teacher summary

### Student Routes (after login as student)
- `/student/:id/dashboard` - Student dashboard
- `/student/:id/profile` - Student profile
- `/student/:id/notes` - View notes
- `/student/:id/materials` - Study materials
- `/student/:id/assignments` - Assignments
- `/student/:id/attendance` - Attendance records

## 🔧 Troubleshooting

### If you see 404 Page Not Found:
1. Make sure you're accessing the correct URL
2. Start from the login page: http://localhost:5173/login
3. Login with the credentials above
4. You'll be automatically redirected to the correct dashboard

### If login doesn't work:
1. Check backend is running: http://localhost:4000
2. Check frontend is running: http://localhost:5173
3. Open browser console (F12) to see any errors
4. Make sure you're using the exact credentials listed above

### If backend won't start:
```bash
# Kill existing process
netstat -ano | findstr :4000
taskkill /F /PID <PID_NUMBER>

# Start again
cd backend
npm start
```

### If frontend won't start:
```bash
# Kill existing process
netstat -ano | findstr :5173
taskkill /F /PID <PID_NUMBER>

# Start again
cd frontend
npm run dev
```

## 📝 Testing the System

### Test Backend API:
```bash
# Test student login
curl -X POST http://localhost:4000/api/student/login -H "Content-Type: application/json" -d "{\"username\":\"student\",\"password\":\"student123\"}"

# Test teacher login
curl -X POST http://localhost:4000/api/teacher/login -H "Content-Type: application/json" -d "{\"username\":\"teacher\",\"password\":\"teacher123\"}"

# Test admin login
curl -X POST http://localhost:4000/api/admin/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Test Frontend:
1. Open browser: http://localhost:5173
2. You should see the login page
3. Select a role (Student/Teacher/Admin)
4. Enter credentials
5. Click "Sign In"
6. You'll be redirected to the appropriate dashboard

## ⚠️ Important Notes

1. **Always start from the login page**: http://localhost:5173/login
2. **Don't bookmark dashboard URLs** - they require authentication
3. **Use exact credentials** - username and password are case-sensitive
4. **MongoDB must be running** - Make sure MongoDB service is active
5. **Clear browser cache** if you see old data or errors

## 🎯 Next Steps After Login

### As Admin:
1. Create courses from "Add Course" page
2. Create subjects from "Add Subject" page
3. Create teachers from "Create Teacher" page
4. Create students from "Create Student" page
5. Manage everything from the dashboard

### As Teacher:
1. View assigned classes
2. Mark attendance
3. Upload assignments
4. Upload study materials
5. Enter marks

### As Student:
1. View attendance
2. Download study materials
3. Submit assignments
4. Check marks
5. View notices

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Check browser console for errors (F12)
3. Check backend terminal for errors
4. Verify all credentials are correct
5. Make sure both servers are running

---

**Remember**: Always access the system through http://localhost:5173/login first!
