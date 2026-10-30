const mongoose = require("mongoose");
const { autoSeed } = require("./autoSeed");

const getMongoUri = () => {
  return process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/college-erp";
};

let retryTimer = null;
let isConnecting = false;

const scheduleReconnect = () => {
  if (retryTimer) return;
  retryTimer = setInterval(async () => {
    if (mongoose.connection.readyState === 1) {
      clearInterval(retryTimer);
      retryTimer = null;
      return;
    }
    if (isConnecting) return;

    try {
      isConnecting = true;
      const uri = getMongoUri();
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`MongoDB Reconnected: ${conn.connection.host}`);
      clearInterval(retryTimer);
      retryTimer = null;
      await autoSeed();
    } catch (err) {
      // Periodic background reconnect attempt failed, will retry on next tick
    } finally {
      isConnecting = false;
    }
  }, 5000);
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = getMongoUri();
  isConnecting = true;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
    // Auto-seed default accounts if database is empty
    await autoSeed();
    return conn;
  } catch (error) {
    console.error(`MongoDB Initial Connection Error: ${error.message}`);
    console.warn(`[MongoDB Warning] Could not connect to ${uri}.`);
    console.warn("[MongoDB Warning] Background auto-reconnect scheduled every 5s. Start MongoDB to enable data persistence.");
    scheduleReconnect();
    return null;
  } finally {
    isConnecting = false;
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Scheduling background reconnect...");
  scheduleReconnect();
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB Runtime Error: ${err.message}`);
});

module.exports = connectDB;
