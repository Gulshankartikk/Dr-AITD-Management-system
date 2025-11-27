const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./database/db");

// variables
const PORT = process.env.PORT || 4000;

// Connecting database
db();

const app = express();

// middlewares
app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// routes
app.use("/subjects", require("./routes/subjects"));
app.use("/api", require("./routes/completeRoutes"));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.json({ success: false, msg: 'API route not found' });
});

app.listen(PORT, () => {
  console.log("Server Started at", PORT);
});
