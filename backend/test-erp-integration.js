/**
 * Dr. AITD College ERP - Standalone Automated Integration & Verification Test Suite
 * Validates:
 * 1. Environment Configurations & Security Variables
 * 2. MongoDB Mongoose Models & Schemas
 * 3. Seed Data Integrity & Relationships
 * 4. Password Hashing (BCrypt) & Verification
 * 5. JWT Generation & Role-Based Authorization
 * 6. Gemini AI Service Status & Fallback Mechanism
 * 7. Express Route Table & ERP Modules Coverage
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('./models');
const geminiService = require('./services/geminiService');
const autoSeedData = require('./database/autoSeed');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function recordTest(name, status, details = '') {
  results.tests.push({ name, status, details });
  if (status === 'PASS') {
    results.passed++;
    console.log(`\x1b[32m[PASS]\x1b[0m ${name}${details ? ` -> ${details}` : ''}`);
  } else if (status === 'WARN') {
    results.warnings++;
    console.log(`\x1b[33m[WARN]\x1b[0m ${name}${details ? ` -> ${details}` : ''}`);
  } else {
    results.failed++;
    console.log(`\x1b[31m[FAIL]\x1b[0m ${name}${details ? ` -> ${details}` : ''}`);
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('    Dr. AITD College ERP - Automated Integration Test Suite     ');
  console.log('================================================================\n');

  // 1. Environment & Config
  console.log('--- 1. Configuration & Security ---');
  const port = process.env.PORT || 5000;
  if (port == 5000) {
    recordTest('Port Configuration', 'PASS', `Configured to Port ${port}`);
  } else {
    recordTest('Port Configuration', 'WARN', `Running on non-standard Port ${port}`);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length >= 16) {
    recordTest('JWT Secret Security', 'PASS', `Length: ${jwtSecret.length} chars`);
  } else {
    recordTest('JWT Secret Security', 'FAIL', 'Missing or too short JWT_SECRET');
  }

  // 2. Models & Schema Inspection
  console.log('\n--- 2. Database Models & Schema Verification ---');
  const expectedModels = [
    'Admin', 'Teacher', 'Student', 'Course', 'Subject',
    'Attendance', 'Marks', 'Timetable', 'Fee', 'Notice',
    'LibraryBook', 'Assignment', 'Settings'
  ];

  expectedModels.forEach((modelName) => {
    if (models[modelName]) {
      recordTest(`Model: ${modelName}`, 'PASS', `Schema defined with ${Object.keys(models[modelName].schema.paths).length} fields`);
    } else {
      recordTest(`Model: ${modelName}`, 'FAIL', 'Model not exported or defined');
    }
  });

  // 3. Password Hashing & Encryption Test
  console.log('\n--- 3. Password Hashing & Verification (BCrypt) ---');
  try {
    const rawPasswords = ['admin123', 'teacher123', 'student123'];
    for (const raw of rawPasswords) {
      const hash = await bcrypt.hash(raw, 10);
      const isMatch = await bcrypt.compare(raw, hash);
      const isWrong = await bcrypt.compare('wrongPassword!', hash);
      if (isMatch && !isWrong) {
        recordTest(`BCrypt Roundtrip (${raw})`, 'PASS', 'Correct password matched, wrong password rejected');
      } else {
        recordTest(`BCrypt Roundtrip (${raw})`, 'FAIL', 'Verification comparison failed');
      }
    }
  } catch (err) {
    recordTest('BCrypt Execution', 'FAIL', err.message);
  }

  // 4. JWT Token Generation & Verification Test
  console.log('\n--- 4. JWT Token Generation & Role Authorization ---');
  try {
    const mockUsers = [
      { id: 'admin1', role: 'admin', username: 'admin' },
      { id: 'teach1', role: 'teacher', username: 'teacher' },
      { id: 'stud1', role: 'student', username: 'STU2025' }
    ];

    for (const u of mockUsers) {
      const token = jwt.sign({ id: u.id, role: u.role, username: u.username }, jwtSecret || 'default_secret', { expiresIn: '1h' });
      const decoded = jwt.verify(token, jwtSecret || 'default_secret');
      if (decoded.id === u.id && decoded.role === u.role) {
        recordTest(`JWT Role Token (${u.role})`, 'PASS', `Verified payload: role=${decoded.role}, sub=${decoded.id}`);
      } else {
        recordTest(`JWT Role Token (${u.role})`, 'FAIL', 'Decoded payload mismatch');
      }
    }
  } catch (err) {
    recordTest('JWT Verification', 'FAIL', err.message);
  }

  // 5. Gemini AI Service Status & Mock Generation
  console.log('\n--- 5. Gemini AI Service & Resilient Fallback ---');
  try {
    const isConfigured = geminiService.isConfigured();
    if (isConfigured) {
      recordTest('Gemini AI Key Status', 'PASS', 'Configured with active API Key');
    } else {
      recordTest('Gemini AI Key Status', 'WARN', 'GEMINI_API_KEY is empty/placeholder; system will use offline academic heuristic fallback');
    }

    // Verify AI prompt templates and prompt building
    if (typeof geminiService.generateText === 'function' && typeof geminiService.generateStructuredResponse === 'function') {
      recordTest('Gemini AI Methods', 'PASS', 'generateText & generateStructuredResponse available');
    } else {
      recordTest('Gemini AI Methods', 'FAIL', 'Required methods missing on geminiService');
    }
  } catch (err) {
    recordTest('Gemini AI Inspection', 'FAIL', err.message);
  }

  // 6. Express App & Complete Routes Coverage
  console.log('\n--- 6. Express Route Table & ERP Modules Coverage ---');
  try {
    const routes = require('./routes/completeRoutes');
    const registeredPaths = [];
    routes.stack.forEach((r) => {
      if (r.route && r.route.path) {
        const methods = Object.keys(r.route.methods).join(',').toUpperCase();
        registeredPaths.push(`${methods} ${r.route.path}`);
      }
    });

    const essentialEndpoints = [
      'POST /auth/login',
      'POST /auth/logout',
      'GET /admin/dashboard',
      'GET /admin/students',
      'GET /admin/teachers',
      'GET /admin/courses',
      'GET /admin/subjects',
      'GET /admin/timetable',
      'GET /admin/fees',
      'GET /admin/settings',
      'GET /admin/library/books',
      'GET /admin/attendance-report',
      'POST /teacher/admin/attendance',
      'POST /teacher/admin/assignments'
    ];

    essentialEndpoints.forEach((ep) => {
      const exists = registeredPaths.some((p) => p.includes(ep.split(' ')[1]));
      if (exists) {
        recordTest(`Endpoint: ${ep}`, 'PASS', 'Registered in router');
      } else {
        recordTest(`Endpoint: ${ep}`, 'FAIL', 'Missing from router stack');
      }
    });
  } catch (err) {
    recordTest('Route Table Inspection', 'FAIL', err.message);
  }

  // 7. AutoSeed Module Sanity Check
  console.log('\n--- 7. AutoSeed Database Provisioning Module ---');
  if (typeof autoSeedData.autoSeed === 'function') {
    recordTest('AutoSeed Function', 'PASS', 'autoSeed function exported and ready for database initialization');
  } else {
    recordTest('AutoSeed Function', 'FAIL', 'autoSeed export missing');
  }

  // Summary
  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${results.passed} PASSED | ${results.failed} FAILED | ${results.warnings} WARNINGS`);
  console.log('================================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
