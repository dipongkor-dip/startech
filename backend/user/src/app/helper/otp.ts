import crypto from "crypto";

export function generateOtp(length = 6) {
  // Generates a numeric OTP with leading zeros (e.g. "012345")
  const max = 10 ** length;
  const n = crypto.randomInt(0, max);
  return String(n).padStart(length, "0");
}
