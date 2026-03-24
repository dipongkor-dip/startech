import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { env } from '../app/env';

export function generateOtp(length = 6) {
  // Generates a numeric OTP with leading zeros (e.g. "012345")
  const max = 10 ** length;
  const n = crypto.randomInt(0, max);
  return String(n).padStart(length, '0');
}

export async function sendOtp(params: {
  destinationType: 'email' | 'phone';
  destination: string;
  otp: string;
}) {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    console.log(`[OTP] SMTP not configured. ${params.destinationType}=${params.destination}: otp=${params.otp}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  const target =
    params.destinationType === 'phone' && env.smsGatewayDomain
      ? `${params.destination}@${env.smsGatewayDomain}`
      : params.destination;

  const isPhoneWithoutGateway = params.destinationType === 'phone' && !env.smsGatewayDomain;
  if (isPhoneWithoutGateway) {
    console.log(`[OTP] Phone OTP requested but SMS_GATEWAY_DOMAIN missing. phone=${params.destination}, otp=${params.otp}`);
    return;
  }

  await transporter.sendMail({
    from: env.smtpFrom,
    to: target,
    subject: 'StarTech OTP Verification',
    text: `Your StarTech OTP is ${params.otp}. It expires in 10 minutes.`,
    html: `<p>Your StarTech OTP is <b>${params.otp}</b>.</p><p>It expires in 10 minutes.</p>`,
  });
}

