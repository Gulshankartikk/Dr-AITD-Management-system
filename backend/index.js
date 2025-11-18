const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const db = require("./database/db");

// variables
const PORT = process.env.PORT || 4001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Connecting database
db();

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());

// Serve static files
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.json({ 
    message: "College ERP Backend Server", 
    status: "Running",
    version: "1.0.0",
    endpoints: {
      admin: "/api/admin/*",
      teacher: "/api/teacher/*",
      student: "/api/student/*"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ success: false, msg: 'Internal Server Error' });
});

// routes
app.use("/subjects", require("./routes/subjects"));
app.use("/api", require("./routes/completeRoutes"));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, msg: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ College ERP Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
