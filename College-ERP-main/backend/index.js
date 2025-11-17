const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const db = require("./database/db");

// variables
const PORT = process.env.PORT || 4000;

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// routes
// subjects route
app.use("/subjects", require("./routes/subjects"));
// complete ERP routes
app.use("/api", require("./routes/completeRoutes"));



app.listen(PORT, () => {
  console.log("Server Started at", PORT);
});
