const path = require("path");
// Ensure .env is loaded whether run from repo root or backend folder
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require('fs');
const db = require("./database/db");

// variables
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Connecting database
db();

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'http://localhost:4000',
        'http://127.0.0.1:4000'
      ];

      // Add production frontend URL if specified
      if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }

      // In development or if specifically allowed, permit requests with no origin 
      // (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Check allowed origins
      const isAllowed = allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV === 'production' &&
          (origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app') || origin.endsWith('.render.com')));

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(uploadsDir));

app.get("/", (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    success: true,
    msg: "Welcome to Dr AITD Management system API",
    status: "Healthy",
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route aliases for backward compatibility
app.get('/courses', (req, res) => res.redirect(307, '/api/courses'));
app.get('/subjects', (req, res) => res.redirect(307, '/api/subjects'));

// routes
app.use("/api", require("./routes/completeRoutes"));

// Global error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Fallback route for SPA
app.get('*', (req, res) => {
  res.status(404).json({ success: false, msg: 'API route not found' });
});

const startServer = (portToTry, attempt = 1) => {
  const server = app.listen(portToTry, () => {
    console.log(`Server Started at port ${portToTry}`);
  });

  server.on('error', (err) => {
    if ((err.code === 'EADDRINUSE' || err.code === 'EACCES') && attempt < 3) {
      const nextPort = portToTry === 4000 ? 5000 : portToTry + 1;
      console.warn(`Port ${portToTry} is busy or restricted (${err.code}). Trying fallback port ${nextPort}...`);
      startServer(nextPort, attempt + 1);
    } else {
      console.error(`Failed to start server on port ${portToTry}:`, err.message);
      process.exit(1);
    }
  });
};

startServer(PORT);
