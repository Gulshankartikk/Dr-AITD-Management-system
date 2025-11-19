const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting College ERP System...');

// Check if .env exists in backend
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️ Backend .env file not found. Creating from template...');
  const envExamplePath = path.join(__dirname, 'backend', '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
  }
}

// Function to start a process
const startProcess = (command, args, cwd, name) => {
  const process = spawn(command, args, {
    cwd: cwd,
    stdio: 'inherit',
    shell: true
  });

  process.on('error', (error) => {
    console.error(`❌ ${name} failed to start:`, error.message);
  });

  process.on('exit', (code) => {
    if (code !== 0) {
      console.log(`⚠️ ${name} exited with code ${code}`);
    }
  });

  return process;
};

// Start backend
console.log('🔧 Starting Backend Server...');
const backendPath = path.join(__dirname, 'backend');
const backendProcess = startProcess('npm', ['start'], backendPath, 'Backend');

// Wait a bit then start frontend
setTimeout(() => {
  console.log('🎨 Starting Frontend Development Server...');
  const frontendPath = path.join(__dirname, 'frontend');
  const frontendProcess = startProcess('npm', ['run', 'dev'], frontendPath, 'Frontend');
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down College ERP System...');
  process.exit(0);
});

console.log('✅ College ERP System is starting up...');
console.log('📋 Access URLs:');
console.log('   Frontend: http://localhost:5173');
console.log('   Backend API: http://localhost:4000');
console.log('\n💡 Press Ctrl+C to stop all servers');