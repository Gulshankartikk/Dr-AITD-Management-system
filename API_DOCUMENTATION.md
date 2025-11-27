# 🚀 College ERP - Complete API Documentation

## Base URL
```
Development: http://localhost:4000/api
Production: https://your-domain.com/api
```

## Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 📑 Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Admin APIs](#admin-apis)
3. [Teacher APIs](#teacher-apis)
4. [Student APIs](#student-apis)
5. [Common APIs](#common-apis)

---

## 🔐 Authentication APIs

### 1. Admin Login
```http
POST /api/admin/login
```
**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "admin",
    "name": "Administrator",
    "role": "admin"
  }
}
```

### 2. Teacher Login
```http
POST /api/teacher/login
```
**Request Body:**
```json
{
  "username": "teacher",
  "password": "teacher123"
}
```

### 3. Student Login
```http
POST /api/student/login
```
**Request Body:**
```json
{
  "username": "student",
  "password": "student123"
}
```

---

## 👨💼 Admin APIs

### Student Management

#### Get All Students
```http
GET /api/admin/students
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "students": [
    {
      "_id": "...",
      "name": "Rahul Kumar",
      "rollNo": "CSE001",
      "email": "rahul@example.com",
      "courseId": {...},
      "semester": 5,
      "isActive": true
    }
  ]
}
```

#### Create Student
```http
POST /api/admin/students
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "9876543210",
  "rollNo": "CSE002",
  "password": "student123",
  "courseId": "course_id_here",
  "semester": 1,
  "section": "A",
  "dateOfBirth": "2002-05-15",
  "gender": "Female",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "parentDetails": {
    "fatherName": "Mr. Sharma",
    "fatherPhone": "9876543211",
    "motherName": "Mrs. Sharma",
    "motherPhone": "9876543212"
  }
}
```

#### Update Student
```http
PUT /api/admin/students/:studentId
Authorization: Bearer <token>
```

#### Delete Student
```http
DELETE /api/admin/students/:studentId
Authorization: Bearer <token>
```

#### Promote Students
```http
POST /api/admin/students/promote
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "courseId": "course_id",
  "currentSemester": 5,
  "section": "A"
}
```

### Teacher Management

#### Get All Teachers
```http
GET /api/admin/teachers
Authorization: Bearer <token>
```

#### Create Teacher
```http
POST /api/admin/teachers
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "name": "Dr. Amit Singh",
  "email": "amit@example.com",
  "phone": "9876543210",
  "employeeId": "EMP001",
  "password": "teacher123",
  "department": "Computer Science",
  "designation": "Assistant Professor",
  "qualification": ["M.Tech", "Ph.D"],
  "experience": 5,
  "joiningDate": "2019-07-01",
  "salary": 50000
}
```

#### Assign Subject to Teacher
```http
POST /api/admin/teachers/:teacherId/assign-subject
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "subjectId": "subject_id",
  "courseId": "course_id",
  "semester": 5,
  "section": "A"
}
```

### Course Management

#### Get All Courses
```http
GET /api/admin/courses
Authorization: Bearer <token>
```

#### Create Course
```http
POST /api/admin/courses
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "courseName": "B.Tech Computer Science",
  "courseCode": "BTECH-CSE",
  "department": "Computer Science",
  "duration": 4,
  "totalSemesters": 8,
  "description": "Bachelor of Technology in Computer Science",
  "eligibility": "10+2 with PCM",
  "totalSeats": 60
}
```

#### Create Subject
```http
POST /api/admin/subjects
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "subjectName": "Data Structures",
  "subjectCode": "CSE301",
  "courseId": "course_id",
  "semester": 3,
  "credits": 4,
  "subjectType": "Theory",
  "isElective": false
}
```

### Attendance Management

#### Get Attendance Report
```http
GET /api/admin/attendance/report
Authorization: Bearer <token>
Query Parameters:
  - courseId (optional)
  - semester (optional)
  - startDate (optional)
  - endDate (optional)
  - studentId (optional)
```

#### Modify Attendance
```http
PUT /api/admin/attendance/:attendanceId
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "status": "Present",
  "remarks": "Corrected by admin"
}
```

### Fee Management

#### Create Fee Structure
```http
POST /api/admin/fees/structure
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "courseId": "course_id",
  "semester": 1,
  "academicYear": "2023-2024",
  "feeComponents": [
    {
      "name": "Tuition Fee",
      "amount": 50000,
      "isMandatory": true
    },
    {
      "name": "Lab Fee",
      "amount": 5000,
      "isMandatory": true
    }
  ],
  "totalAmount": 55000,
  "dueDate": "2024-01-31"
}
```

#### Get Fee Collection Report
```http
GET /api/admin/fees/collection
Authorization: Bearer <token>
Query Parameters:
  - startDate
  - endDate
  - courseId (optional)
