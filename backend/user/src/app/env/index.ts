import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3003', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://startech:startech@localhost:5432/startech_user',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
  apiUrl: process.env.API_URL || 'http://localhost:3003',
  userPublicUrl: process.env.USER_PUBLIC_URL || 'http://localhost:3003',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  facebookAppId: process.env.FACEBOOK_APP_ID || '',
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET || '',
  smsGatewayDomain: process.env.SMS_GATEWAY_DOMAIN || '',
  
  nodemailer: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || 'no-reply@startech.local',
  },

  redis_url: process.env.REDIS_URL || 'redis://localhost:6379',

  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || 'superadmin1@gmail.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'admin123***'
  }
};
