import api from '../api/axiosInstance';

class AIService {
  async chat(message, history = []) {
    const response = await api.post('/api/ai/chat', { message, history });
    return response.data;
  }

  async explainTopic(topic, subject = '', depth = 'standard') {
    const response = await api.post('/api/ai/explain', { topic, subject, depth });
    return response.data;
  }

  async generateQuiz(topic, subject = '', count = 5) {
    const response = await api.post('/api/ai/generate-quiz', { topic, subject, count });
    return response.data;
  }

  async generateNotice({ title, audience, keyPoints, tone }) {
    const response = await api.post('/api/ai/generate-notice', { title, audience, keyPoints, tone });
    return response.data;
  }

  async generateLeave({ reason, startDate, endDate, leaveType }) {
    const response = await api.post('/api/ai/generate-leave', { reason, startDate, endDate, leaveType });
    return response.data;
  }

  async getReportSummary(reportType, metrics = {}) {
    const response = await api.post('/api/ai/report-summary', { reportType, metrics });
    return response.data;
  }

  async generateAssignment({ topic, subject = '', difficulty = 'Intermediate', maxMarks = 50 }) {
    const response = await api.post('/api/ai/generate-assignment', { topic, subject, difficulty, maxMarks });
    return response.data;
  }

  async summarizeResource({ title, description = '', subject = '' }) {
    const response = await api.post('/api/ai/summarize-resource', { title, description, subject });
    return response.data;
  }

  async generateStudyPlan({ attendanceRate, marks = [], subjects = [] }) {
    const response = await api.post('/api/ai/study-plan', { attendanceRate, marks, subjects });
    return response.data;
  }

  async getStatus() {
    const response = await api.get('/api/ai/status');
    return response.data;
  }
}

export default new AIService();
