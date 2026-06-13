interface LoginInput {
  email: string;
  password: string;
}

interface OtpInput {
  email: string;
}

interface VerifyOtpInput {
  email: string;
  otp: string;
}

interface LoginInt {
  email?: string;
  phone?: string;
  password: string;
}

interface RegisterInt {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export type {LoginInput, OtpInput, VerifyOtpInput, LoginInt, RegisterInt};
