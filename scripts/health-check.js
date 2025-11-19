const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 College ERP Health Check Starting...\n');

// Check if required files exist
const requiredFiles = [
  'backend/package.json',
  'backend/index.js',
  'backend/.env',
  'frontend/package.json',
  'frontend/src/main.jsx'
];

console.log('📁 Checking required files...');
let filesOk = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    filesOk = false;
  }
});

if (!filesOk) {
  console.log('\n❌ Some required files are missing. Please check the project structure.');
  process.exit(1);
}

// Check backend server
const checkServer = (url, name) => {
  return new Promise((resolve) => {
    const request = http.get(url, (res) => {
      console.log(`✅ ${name} is running (Status: ${res.statusCode})`);
      resolve(true);
    });

    request.on('error', () => {
      console.log(`❌ ${name} is not running`);
      resolve(false);
    });

    request.setTimeout(5000, () => {
      console.log(`⚠️ ${name} timeout`);
      request.destroy();
      resolve(false);
    });
  });
};

const runHealthCheck = async () => {
  console.log('\n🌐 Checking server status...');
  
  const backendStatus = await checkServer('http://localhost:4000', 'Backend Server');
  const frontendStatus = await checkServer('http://localhost:5173', 'Frontend Server');

  console.log('\n📊 Health Check Summary:');
  console.log(`Files: ${filesOk ? '✅ OK' : '❌ ISSUES'}`);
  console.log(`Backend: ${backendStatus ? '✅ RUNNING' : '❌ DOWN'}`);
  console.log(`Frontend: ${frontendStatus ? '✅ RUNNING' : '❌ DOWN'}`);

  if (filesOk && backendStatus && frontendStatus) {
    console.log('\n🎉 College ERP System is healthy!');
    console.log('🌐 Access: http://localhost:5173');
  } else {
    console.log('\n⚠️ Some issues detected. Please check the logs above.');
    if (!backendStatus || !frontendStatus) {
      console.log('💡 Try running: npm start');
    }
  }
};

runHealthCheck();