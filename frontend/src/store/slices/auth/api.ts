import {createAsyncThunk} from "@reduxjs/toolkit";
import type {LoginCredentials, LoginResponse, RegisterData, RegisterResponse, User, VerifyOtpCredentials, VerifyOtpResponse} from "./interface";

// Helper function to get auth base URL
const getAuthBaseUrl = () => `http://localhost:5003/api/v1/auth`;

// API functions
const fetchUserAPI = async (): Promise<User> => {
  let res = await fetch(`${getAuthBaseUrl()}/me`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data?.data ?? data;
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

  return data.data || data;
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

  return {message: data.message};
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
