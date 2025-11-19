const http = require('http');

function testLogin(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, data: JSON.parse(responseData) });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Login System...\n');

  // Test Admin Login
  try {
    const result = await testLogin('/api/admin/login', {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Admin Login: SUCCESS');
    console.log('   Status:', result.status);
    console.log('   Token:', result.data.token ? 'Generated' : 'Missing');
  } catch (error) {
    console.log('❌ Admin Login: FAILED');
    console.log('   Error:', error.message);
  }

  // Test Teacher Login
  try {
    const result = await testLogin('/api/teacher/login', {
      username: 'john.smith@college.edu',
      password: 'teacher123'
    });
    console.log('✅ Teacher Login: SUCCESS');
    console.log('   Status:', result.status);
    console.log('   Token:', result.data.token ? 'Generated' : 'Missing');
    console.log('   Teacher ID:', result.data.teacher?.id);
  } catch (error) {
    console.log('❌ Teacher Login: FAILED');
    console.log('   Error:', error.message);
  }

  // Test Student Login
  try {
    const result = await testLogin('/api/student/login', {
      username: 'alice@student.edu',
      password: 'student123'
    });
    console.log('✅ Student Login: SUCCESS');
    console.log('   Status:', result.status);
    console.log('   Token:', result.data.token ? 'Generated' : 'Missing');
    console.log('   Student ID:', result.data.student?.id);
  } catch (error) {
    console.log('❌ Student Login: FAILED');
    console.log('   Error:', error.message);
  }

  console.log('\n🎯 Updated Login Credentials:');
  console.log('👨💼 Admin: username=admin, password=admin123');
  console.log('👨🏫 Teacher: email=john.smith@college.edu, password=teacher123');
  console.log('👨🎓 Student: email=alice@student.edu, password=student123');
  console.log('\n📋 Alternative Student Logins:');
  console.log('👨🎓 Bob Wilson: email=bob@student.edu, password=student123');
  console.log('👨🎓 Carol Davis: email=carol@student.edu, password=student123');
}

runTests();