```

#### Record Fee Payment
```http
POST /api/admin/fees/payment
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "studentId": "student_id",
  "feeStructureId": "fee_structure_id",
  "amountPaid": 55000,
  "paymentMode": "Online",
  "transactionId": "TXN123456",
  "receiptNumber": "REC001"
}
```

### Exam Management

#### Create Exam Schedule
```http
POST /api/admin/exams
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "examName": "Mid-term Exam - Semester 5",
  "examType": "Mid-term",
  "courseId": "course_id",
  "semester": 5,
  "academicYear": "2023-2024",
  "startDate": "2024-02-01",
  "endDate": "2024-02-10",
  "subjects": [
    {
      "subjectId": "subject_id",
      "examDate": "2024-02-01",
      "startTime": "10:00",
      "endTime": "13:00",
      "room": "Room 101",
      "totalMarks": 100,
      "passingMarks": 40
    }
  ]
}
```

#### Generate Seating Plan
```http
POST /api/admin/exams/:examId/seating-plan
Authorization: Bearer <token>
```

#### Publish Results
```http
POST /api/admin/exams/:examId/publish-results
Authorization: Bearer <token>
```

### Timetable Management

#### Create Timetable
```http
POST /api/admin/timetable
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "courseId": "course_id",
  "semester": 5,
  "section": "A",
  "academicYear": "2023-2024",
  "schedule": [
    {
      "day": "Monday",
      "periods": [
        {
          "periodNumber": 1,
          "startTime": "09:00",
          "endTime": "10:00",
          "subjectId": "subject_id",
          "teacherId": "teacher_id",
          "room": "Room 101",
          "type": "Theory"
        }
      ]
    }
  ]
}
```

### Notice Management

#### Create Notice
```http
POST /api/admin/notices
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "title": "Holiday Notice",
  "description": "College will remain closed on 26th January",
  "category": "Holiday",
  "priority": "High",
  "targetAudience": {
    "type": "All"
  },
  "expiryDate": "2024-01-26"
}
```

### Dashboard

#### Get Dashboard Data
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalStudents": 1245,
      "totalTeachers": 87,
      "totalCourses": 24,
      "totalSubjects": 156
    },
    "students": [...],
    "teachers": [...],
    "courses": [...],
    "subjects": [...]
  }
}
```

---

## 👨🏫 Teacher APIs

### Dashboard

#### Get Teacher Dashboard
```http
GET /api/teacher/:teacherId/dashboard
Authorization: Bearer <token>
```

### Attendance

#### Mark Attendance
```http
POST /api/teacher/:teacherId/attendance
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "subjectId": "subject_id",
  "date": "2024-01-15",
  "attendance": [
    {
      "studentId": "student_id_1",
      "status": "Present"
    },
    {
      "studentId": "student_id_2",
      "status": "Absent"
    }
  ]
}
```

#### Get Attendance Report
```http
GET /api/teacher/:teacherId/attendance/report
Authorization: Bearer <token>
Query Parameters:
  - subjectId (optional)
  - startDate (optional)
  - endDate (optional)
```

### Assignment Management

#### Create Assignment
```http
POST /api/teacher/:teacherId/assignments
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Form Data:**
```
title: "DSA Assignment 3"
description: "Implement Binary Search Tree"
subjectId: "subject_id"
deadline: "2024-01-30"
file: <file upload>
```

#### Get Assignments with Submissions
```http
GET /api/teacher/:teacherId/assignments
Authorization: Bearer <token>
Query Parameters:
  - subjectId (optional)
```

#### Grade Assignment
```http
PUT /api/teacher/:teacherId/assignments/:assignmentId/grade
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "studentId": "student_id",
  "marks": 85,
  "feedback": "Good work!"
}
```

### Study Materials

#### Upload Study Material
```http
POST /api/teacher/:teacherId/materials
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Form Data:**
```
title: "Data Structures Notes"
description: "Chapter 1-5"
subjectId: "subject_id"
file: <file upload>
category: "Notes"
```

### Marks Entry

