# 🗄️ College ERP - Complete Database Schema

## MongoDB Collections & Schema Design

---

## 1. 👤 Users Collection

### Admin Schema
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (default: 'admin'),
  permissions: [String], // ['manage_users', 'manage_fees', 'view_reports']
  phone: String,
  profileImage: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### Teacher Schema
```javascript
{
  _id: ObjectId,
  employeeId: String (unique, required),
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  phone: String,
  dateOfBirth: Date,
  gender: String (enum: ['Male', 'Female', 'Other']),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  profileImage: String,
  
  // Professional Details
  department: String,
  designation: String (enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer']),
  qualification: [String], // ['M.Tech', 'Ph.D']
  experience: Number, // in years
  specialization: [String],
  joiningDate: Date,
  
  // Academic Assignment
  assignedCourses: [{ type: ObjectId, ref: 'Course' }],
  assignedSubjects: [{ type: ObjectId, ref: 'Subject' }],
  assignedClasses: [{
    courseId: { type: ObjectId, ref: 'Course' },
    section: String,
    semester: Number
  }],
  
  // Status
  isClassIncharge: Boolean (default: false),
  classInchargeOf: { type: ObjectId, ref: 'Class' },
  isActive: Boolean (default: true),
  
  // Salary & Leave
  salary: Number,
  leaveBalance: {
    casual: Number (default: 12),
    sick: Number (default: 10),
    earned: Number (default: 15)
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Student Schema
```javascript
{
  _id: ObjectId,
  rollNo: String (unique, required),
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  phone: String,
  dateOfBirth: Date,
  gender: String (enum: ['Male', 'Female', 'Other']),
  bloodGroup: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  
  // Parent/Guardian Details
  parentDetails: {
    fatherName: String,
    fatherPhone: String,
    fatherOccupation: String,
    motherName: String,
    motherPhone: String,
    guardianName: String,
    guardianPhone: String,
    guardianRelation: String
  },
  
  // Academic Details
  courseId: { type: ObjectId, ref: 'Course', required: true },
  semester: Number (required),
  section: String,
  batch: String, // '2020-2024'
  admissionDate: Date,
  admissionNumber: String (unique),
  
  // Academic Performance
  cgpa: Number,
  sgpa: [Number], // Semester-wise SGPA
  
  // Documents
  documents: [{
    type: String, // 'aadhar', 'marksheet', 'tc', 'photo'
    url: String,
    uploadedAt: Date
  }],
  
  // Status
  isActive: Boolean (default: true),
  status: String (enum: ['Active', 'Alumni', 'Suspended', 'Dropout'], default: 'Active'),
  
  // Hostel & Transport
  hostelDetails: {
    isHostelite: Boolean (default: false),
    roomNumber: String,
    blockName: String
  },
  transportDetails: {
    usesTransport: Boolean (default: false),
    routeId: { type: ObjectId, ref: 'TransportRoute' },
    pickupPoint: String
  },
  
  // Library
  libraryCardNumber: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. 📚 Academic Collections

### Course Schema
```javascript
{
  _id: ObjectId,
  courseName: String (required), // 'B.Tech Computer Science'
  courseCode: String (unique, required), // 'BTECH-CSE'
  department: String,
  duration: Number, // in years
  totalSemesters: Number,
  description: String,
  eligibility: String,
  totalSeats: Number,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Subject Schema
```javascript
{
  _id: ObjectId,
  subjectName: String (required),
  subjectCode: String (unique, required),
  courseId: { type: ObjectId, ref: 'Course', required: true },
  semester: Number,
  credits: Number,
  subjectType: String (enum: ['Theory', 'Practical', 'Lab', 'Project']),
  isElective: Boolean (default: false),
  syllabus: String, // URL or text
  assignedTeachers: [{ type: ObjectId, ref: 'Teacher' }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Class Schema
```javascript
{
  _id: ObjectId,
  courseId: { type: ObjectId, ref: 'Course', required: true },
  semester: Number (required),
  section: String (required), // 'A', 'B', 'C'
  batch: String, // '2020-2024'
  classIncharge: { type: ObjectId, ref: 'Teacher' },
  students: [{ type: ObjectId, ref: 'Student' }],
  subjects: [{ type: ObjectId, ref: 'Subject' }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. 📋 Attendance Collections

### Attendance Schema
```javascript
{
  _id: ObjectId,
  studentId: { type: ObjectId, ref: 'Student', required: true },
  subjectId: { type: ObjectId, ref: 'Subject', required: true },
  teacherId: { type: ObjectId, ref: 'Teacher', required: true },
  date: Date (required),
  status: String (enum: ['Present', 'Absent', 'Late', 'Leave'], required),
  remarks: String,
  markedAt: Date,
  createdAt: Date
}

// Indexes
Index: { studentId: 1, subjectId: 1, date: 1 } (unique)
Index: { date: 1 }
Index: { studentId: 1 }
```

### TeacherAttendance Schema
```javascript
{
  _id: ObjectId,
  teacherId: { type: ObjectId, ref: 'Teacher', required: true },
  date: Date (required),
  status: String (enum: ['Present', 'Absent', 'Leave', 'Half-day'], required),
  checkInTime: Date,
  checkOutTime: Date,
  remarks: String,
  createdAt: Date
}
```

---

## 4. 📝 Assignment Collections

### Assignment Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  subjectId: { type: ObjectId, ref: 'Subject', required: true },
  teacherId: { type: ObjectId, ref: 'Teacher', required: true },
  courseId: { type: ObjectId, ref: 'Course' },
  semester: Number,
  section: String,
  
  // Files
  fileUrl: String,
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number
  }],
  
  // Dates
  assignedDate: Date (default: Date.now),
  deadline: Date (required),
  
  // Submissions
  submissions: [{
    studentId: { type: ObjectId, ref: 'Student' },
    fileUrl: String,
    submittedAt: Date,
    marks: Number,
    feedback: String,
    status: String (enum: ['Submitted', 'Late', 'Graded'])
  }],
  
  totalMarks: Number,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. 📊 Marks & Exam Collections

### Marks Schema
```javascript
{
  _id: ObjectId,
  studentId: { type: ObjectId, ref: 'Student', required: true },
  subjectId: { type: ObjectId, ref: 'Subject', required: true },
  teacherId: { type: ObjectId, ref: 'Teacher', required: true },
  examType: String (enum: ['Internal-1', 'Internal-2', 'Mid-term', 'Final', 'Assignment'], required),
  marks: Number (required),
  totalMarks: Number (required),
  grade: String, // 'A+', 'A', 'B+', etc.
  remarks: String,
  semester: Number,
  academicYear: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Exam Schema
```javascript
{
  _id: ObjectId,
  examName: String (required), // 'Mid-term Exam - Semester 5'
  examType: String (enum: ['Internal', 'Mid-term', 'Final'], required),
  courseId: { type: ObjectId, ref: 'Course', required: true },
  semester: Number (required),
  academicYear: String,
  
  // Schedule
  startDate: Date (required),
  endDate: Date (required),
  
  // Exam Details
  subjects: [{
    subjectId: { type: ObjectId, ref: 'Subject' },
    examDate: Date,
    startTime: String,
    endTime: String,
    room: String,
    totalMarks: Number,
    passingMarks: Number
  }],
  
  // Seating Arrangement
  seatingPlan: [{
    studentId: { type: ObjectId, ref: 'Student' },
    room: String,
    seatNumber: String
  }],
  
  // Status
  status: String (enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'], default: 'Scheduled'),
  resultsPublished: Boolean (default: false),
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. 📖 Study Material Collections

### StudyMaterial Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  subjectId: { type: ObjectId, ref: 'Subject', required: true },
  teacherId: { type: ObjectId, ref: 'Teacher', required: true },
  fileUrl: String (required),
  fileType: String, // 'pdf', 'ppt', 'doc', 'video'
  fileSize: Number,
  category: String (enum: ['Notes', 'Slides', 'Reference', 'Video', 'Other']),
  isActive: Boolean (default: true),
  downloads: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Notes Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String,
  subjectId: { type: ObjectId, ref: 'Subject', required: true },
  teacherId: { type: ObjectId, ref: 'Teacher', required: true },
  fileUrl: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 7. 💰 Fee Management Collections

### FeeStructure Schema
```javascript
{
  _id: ObjectId,
  courseId: { type: ObjectId, ref: 'Course', required: true },
  semester: Number (required),
  academicYear: String (required),
  
  // Fee Components
  feeComponents: [{
    name: String, // 'Tuition Fee', 'Lab Fee', 'Library Fee'
    amount: Number,
    isMandatory: Boolean (default: true)
  }],
  
  totalAmount: Number (required),
  dueDate: Date,
  
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### FeePayment Schema
```javascript
{
  _id: ObjectId,
  studentId: { type: ObjectId, ref: 'Student', required: true },
  feeStructureId: { type: ObjectId, ref: 'FeeStructure', required: true },
  
  // Payment Details
  amountPaid: Number (required),
  paymentMode: String (enum: ['Cash', 'Online', 'Cheque', 'DD'], required),
  transactionId: String,
  paymentDate: Date (default: Date.now),
  
  // Receipt
  receiptNumber: String (unique, required),
  receiptUrl: String,
  
  // Status
  status: String (enum: ['Paid', 'Partial', 'Pending'], default: 'Paid'),
  remarks: String,
  
  // Concession
  concessionAmount: Number (default: 0),
  concessionReason: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 8. 📅 Timetable Collections

### Timetable Schema
```javascript
{
  _id: ObjectId,
  courseId: { type: ObjectId, ref: 'Course', required: true },
  semester: Number (required),
  section: String (required),
  academicYear: String,
  
  // Schedule
  schedule: [{
    day: String (enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    periods: [{
      periodNumber: Number,
      startTime: String, // '09:00'
      endTime: String, // '10:00'
      subjectId: { type: ObjectId, ref: 'Subject' },
      teacherId: { type: ObjectId, ref: 'Teacher' },
      room: String,
      type: String (enum: ['Theory', 'Lab', 'Tutorial'])
    }]
  }],
  
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 9. 📢 Communication Collections

### Notice Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (enum: ['Academic', 'Exam', 'Holiday', 'Event', 'General'], required),
  priority: String (enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium'),
  
  // Sender
  senderId: ObjectId (required),
  senderRole: String (enum: ['Admin', 'Teacher'], required),
  senderName: String,
  
  // Target Audience
  targetAudience: {
    type: String (enum: ['All', 'Students', 'Teachers', 'Course', 'Semester']),
    courseId: { type: ObjectId, ref: 'Course' },
    semester: Number
  },
  
  // Attachments
  attachments: [{
    fileName: String,
    fileUrl: String
  }],
  
  // Status
  isActive: Boolean (default: true),
  expiryDate: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required),
  userRole: String (enum: ['Admin', 'Teacher', 'Student'], required),
  title: String (required),
  message: String (required),
  type: String (enum: ['Assignment', 'Exam', 'Fee', 'Attendance', 'General'], required),
  
  // Related Entity
  relatedEntity: {
    entityType: String, // 'Assignment', 'Exam', 'Notice'
    entityId: ObjectId
  },
  
  // Status
  isRead: Boolean (default: false),
  readAt: Date,
  
  createdAt: Date
}
```

---

## 10. 📚 Library Collections

### Book Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  author: String (required),
  isbn: String (unique),
  publisher: String,
  edition: String,
  category: String,
  totalCopies: Number (required),
  availableCopies: Number (required),
  location: String, // Shelf location
  price: Number,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### BookIssue Schema
```javascript
{
  _id: ObjectId,
  bookId: { type: ObjectId, ref: 'Book', required: true },
  studentId: { type: ObjectId, ref: 'Student', required: true },
  issueDate: Date (default: Date.now),
  dueDate: Date (required),
  returnDate: Date,
  status: String (enum: ['Issued', 'Returned', 'Overdue'], default: 'Issued'),
  fine: Number (default: 0),
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 11. 🏠 Hostel & Transport Collections

### Hostel Schema
```javascript
{
  _id: ObjectId,
  hostelName: String (required),
  hostelType: String (enum: ['Boys', 'Girls'], required),
  totalRooms: Number,
  totalCapacity: Number,
  warden: { type: ObjectId, ref: 'Teacher' },
  address: String,
  facilities: [String],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### HostelRoom Schema
```javascript
{
  _id: ObjectId,
  hostelId: { type: ObjectId, ref: 'Hostel', required: true },
  roomNumber: String (required),
  floor: Number,
  capacity: Number,
  occupiedBeds: Number (default: 0),
  students: [{ type: ObjectId, ref: 'Student' }],
  monthlyFee: Number,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### TransportRoute Schema
```javascript
{
  _id: ObjectId,
  routeName: String (required),
  routeNumber: String (unique, required),
  vehicleNumber: String,
  driverName: String,
  driverPhone: String,
  stops: [{
    stopName: String,
    arrivalTime: String,
    departureTime: String
  }],
  monthlyFee: Number,
  capacity: Number,
  students: [{ type: ObjectId, ref: 'Student' }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 12. 📄 Document Collections

### DocumentRequest Schema
```javascript
{
  _id: ObjectId,
  studentId: { type: ObjectId, ref: 'Student', required: true },
  documentType: String (enum: ['Bonafide', 'TC', 'Migration', 'Character Certificate', 'Marksheet'], required),
  purpose: String,
  requestDate: Date (default: Date.now),
  status: String (enum: ['Pending', 'Approved', 'Rejected', 'Issued'], default: 'Pending'),
  approvedBy: { type: ObjectId, ref: 'Admin' },
  approvalDate: Date,
  remarks: String,
  documentUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 13. 🎫 Leave Management Collections

### Leave Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required),
  userRole: String (enum: ['Teacher', 'Student'], required),
  leaveType: String (enum: ['Casual', 'Sick', 'Earned', 'Medical'], required),
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number,
  reason: String (required),
  status: String (enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'),
  approvedBy: { type: ObjectId, ref: 'Admin' },
  approvalDate: Date,
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 14. ⚙️ System Collections

### SystemSettings Schema
```javascript
{
  _id: ObjectId,
  academicYear: String (required),
  currentSemester: Number,
  institutionName: String,
  institutionLogo: String,
  institutionAddress: String,
  contactEmail: String,
  contactPhone: String,
  
  // Notification Settings
  emailNotifications: Boolean (default: true),
  smsNotifications: Boolean (default: false),
  
  // Integration Settings
  paymentGateway: {
    enabled: Boolean,
    provider: String,
    apiKey: String
  },
  
  smsGateway: {
    enabled: Boolean,
    provider: String,
    apiKey: String
  },
  
  // Backup Settings
  lastBackup: Date,
  backupFrequency: String (enum: ['Daily', 'Weekly', 'Monthly']),
  
  updatedAt: Date
}
```

---

## 📊 Database Indexes

### Performance Indexes
```javascript
// Attendance
db.attendances.createIndex({ studentId: 1, date: -1 })
db.attendances.createIndex({ subjectId: 1, date: -1 })

// Marks
db.marks.createIndex({ studentId: 1, semester: 1 })
db.marks.createIndex({ subjectId: 1, examType: 1 })

// Assignments
db.assignments.createIndex({ subjectId: 1, deadline: -1 })
db.assignments.createIndex({ teacherId: 1, createdAt: -1 })

// Fee Payments
db.feepayments.createIndex({ studentId: 1, paymentDate: -1 })
db.feepayments.createIndex({ receiptNumber: 1 }, { unique: true })

// Notifications
db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 })
```

---

## 🔐 Security Considerations

1. **Password Hashing**: All passwords stored using bcrypt (salt rounds: 10)
2. **JWT Tokens**: Expire after 24 hours
3. **Sensitive Data**: PII encrypted at rest
4. **Access Control**: Role-based permissions enforced
5. **Audit Logs**: All critical operations logged

---

## 📈 Estimated Storage

| Collection | Avg Doc Size | Est. Documents | Total Size |
|------------|--------------|----------------|------------|
| Students | 2 KB | 10,000 | 20 MB |
| Teachers | 1.5 KB | 500 | 750 KB |
| Attendance | 0.5 KB | 500,000 | 250 MB |
| Assignments | 2 KB | 5,000 | 10 MB |
| Marks | 0.5 KB | 100,000 | 50 MB |
| **Total** | - | - | **~330 MB** |

---

**Database**: MongoDB 5.0+  
**ORM**: Mongoose 7.0+  
**Backup**: Daily automated backups recommended
