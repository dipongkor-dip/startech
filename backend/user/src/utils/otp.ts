import crypto from 'crypto';

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
  // nodemailer removed from this service.
  // For now, we "send" the OTP by logging it. Replace with SMS/email provider call later.
  console.log(
    `[OTP] sending to ${params.destinationType}=${params.destination}: otp=${params.otp}`,
  );
}

