import dotenv from 'dotenv';

dotenv.config();

export default {
  port: parseInt(process.env.ORDER_PORT || '5002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
  deliveryServiceUrl: process.env.DELIVERY_SERVICE_URL || 'http://localhost:5001',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:5003',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5004',
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5005',
};
