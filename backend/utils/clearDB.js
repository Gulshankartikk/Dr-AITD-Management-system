const mongoose = require('mongoose');
require('dotenv').config();

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp');
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

clearDatabase();