const { Admin, Student } = require('../models');
const { seedAllRecords } = require('./demoSeeder');

const autoSeed = async () => {
  try {
    const studentCount = await Student.countDocuments();
    if (studentCount >= 10) {
      // Database already has ample records
      return;
    }

    console.log('⚡ Initializing Dr. AITD College ERP comprehensive demo records & accounts...');
    const stats = await seedAllRecords();
    console.log('✔ Dr. AITD ERP Auto-seeding completed.');
  } catch (error) {
    console.error('Error during auto-seeding:', error.message);
  }
};

module.exports = { autoSeed };
