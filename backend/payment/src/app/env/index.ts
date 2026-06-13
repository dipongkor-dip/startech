import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PAYMENT_PORT || '5005', 10),
  databaseUrl: process.env.POST_DATABASE_URL || 'postgresql://startech:startech@localhost:5432/startech_payment',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
};
