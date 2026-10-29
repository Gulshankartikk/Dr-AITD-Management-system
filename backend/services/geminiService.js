const { GoogleGenAI } = require('@google/genai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    this.client = null;
    this.initClient();
  }

  initClient() {
    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || this.apiKey;
    if (key && key.trim() !== '' && !key.includes('your_gemini_api_key')) {
      try {
        this.client = new GoogleGenAI({ apiKey: key.trim() });
      } catch (err) {
        console.warn('Failed to initialize GoogleGenAI client:', err.message);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  isConfigured() {
    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    return Boolean(key && key.trim() !== '' && !key.includes('your_gemini_api_key'));
  }

  /**
   * Helper to execute prompt using Google Gen AI SDK or fallback REST fetch
   */
  async generateText(prompt, systemInstruction = '') {
    this.initClient();

    if (this.client) {
      try {
        const response = await this.client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: systemInstruction ? { systemInstruction } : undefined
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (sdkError) {
        console.warn('Gemini SDK attempt failed, trying fallback model or REST API...', sdkError.message);
        try {
          const fallbackResp = await this.client.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt
          });
          if (fallbackResp && fallbackResp.text) {
            return fallbackResp.text;
          }
        } catch (fbErr) {
          console.warn('Fallback model failed:', fbErr.message);
        }
      }
    }

    // Direct REST API fallback
    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (key && !key.includes('your_gemini_api_key')) {
      try {
        const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }]
          })
        });
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch (fetchErr) {
        console.warn('Gemini REST fetch failed:', fetchErr.message);
      }
    }

        return null;
  }

  /**
   * Helper to execute prompt and return parsed JSON or structured object
   */
  async generateStructuredResponse(prompt, systemInstruction = '') {
    const rawText = await this.generateText(prompt, systemInstruction);
    if (!rawText) return null;
    try {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return { raw: rawText };
    }
  }

  /**
   * Universal Role-Aware Chat
   */
  async chat({ message, role = 'student', userName = '', history = [] }) {
    const systemPrompt = `You are "AITD Campus AI Copilot", the official AI assistant for Dr. Ambedkar Institute of Technology for Handicapped (Dr. AITD), Kanpur.
The current user is: ${userName || 'A college member'} (Role: ${role.toUpperCase()}).
Your goals:
- Provide clear, helpful, encouraging, and accurate educational and administrative assistance.
- Answer queries about computer science engineering, academic subjects, syllabus, exams, assignments, timetable, and campus policies.
- If the user is a STUDENT: Help them study, understand complex concepts, structure assignments, and draft leave applications.
- If the user is a TEACHER: Assist with syllabus planning, quiz question generation, notice drafting, and grading tips.
- If the user is an ADMIN: Assist with institutional notices, academic reporting summaries, and management policies.
- Keep answers formatted in clean markdown with bullet points and bold highlights where appropriate.`;

    // Format recent chat history
    let contextHistory = '';
    if (Array.isArray(history) && history.length > 0) {
      contextHistory = 'Recent Conversation:\n' + history.slice(-6).map(h => `${h.sender}: ${h.text}`).join('\n') + '\n\n';
    }

    const prompt = `${contextHistory}User (${role}): ${message}`;
    const aiResponse = await this.generateText(prompt, systemPrompt);

    if (aiResponse) {
      return aiResponse;
    }

    // Smart fallback if API key is not configured or network offline
    return this.getSimulatedResponse(message, role, userName);
  }

  /**
   * Explain an academic topic
   */
  async explainTopic({ topic, subject = '', depth = 'standard' }) {
    const systemPrompt = `You are an expert college professor explaining engineering and computer science concepts clearly.
Format your response with:
1. **Core Concept** (Simple definition)
2. **Key Components & How it Works** (Step-by-step breakdown)
3. **Real-world Example or Analogy**
4. **Summary & Key Takeaways**`;

    const prompt = `Please explain the following topic for a college student:
Subject: ${subject || 'Computer Science / Engineering'}
Topic: ${topic}
Depth: ${depth}`;

    const text = await this.generateText(prompt, systemPrompt);
    if (text) return text;

    return `### **${topic}** (${subject || 'Engineering'})\n\n**1. Overview**\n${topic} is a fundamental concept in ${subject || 'computer science and engineering'}. It provides the underlying mechanism for organizing and processing tasks efficiently.\n\n**2. Key Principles**\n- **Modularity:** Breaking complex problems into manageable sub-components.\n- **Efficiency:** Optimizing algorithmic time and space complexity.\n- **Reliability:** Ensuring consistent, reproducible results across varying inputs.\n\n**3. Real-World Example**\nThink of ${topic} like an organized postal distribution hub: incoming items are categorized, sorted based on priority and destination, and dispatched along optimized paths.\n\n*(Note: Add your GEMINI_API_KEY in backend/.env for dynamic real-time Gemini explanations)*`;
  }

  /**
   * Generate Quiz Questions
   */
  async generateQuiz({ topic, subject = '', count = 5 }) {
    const systemPrompt = `You are an academic assessment specialist. Generate ${count} multiple choice questions (MCQs) on the specified topic.
Output each question with:
- Question text
- 4 options (A, B, C, D)
- Correct Answer
- Brief 1-sentence Explanation`;

    const prompt = `Generate a ${count}-question quiz on:
Subject: ${subject}
Topic: ${topic}`;

    const text = await this.generateText(prompt, systemPrompt);
    if (text) return text;

    return `### Practice Quiz: ${topic}\n\n**Q1. What is the primary characteristic of ${topic}?**\n- A) Linear scaling\n- B) Dynamic state management\n- C) Constant execution time\n- D) Static allocation\n\n*Correct Answer:* **B) Dynamic state management**\n*Explanation:* ${topic} dynamically handles state updates and resource allocation.\n\n**Q2. Which of the following is a key advantage of ${topic}?**\n- A) Increased algorithmic efficiency\n- B) Elimination of memory overhead\n- C) Hardware independence\n- D) Infinite recursion support\n\n*Correct Answer:* **A) Increased algorithmic efficiency**\n*Explanation:* It streamlines processing sequences to optimize execution cycles.\n\n*(Note: Add GEMINI_API_KEY in backend/.env for unlimited custom quizzes)*`;
  }

  /**
   * Generate Official Notice / Circular
   */
  async generateNotice({ title, audience = 'All Students & Faculty', keyPoints = '', tone = 'Formal' }) {
    const systemPrompt = `You are the Administrative Officer at Dr. Ambedkar Institute of Technology for Handicapped (Dr. AITD), Kanpur.
Draft an official college notice / circular with:
- Notice Title
- Reference No. & Date placeholder
- Salutation
- Clear structured body paragraphs
- Required student/faculty action items
- Sign-off / Administration footer`;

    const prompt = `Draft an official college notice:
Topic/Title: ${title}
Target Audience: ${audience}
Key Points: ${keyPoints}
Tone: ${tone}`;

    const text = await this.generateText(prompt, systemPrompt);
    if (text) return text;

    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    return `**DR. AMBEDKAR INSTITUTE OF TECHNOLOGY FOR HANDICAPPED, KANPUR**\n*Office of the Administration & Academic Affairs*\n\n**CIRCULAR / NOTICE**\n\n**Ref No:** Dr-AITD/ADMIN/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}\n**Date:** ${dateStr}\n**Target Audience:** ${audience}\n\n**Subject: ${title}**\n\nThis is to formally notify that ${keyPoints || 'relevant academic and administrative activities will proceed as per the schedule'}.\n\nAll concerned students and department members are advised to:\n1. Adhere strictly to the announced deadlines and guidelines.\n2. Ensure all relevant documentation or submissions are completed in a timely manner.\n3. Contact their respective department coordinators in case of any clarification.\n\nYour cooperation in ensuring smooth institutional operations is highly appreciated.\n\n**By Order,**\n*Registrar / Academic Dean*\nDr. AITD, Kanpur`;
  }

  /**
   * Generate Leave Application for Student
   */
  async generateLeaveApplication({ studentName, rollNo, reason, startDate, endDate, leaveType = 'Medical' }) {
    const systemPrompt = `You are an academic writing assistant. Draft a formal, respectful student leave application to the Head of Department (HOD) at Dr. AITD Kanpur.`;

    const prompt = `Draft student leave application:
Student Name: ${studentName || 'Student'}
Roll Number: ${rollNo || 'STU2025'}
Leave Type: ${leaveType}
Dates: From ${startDate} to ${endDate}
Reason: ${reason}`;

    const text = await this.generateText(prompt, systemPrompt);
    if (text) return text;

    return `To,\nThe Head of Department,\nDr. Ambedkar Institute of Technology for Handicapped,\nKanpur, Uttar Pradesh.\n\nSubject: Application for ${leaveType} Leave (From ${startDate || 'Tomorrow'} to ${endDate || 'Day after tomorrow'})\n\nRespected Sir/Madam,\n\nI am writing to respectfully inform you that I, ${studentName || 'Student'} (Roll No: ${rollNo || 'STU2025'}), am unable to attend regular classes from ${startDate || 'the requested start date'} to ${endDate || 'end date'} due to ${reason || 'unavoidable personal circumstances'}.\n\nI assure you that I will catch up on all missed academic lectures, notes, and lab assignments promptly upon my return.\n\nI kindly request you to grant me leave for the specified duration.\n\nThanking you.\n\nYours obediently,\n${studentName || 'Student'}\nRoll No: ${rollNo || 'STU2025'}`;
  }

  /**
   * Generate Executive Insights for Admin Reports
   */
  async generateReportSummary({ reportType, metrics }) {
    const systemPrompt = `You are a Higher Education Operations and Data Analyst. Provide executive insights and 3 actionable recommendations based on college ERP metrics.`;

    const prompt = `Analyze these ${reportType} metrics for Dr. AITD:
${JSON.stringify(metrics, null, 2)}`;

    const text = await this.generateText(prompt, systemPrompt);
    if (text) return text;

    return `### **Executive Summary: ${reportType.toUpperCase()} Analysis**\n\n- **Overall Status:** Stable operational efficiency with consistent academic participation.\n- **Key Observation:** Consistent student attendance is positively correlated with higher assessment scores across all engineering departments.\n\n**Strategic Recommendations:**\n1. **Early Intervention:** Introduce automated SMS/email alerts for students dipping below 75% attendance.\n2. **Digital Resource Adoption:** Encourage faculty to upload lecture notes directly to the portal to support revision.\n3. **Fee Clearance Follow-ups:** Implement phased instalment plans for pending dues to maximize timely collections.`;
  }

  /**
   * Generate Structured Assignment and Rubric for Faculty
   */
  async generateAssignment({ topic, subject = '', difficulty = 'Intermediate', maxMarks = 50 }) {
    const systemPrompt = `You are a university professor designing a rigorous, engaging college assignment for engineering students.
Format your output cleanly in markdown with:
# Title: [Clear descriptive title]
### 1. Problem Statement & Objectives
### 2. Detailed Task Instructions (Numbered)
### 3. Submission Guidelines & Technical Constraints
### 4. Grading Rubric (Point distribution summing to ${maxMarks} marks)`;

    const prompt = `Create an academic assignment:
Subject: ${subject || 'Engineering / Computer Science'}
Topic: ${topic}
Target Difficulty: ${difficulty}
Total Marks: ${maxMarks}`;

    const text = await this.generateText(prompt, systemPrompt);
    if (text) return text;

    return `### Assignment: Practical Implementation & Analysis of ${topic}\n\n**Subject:** ${subject || 'Computer Science'}\n**Marks:** ${maxMarks} | **Level:** ${difficulty}\n\n#### 1. Objective & Problem Statement\nStudents will implement and analyze the architectural principles and operational characteristics of **${topic}**. The goal is to evaluate algorithmic efficiency, edge-case behavior, and real-world deployment trade-offs.\n\n#### 2. Key Tasks\n1. Formulate the core theoretical model and provide architectural diagrams.\n2. Develop functional code demonstrating ${topic} with thorough inline documentation.\n3. Execute performance benchmarks with varying workload sizes.\n4. Write an executive summary comparing theoretical vs observed execution times.\n\n#### 3. Evaluation Rubric (${maxMarks} Marks Total)\n- **Correctness & Architecture:** ${Math.round(maxMarks * 0.4)} Marks\n- **Code Quality & Modular Design:** ${Math.round(maxMarks * 0.3)} Marks\n- **Benchmark Analysis & Documentation:** ${Math.round(maxMarks * 0.3)} Marks`;
  }

  /**
   * Summarize Lecture Notes & Study Materials for Students
   */
  async summarizeResource({ title, description = '', subject = '' }) {
    const systemPrompt = `You are a patient university study coach. Create a comprehensive, easy-to-understand revision summary of the given study note.
Structure:
1. **Core Concept in 2 Sentences**
2. **Key Formulas / Definitions / Principles** (Bullet points)
3. **Common Exam Traps & Mistakes**
4. **3 Quick Self-Assessment Questions (with Answers)**`;

    const prompt = `Summarize and explain this academic resource:
Title: ${title}
Subject: ${subject}
Description/Content: ${description}`;

    const text = await this.generateText(prompt, systemPrompt);
    if (text) return text;

    return `### Quick Study Guide: ${title}\n**Subject:** ${subject || 'Engineering'}\n\n#### 1. Core Concept\n${title} covers essential computational principles critical for semester examinations and competitive engineering problem solving. It provides foundation knowledge for scalable system design.\n\n#### 2. Key Takeaways\n- **Foundational Definition:** Master the underlying theory, input constraints, and return guarantees.\n- **Efficiency:** Analyze both best-case and worst-case space-time bounds.\n- **Application:** Connect the theoretical algorithm to practical software systems.\n\n#### 3. Quick Self-Check\n1. *What is the primary constraint of this concept?* Ensures deterministic execution under stress.\n2. *How is memory managed during execution?* Managed via stack-allocated contexts or linear buffers.\n3. *Where is this applied in real industry?* In distributed backends and database query planners.`;
  }

  /**
   * Personalized Student Academic Advisor & Study Plan
   */
  async generateStudyPlan({ studentName, attendanceRate, marks = [], subjects = [] }) {
    const systemPrompt = `You are an academic mentor at Dr. AITD. Provide constructive, encouraging, data-backed academic guidance and a weekly revision roadmap.`;

    const prompt = `Student Name: ${studentName || 'Student'}
Attendance: ${attendanceRate || 'N/A'}
Subjects: ${subjects.join(', ') || 'Computer Science courses'}
Recent Assessment Marks: ${JSON.stringify(marks.slice(0, 5))}`;

    const text = await this.generateText(prompt, systemPrompt);
    if (text) return text;

    return `### 🌟 Academic Advisory Plan for ${studentName || 'Student'}\n\n**1. Attendance Assessment:** ${attendanceRate ? `Your current attendance is ${attendanceRate}. Remember that 75% attendance is required by Dr. AITD to appear in semester exams.` : 'Ensure you maintain >75% attendance.'}\n\n**2. Core Focus Areas:**\n- Prioritize fundamental engineering subjects with high credit weightage.\n- Dedicate 45 minutes daily to solving past university question papers.\n- Form peer study groups for weekly lab practice.\n\n**3. Weekly Roadmap:**\n- **Mon - Wed:** Theory revision & handwritten formula sheets.\n- **Thu - Fri:** Practical lab exercises & assignment submissions.\n- **Weekend:** Timed mock tests & solving previous year sessional exams.`;
  }

  /**
   * Intelligent offline fallback responses
   */
  getSimulatedResponse(message, role, userName) {
    const lower = message.toLowerCase();

    if (lower.includes('attendance')) {
      return `Hello ${userName || 'there'}! At Dr. AITD, minimum 75% attendance is required to appear in semester examinations. You can view your detailed subject-wise attendance by navigating to the **Attendance** section in your dashboard sidebar.`;
    }

    if (lower.includes('leave') || lower.includes('sick')) {
      return `To apply for leave, navigate to **Leave Management** in your dashboard. You can also use our **✨ AI Draft Leave Application** tool to automatically generate a formal letter to your HOD in seconds!`;
    }

    if (lower.includes('exam') || lower.includes('date') || lower.includes('schedule')) {
      return `Semester exams and internal sessional tests are scheduled in accordance with the official Dr. AITD academic calendar. Please check the **Timetable** and **Notices** tab for the latest approved examination circulars.`;
    }

    if (lower.includes('assignment') || lower.includes('notes') || lower.includes('study material')) {
      return `All course lecture notes, study materials, and assignments uploaded by faculty members can be accessed under **Notes & Materials** in your student dashboard.`;
    }

    if (role === 'teacher') {
      return `Welcome, Professor! You can use Dr. AITD Campus AI to draft official class notices, generate quiz questions for your courses, or formulate assignment rubrics. Let me know what you would like to prepare today!`;
    }

    if (role === 'admin') {
      return `Administrator greetings! I am ready to help you draft institutional circulars, analyze student-faculty attendance ratios, or format fee collection summaries. How can I assist you with college operations?`;
    }

    return `Hello ${userName || 'there'}! I am your **Dr. AITD Campus AI Copilot**. I can help you with course concepts, exam preparation, syllabus details, leave letters, and campus guidelines. What would you like to explore today?\n\n*(Tip: To enable live Gemini AI generation, add your free GEMINI_API_KEY in \`backend/.env\`)*`;
  }
}

module.exports = new GeminiService();
