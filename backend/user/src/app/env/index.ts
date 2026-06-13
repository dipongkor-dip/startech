import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "3003", 10),
  databaseUrl: process.env.DATABASE_URL || "postgresql://startech:startech@localhost:5432/startech_user",
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.FRONTEND_URL || "http://localhost:3000",
  apiUrl: process.env.API_URL || "http://localhost:3003",
  userPublicUrl: process.env.USER_PUBLIC_URL || "http://localhost:3003",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  facebookAppId: process.env.FACEBOOK_APP_ID || "",
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET || "",
  smsGatewayDomain: process.env.SMS_GATEWAY_DOMAIN || "",

  jwt_secret: process.env.JWT_SECRET || "your-jwt-secret-change-in-production",
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES || "3d",

  nodemailer: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    smtpFrom: process.env.SMTP_FROM || "no-reply@startech.com",
  },

  redis_url: process.env.REDIS_URL || "redis://localhost:6379",
  rabbitmq_url: process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",

  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || "superadmin1@gmail.com",
    password: process.env.SUPER_ADMIN_PASSWORD || "admin123***",
  },
};
