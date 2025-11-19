# College ERP - API Documentation

## Base URL
```
http://localhost:4001/api
```

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Admin Routes

### Admin Login
```http
POST /admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

### Admin Dashboard
```http
GET /admin/dashboard
Authorization: Bearer <token>
```

### Student Management
```http
# Get all students
GET /admin/students
Authorization: Bearer <token>

# Add student
POST /admin/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "kartik",
  "email": "kartik@example.com",
  "rollNo": "STU001",
  "courseId": "course_id_here",
  "password": "student123"
}

# Update student
PUT /admin/students/{studentId}
Authorization: Bearer <token>

# Delete student
DELETE /admin/students/{studentId}
Authorization: Bearer <token>

# Get student details
GET /admin/students/{studentId}
Authorization: Bearer <token>
```

### Teacher Management
```http
# Get all teachers
GET /admin/teachers
Authorization: Bearer <token>

# Add teacher
POST /admin/teachers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "gulshankartik",
  "email": "gulshankartik@example.com",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "password": "teacher123"
}

# Update teacher
PUT /admin/teachers/{teacherId}
Authorization: Bearer <token>

# Delete teacher
DELETE /admin/teachers/{teacherId}
Authorization: Bearer <token>

# Get teacher details
GET /admin/teachers/{teacherId}
Authorization: Bearer <token>
```

### Course Management
```http
# Get all courses
GET /courses

# Add course
POST /admin/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseName": "Computer Science",
  "courseCode": "CSE",
  "courseDuration": 4
}

# Delete course
DELETE /admin/courses/{courseId}
Authorization: Bearer <token>
```

### Subject Management
```http
# Get all subjects
GET /subjects

# Add subject
POST /admin/subjects
Authorization: Bearer <token>
Content-Type: application/json

{
  "subjectName": "Data Structures",
  "subjectCode": "CS101",
  "courseId": "course_id_here",
  "semester": 3
}

# Delete subject
DELETE /admin/subjects/{subjectId}
Authorization: Bearer <token>
```

## Teacher Routes

### Teacher Login
```http
POST /teacher/login
Content-Type: application/json

{
  "username": "teacher@example.com",
  "password": "teacher123"
}
```

### Teacher Dashboard
```http
GET /teacher/{teacherId}/dashboard
Authorization: Bearer <token>
```

### Teacher Profile
```http
PUT /teacher/{teacherId}/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "+91 9876543210",
  "department": "Computer Science",
  "designation": "Assistant Professor"
}
```

### Attendance Management
```http
# Mark attendance
POST /teacher/{teacherId}/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "subjectId": "subject_id_here",
  "date": "2024-01-15",
  "attendanceData": [
    {
      "studentId": "student_id_here",
      "status": "Present"
    }
  ]
}

# Get attendance report
GET /teacher/{teacherId}/attendance-report
Authorization: Bearer <token>
```

### Assignment Management
```http
# Get teacher assignments
GET /teacher/{teacherId}/assignments
Authorization: Bearer <token>

# Add assignment
POST /teacher/{teacherId}/assignments
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: Assignment Title
description: Assignment Description
subjectId: subject_id_here
deadline: 2024-01-30
file: [file upload]
```

### Study Materials
```http
# Get teacher materials
GET /teacher/{teacherId}/materials
Authorization: Bearer <token>

# Add study material
POST /teacher/{teacherId}/materials
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: Material Title
description: Material Description
subjectId: subject_id_here
file: [file upload]
```

### Notes Management
```http
# Get teacher notes
GET /teacher/{teacherId}/notes
Authorization: Bearer <token>

# Add notes
POST /teacher/{teacherId}/notes
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: Notes Title
content: Notes Content
subjectId: subject_id_here
file: [file upload]
```

## Student Routes

### Student Login
```http
POST /student/login
Content-Type: application/json

{
  "username": "student",
  "password": "student123"
}
```

### Student Dashboard
```http
GET /student/{studentId}/dashboard
Authorization: Bearer <token>
```

### Student Profile
```http
# Get profile
GET /student/{studentId}/profile
Authorization: Bearer <token>

# Update profile
PUT /student/{studentId}/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "+91 9876543210"
}
```

### Student Attendance
```http
GET /student/{studentId}/attendance
Authorization: Bearer <token>

# Optional query parameters:
# ?subjectId=subject_id_here
# ?month=1&year=2024
```

### Student Assignments
```http
# Get assignments
GET /student/{studentId}/assignments
Authorization: Bearer <token>

# Submit assignment
POST /student/{studentId}/assignments/{assignmentId}/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "fileUrl": "path/to/submitted/file"
}
```

### Student Study Materials
```http
GET /student/{studentId}/materials
Authorization: Bearer <token>
```

### Student Notes
```http
GET /student/{studentId}/notes
Authorization: Bearer <token>
```

### Student Marks
```http
GET /student/{studentId}/marks
Authorization: Bearer <token>

# Optional query parameters:
# ?subjectId=subject_id_here
# ?examType=midterm
```

### Student Notices
```http
GET /student/{studentId}/notices
Authorization: Bearer <token>
```

## Demo Credentials

### Admin Login
```json
{
  "username": "admin",
  "password": "admin"
}
```

### Student Login
```json
{
  "username": "student",
  "password": "student123"
}
```

### Teacher Login
```json
{
  "username": "teacher@example.com",
  "password": "teacher123"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## File Upload
For endpoints that accept file uploads, use `multipart/form-data` content type and include the file in the `file` field.

## Testing Notes
1. First login to get the JWT token
2. Use the token in Authorization header for protected routes
3. Replace `{studentId}`, `{teacherId}`, etc. with actual IDs
4. For demo purposes, you can use "student" or "demo-student" as studentId
5. File uploads should be tested with actual files (PDF, DOC, images)