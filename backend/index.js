const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const config = require("./config/environment");
const db = require("./config/database");

// variables
const PORT = config.PORT;

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
    origin: config.CORS.ORIGIN,
    credentials: config.CORS.CREDENTIALS,
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// routes
app.use("/subjects", require("./routes/subjects"));
app.use("/api", require("./routes/completeRoutes"));

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ success: false, msg: err.message || 'Internal Server Error' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, msg: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ College ERP Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
