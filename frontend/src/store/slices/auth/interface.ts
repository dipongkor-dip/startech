export enum UserRole {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  PRODUCT_MANAGER = "PRODUCT_MANAGER",
  DELIVERY_BOY = "DELIVERY_BOY",
  CUSTOMER = "CUSTOMER",
  CUSTOMER_SUPPORT_MANAGER = "CUSTOMER_SUPPORT_MANAGER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface User {
  email?: string | null;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  isValidated: boolean;
  needPasswordReset: boolean;
  profile?: {
    name?: string | null;
    avatar?: string | null;
    division: string | null;
    city: string | null;
    upazila: string | null;
    address: string | null;
    isActive: boolean;
    createdAt: Date;
  } | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export interface LoginCredentials {
  email: string | undefined;
  phone: string | undefined;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface RegisterData {
  email?: string;
  phone?: string;
  password: string;
  name?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpCredentials {
  email: string | null;
  phone: string | null;
  otp: string;
}

export interface VerifyOtpResponse {
  isValidated: boolean;
  accessToken: string;
  refreshToken: string;
}
