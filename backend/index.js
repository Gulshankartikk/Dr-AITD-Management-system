const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./database/db");

// variables
const PORT = process.env.PORT || 4000;

// Connecting database
const fs = require('fs');

// Connecting database
db();

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
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
        'http://localhost:4000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:4000',
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// routes

app.use("/api", require("./routes/completeRoutes"));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.json({ success: false, msg: 'API route not found' });
});

app.listen(PORT, () => {
  console.log("Server Started at", PORT);
});
