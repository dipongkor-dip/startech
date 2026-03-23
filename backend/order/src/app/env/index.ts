import dotenv from 'dotenv';

dotenv.config();

export default {
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3004',
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  deliveryServiceUrl: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3001',
};
