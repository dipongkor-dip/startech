import dotenv from "dotenv";

dotenv.config();

// environment variables compose.yaml file is used to set the environment variables for the product service

export default {
  port: parseInt(process.env.PRODUCT_PORT || "5004", 10),
  dbUrl: process.env.MONGO_DATABASE_URL || "mongodb://startech:startech@mongodb:27017/startech?authSource=admin",
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.FRONTEND_URL || "http://localhost:3000",
  userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:5003",
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:5002",
  rabbitmq_url: process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",

  jwt_secret: process.env.JWT_SECRET as string,
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES,
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES,
};
