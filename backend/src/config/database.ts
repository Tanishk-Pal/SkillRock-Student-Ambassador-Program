import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ssap_db';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Please configure the environment variable.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected successfully (Database: ${DB_NAME})`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
};
