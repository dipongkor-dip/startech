import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3005', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://startech:startech@localhost:5432/startech_payment',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
};
