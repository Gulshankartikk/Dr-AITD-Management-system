const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/Auth');
const aiController = require('../controller/aiController');

// Status endpoint
router.get('/status', aiController.getStatus);

// All AI features require token authentication
router.post('/chat', verifyToken, aiController.chat);
router.post('/explain', verifyToken, aiController.explainTopic);
router.post('/generate-quiz', verifyToken, aiController.generateQuiz);
router.post('/generate-notice', verifyToken, aiController.generateNotice);
router.post('/generate-leave', verifyToken, aiController.generateLeaveApplication);
router.post('/report-summary', verifyToken, aiController.generateReportSummary);
router.post('/generate-assignment', verifyToken, aiController.generateAssignment);
router.post('/summarize-resource', verifyToken, aiController.summarizeResource);
router.post('/study-plan', verifyToken, aiController.generateStudyPlan);

module.exports = router;
