import dotenv from 'dotenv';

dotenv.config();

// environment variables compose.yaml file is used to set the environment variables for the product service

export default {
  port: parseInt(process.env.PORT || '3004', 10),
  dbUrl: process.env.DB_URL || 'mongodb://startech:startech@localhost:27017/startech_product?authSource=admin',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  orderServiceUrl: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
};
