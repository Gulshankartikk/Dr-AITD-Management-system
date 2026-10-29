const mongoose = require("mongoose");
const { autoSeed } = require("./autoSeed");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/college-erp";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Auto-seed default accounts if database is empty
    await autoSeed();
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn("Server starting in offline database mode. Start MongoDB to enable data persistence.");
    return null;
  }
};

module.exports = connectDB;
