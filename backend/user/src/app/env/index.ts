import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV,
  corsOrigin: process.env.FRONTEND_URL,

  port: process.env.USER_PORT,
  databaseUrl: process.env.POST_DATABASE_URL,

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

  facebookAppId: process.env.FACEBOOK_APP_ID as string,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET as string,

  smsGatewayDomain: process.env.SMS_GATEWAY_DOMAIN,

  jwt_secret: process.env.JWT_SECRET as string,
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES,
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES,

  nodemailer: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
  },

  redis_url: process.env.REDIS_URL || "redis://redis:6379",
  rabbitmq_url: process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",

  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || "dipongkorroy00000@gmail.com",
    password: process.env.SUPER_ADMIN_PASSWORD || "abAB12**",
  },

  sms: {
    gateway_url: process.env.SMS_GATEWAY_URL as string,
    gateway_token: process.env.SMS_GATEWAY_TOKEN as string,
  },
};
