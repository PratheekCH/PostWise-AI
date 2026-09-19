const mongoose = require('mongoose');

let isConnected = false;
let useMockStore = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/postwise_ai';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to local MongoDB (${error.message}).`);
    console.warn(`[Database Mode] Operating in memory-mock fallback mode so all API endpoints function seamlessly.`);
    useMockStore = true;
  }
};

const getDBStatus = () => ({
  isConnected,
  useMockStore,
});

module.exports = { connectDB, getDBStatus };
