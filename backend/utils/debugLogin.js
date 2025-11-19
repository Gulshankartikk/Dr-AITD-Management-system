const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.post('/api/admin/login', (req, res) => {
  console.log('Admin login request body:', req.body);
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'test-token', admin: { id: 'admin', name: 'Administrator', role: 'admin' } });
  } else {
    res.status(400).json({ success: false, msg: 'Invalid credentials' });
  }
});

app.post('/api/teacher/login', (req, res) => {
  console.log('Teacher login request body:', req.body);
  const { username, password } = req.body;
  
  if (username === 'teacher' && password === 'teacher123') {
    res.json({ success: true, token: 'test-token', teacher: { id: 'teacher1', name: 'Teacher', role: 'teacher' } });
  } else {
    res.status(400).json({ success: false, msg: 'Invalid credentials' });
  }
});

app.post('/api/student/login', (req, res) => {
  console.log('Student login request body:', req.body);
  const { username, password } = req.body;
  
  if (username === 'student' && password === 'student123') {
    res.json({ success: true, token: 'test-token', student: { id: 'student1', name: 'Student', role: 'student' } });
  } else {
    res.status(400).json({ success: false, msg: 'Invalid credentials' });
  }
});

app.listen(4001, () => {
  console.log('Debug server running on port 4001');
});