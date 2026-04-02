import {createAsyncThunk} from "@reduxjs/toolkit";
import type {User} from "./interface";
import {setCookie} from "@/utils/serverCookie";

export interface LoginCredentials {
  email: string | undefined;
  phone: string | undefined;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isValidated: boolean;
  needPasswordReset: boolean;
  loginCredential: string;
}

export interface RegisterData {
  email?: string;
  phone?: string;
  password: string;
  name?: string;
}
export interface RegisterResponse {
  message: string;
  loginCredential: string;
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

// Helper function to get auth base URL
const getAuthBaseUrl = () => `http://localhost:3003/api/v1/auth`;

// API functions
const fetchUserAPI = async (): Promise<User> => {
  let res = await fetch(`${getAuthBaseUrl()}/me`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const data = await res.json();
    return data?.user ?? data;
  }

  if (res.status === 401) {
    const refreshRes = await fetch(`${getAuthBaseUrl()}/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (refreshRes.ok) {
      res = await fetch(`${getAuthBaseUrl()}/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data?.user ?? data;
      }
    }
    return {isValidate: false, needPasswordReset: false};
  }

  throw new Error("Failed to fetch user");
};

const loginAPI = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const res = await fetch(`${getAuthBaseUrl()}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Login failed");
  }

  setCookie("accessToken", data.accessToken, {
    secure: true,
    httpOnly: true,
    maxAge: parseInt(`${1000 * 60 * 60 * 24}`),
    path: "/",
    sameSite: "none",
  });
  setCookie("refreshToken", data.refreshToken, {
    secure: true,
    httpOnly: true,
    maxAge: parseInt(`${1000 * 30 * 60 * 60 * 24}`),
    path: "/",
    sameSite: "none",
  });

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    isValidated: data.isValidated,
    needPasswordReset: data.needPasswordReset,
    loginCredential: data.loginCredential,
  };
};

const registerAPI = async (userData: RegisterData): Promise<RegisterResponse> => {
  const payload = {
    email: userData.email || undefined,
    phone: userData.phone || undefined,
    password: userData.password,
    name: userData.name,
  };

  const res = await fetch(`${getAuthBaseUrl()}/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Registration failed");
  }

  return {message: data.message, loginCredential: data.loginCredential};
};

const logoutAPI = async (): Promise<void> => {
  const res = await fetch(`${getAuthBaseUrl()}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
};

const verifyOtpAPI = async (credentials: VerifyOtpCredentials): Promise<VerifyOtpResponse> => {
  const res = await fetch(`${getAuthBaseUrl()}/send-otp`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Login failed");
  }

  return data;
};

// Redux thunks
export const fetchUser = createAsyncThunk<User, void, {rejectValue: string}>("auth/fetchUser", async (_, {rejectWithValue}) => {
  try {
    return await fetchUserAPI();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch user");
  }
});

export const login = createAsyncThunk<LoginResponse, LoginCredentials, {rejectValue: string}>("auth/login", async (credentials, {rejectWithValue}) => {
  try {
    return await loginAPI(credentials);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Login failed");
  }
});

export const verifyOtp = createAsyncThunk<VerifyOtpResponse, VerifyOtpCredentials, {rejectValue: string}>("auth/verify-otp", async (credentials, {rejectWithValue}) => {
  try {
    return await verifyOtpAPI(credentials);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "OTP verification failed");
  }
});

export const register = createAsyncThunk<RegisterResponse, RegisterData, {rejectValue: string}>("auth/register", async (userData, {rejectWithValue}) => {
  try {
    return await registerAPI(userData);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Registration failed");
  }
});

export const logout = createAsyncThunk<void, void, {rejectValue: string}>("auth/logout", async (_, {rejectWithValue}) => {
  try {
    await logoutAPI();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Logout failed");
  }
});
