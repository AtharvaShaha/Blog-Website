const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bytejournal';
    
    if (!process.env.MONGODB_URI) {
      console.log('Warning: MONGODB_URI not found in environment variables, using default local MongoDB');
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;
