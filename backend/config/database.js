const mongoose = require("mongoose");

const config = require('./environment');

const db = async () => {
  try {
    const mongoUri = config.MONGO_URI;
    
    await mongoose.connect(mongoUri);

    console.log("✅ Connected with MongoDB:", mongoUri);
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
  } catch (err) {
    console.error("❌ Error Connecting with MongoDB:", err.message);
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(db, 5000);
  }
};

module.exports = db;
