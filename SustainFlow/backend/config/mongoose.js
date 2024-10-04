// config/mongoose.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const connectDB = async () => {
  try {
    // No need to pass useNewUrlParser and useUnifiedTopology
    await mongoose.connect(process.env.MONGOURL);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