#### Add Marks
```http
POST /api/teacher/:teacherId/marks
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "studentId": "student_id",
  "subjectId": "subject_id",
  "examType": "Internal-1",
  "marks": 85,
  "totalMarks": 100,
  "semester": 5
}
```

#### Get Student Marks
```http
GET /api/teacher/:teacherId/marks
Authorization: Bearer <token>
Query Parameters:
  - subjectId
  - examType (optional)
```

### Student Management

#### Get Students by Subject
```http
GET /api/teacher/:teacherId/subjects/:subjectId/students
Authorization: Bearer <token>
```

### Communication

#### Send Announcement
```http
POST /api/teacher/:teacherId/announcements
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "title": "Class Postponed",
  "message": "Tomorrow's class is postponed to next week",
  "subjectId": "subject_id"
}
```

---

## 🎓 Student APIs

### Dashboard

#### Get Student Dashboard
```http
GET /api/student/:studentId/dashboard
Authorization: Bearer <token>
```

### Profile

#### Get Student Profile
```http
GET /api/student/:studentId/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/student/:studentId/profile
Authorization: Bearer <token>
```

### Attendance

#### Get Attendance
```http
GET /api/student/:studentId/attendance
Authorization: Bearer <token>
Query Parameters:
  - subjectId (optional)
  - month (optional)
  - year (optional)
```

### Assignments

#### Get Assignments
```http
GET /api/student/:studentId/assignments
Authorization: Bearer <token>
Query Parameters:
  - subjectId (optional)
```

#### Submit Assignment
```http
POST /api/student/:studentId/assignments/:assignmentId/submit
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Form Data:**
```
file: <file upload>
```

### Study Materials

#### Get Study Materials
```http
GET /api/student/:studentId/materials
Authorization: Bearer <token>
Query Parameters:
  - subjectId (optional)
```

### Marks & Results

#### Get Marks
```http
GET /api/student/:studentId/marks
Authorization: Bearer <token>
Query Parameters:
  - subjectId (optional)
  - examType (optional)
```

### Fee Management

#### Get Fee Details
```http
GET /api/student/:studentId/fees
Authorization: Bearer <token>
```

#### Make Payment
```http
POST /api/student/:studentId/fees/payment
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "feeStructureId": "fee_structure_id",
  "amount": 55000,
  "paymentMode": "Online",
  "transactionId": "TXN123456"
}
```

### Library

#### Get Issued Books
```http
GET /api/student/:studentId/library/books
Authorization: Bearer <token>
```

#### Request Book
```http
POST /api/student/:studentId/library/request
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "bookId": "book_id"
}
```

### Documents

#### Request Document
```http
POST /api/student/:studentId/documents/request
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "documentType": "Bonafide",
  "purpose": "Bank Loan"
}
```

#### Get Document Requests
```http
GET /api/student/:studentId/documents/requests
Authorization: Bearer <token>
```

---

## 🌐 Common APIs

### Courses

#### Get All Courses
```http
GET /api/courses
```

### Subjects

#### Get Subjects by Course
```http
GET /api/courses/:courseId/subjects
```

### Notifications

#### Get Notifications
```http
GET /api/notifications/:userId
Authorization: Bearer <token>
Query Parameters:
  - role (required): 'Admin', 'Teacher', 'Student'
  - limit (optional): default 10
```

#### Mark as Read
```http
PUT /api/notifications/:notificationId/read
Authorization: Bearer <token>
```

### Notices

#### Get All Notices
```http
GET /api/notices
Authorization: Bearer <token>
Query Parameters:
  - category (optional)
  - limit (optional)
```

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔒 Error Response Format

```json
{
  "success": false,
  "msg": "Error message here"
}
```

---

## 📝 Notes

1. All dates should be in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss.sssZ`
2. File uploads use `multipart/form-data` encoding
3. Maximum file size: 10MB
4. Supported file types: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG
5. JWT tokens expire after 24 hours
6. Rate limiting: 100 requests per 15 minutes per IP

---

## 🧪 Testing

### Using cURL
```bash
# Login
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get Dashboard (with token)
curl -X GET http://localhost:4000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the API collection
2. Set environment variable `baseUrl` = `http://localhost:4000/api`
3. Set environment variable `token` after login
4. Use `{{baseUrl}}` and `{{token}}` in requests

---

**API Version**: 1.0  
**Last Updated**: January 2024  
**Base Framework**: Express.js + MongoDB
