import mongoose from 'mongoose';
import env from '../env';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.dbUrl);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnection failed:', error);
    throw error;
  }
};
