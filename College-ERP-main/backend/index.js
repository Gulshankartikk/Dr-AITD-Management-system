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

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// routes

// student route
app.use("/student", require("./routes/student"));
// course route
app.use("/courses", require("./routes/course"));
// course module route
app.use("/course-module", require("./routes/courseModule"));
// teacher route
app.use("/teacher", require("./routes/teacher"));
// teacher module routes
app.use("/teacher", require("./routes/teacherModule"));
// notices route
app.use("/notices", require("./routes/notices"));
// materials route
app.use("/materials", require("./routes/materials"));
// assignments route
app.use("/assignments", require("./routes/assignments"));
// subjects route
app.use("/subjects", require("./routes/subjects"));
// marks route
app.use("/marks", require("./routes/marks"));
// student notes route
app.use("/student-notes", require("./routes/student-notes"));
// messages route
app.use("/messages", require("./routes/messages"));
// student management route
app.use("/student", require("./routes/student-management"));
// complete ERP routes
app.use("/api", require("./routes/completeRoutes"));
// notification routes
app.use("/notifications", require("./routes/notifications"));

app.listen(PORT, () => {
  console.log("Server Started at", PORT);
});
