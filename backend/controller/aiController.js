const geminiService = require('../services/geminiService');

const chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, msg: 'Message is required' });
    }

    const role = req.user?.role || 'student';
    const userName = req.user?.name || '';

    const reply = await geminiService.chat({
      message,
      history,
      role,
      userName
    });

    res.json({
      success: true,
      reply,
      isLive: geminiService.isConfigured()
    });
  } catch (err) {
    next(err);
  }
};

const explainTopic = async (req, res, next) => {
  try {
    const { topic, subject, depth } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, msg: 'Topic is required' });
    }

    const explanation = await geminiService.explainTopic({ topic, subject, depth });
    res.json({ success: true, explanation, isLive: geminiService.isConfigured() });
  } catch (err) {
    next(err);
  }
};

const generateQuiz = async (req, res, next) => {
  try {
    const { topic, subject, count } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, msg: 'Topic is required' });
    }

    const quiz = await geminiService.generateQuiz({
      topic,
      subject,
      count: parseInt(count, 10) || 5
    });

    res.json({ success: true, quiz, isLive: geminiService.isConfigured() });
  } catch (err) {
    next(err);
  }
};

const generateNotice = async (req, res, next) => {
  try {
    const { title, audience, keyPoints, tone } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, msg: 'Notice title is required' });
    }

    const noticeText = await geminiService.generateNotice({ title, audience, keyPoints, tone });
    res.json({ success: true, noticeText, isLive: geminiService.isConfigured() });
  } catch (err) {
    next(err);
  }
};

const generateLeaveApplication = async (req, res, next) => {
  try {
    const { reason, startDate, endDate, leaveType } = req.body;
    const studentName = req.user?.name || req.body.studentName || 'Student';
    const rollNo = req.user?.rollNo || req.body.rollNo || 'STU2025';

    const application = await geminiService.generateLeaveApplication({
      studentName,
      rollNo,
      reason,
      startDate,
      endDate,
      leaveType
    });

    res.json({ success: true, application, isLive: geminiService.isConfigured() });
  } catch (err) {
    next(err);
  }
};

const generateReportSummary = async (req, res, next) => {
  try {
    const { reportType, metrics } = req.body;
    const summary = await geminiService.generateReportSummary({
      reportType: reportType || 'Institutional Overview',
      metrics: metrics || {}
    });

    res.json({ success: true, summary, isLive: geminiService.isConfigured() });
  } catch (err) {
    next(err);
  }
};

const generateAssignment = async (req, res, next) => {
  try {
    const { topic, subject, difficulty, maxMarks } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, msg: 'Assignment topic is required' });
    }

    const assignment = await geminiService.generateAssignment({
      topic,
      subject,
      difficulty,
      maxMarks: Number(maxMarks) || 50
    });

    res.json({ success: true, assignment, isLive: geminiService.isConfigured() });
  } catch (err) {
    next(err);
  }
};

const summarizeResource = async (req, res, next) => {
  try {
    const { title, description, subject } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, msg: 'Resource title is required' });
    }

    const summary = await geminiService.summarizeResource({ title, description, subject });
    res.json({ success: true, summary, isLive: geminiService.isConfigured() });
  } catch (err) {
    next(err);
  }
};

const generateStudyPlan = async (req, res, next) => {
  try {
    const { attendanceRate, marks, subjects } = req.body;
    const studentName = req.user?.name || req.body.studentName || 'Student';

    const studyPlan = await geminiService.generateStudyPlan({
      studentName,
      attendanceRate,
      marks,
      subjects
    });

    res.json({ success: true, studyPlan, isLive: geminiService.isConfigured() });
  } catch (err) {
    next(err);
  }
};

const getStatus = (req, res) => {
  res.json({
    success: true,
    configured: geminiService.isConfigured(),
    model: 'gemini-2.5-flash',
    features: [
      'Universal Chat Copilot',
      'Topic Explainer',
      'Quiz Generator',
      'Notice Drafter',
      'Leave Application Generator',
      'Executive Insights',
      'Assignment & Rubric Generator',
      'Study Notes Summarizer',
      'Academic Advisor & Study Planner'
    ]
  });
};

module.exports = {
  chat,
  explainTopic,
  generateQuiz,
  generateNotice,
  generateLeaveApplication,
  generateReportSummary,
  generateAssignment,
  summarizeResource,
  generateStudyPlan,
  getStatus
};
