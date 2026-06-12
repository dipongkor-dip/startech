import dotenv from 'dotenv';

dotenv.config();

export default {
  port: parseInt(process.env.PORT || '5006', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
};
