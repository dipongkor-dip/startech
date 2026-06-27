import {createAsyncThunk} from "@reduxjs/toolkit";
import type {LoginCredentials, LoginResponse, RegisterData, RegisterResponse, User, VerifyOtpCredentials, VerifyOtpResponse} from "./interface";
import axios from "axios";

// Helper function to get auth base URL
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5003/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchUserAPI = async (): Promise<User> => {
  const res = await axiosInstance.get("/auth/me");
  return res.data?.data ?? res.data;
};

export const loginAPI = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data?.data ?? res.data;
};

export const registerAPI = async (userData: RegisterData): Promise<RegisterResponse> => {
  const payload = {
    email: userData.email || undefined,
    phone: userData.phone || undefined,
    password: userData.password,
    name: userData.name,
  };
  const res = await axiosInstance.post("/auth/register", payload);
  return res.data;
};

export const verifyOtpAPI = async (credentials: VerifyOtpCredentials): Promise<{status: boolean; message: string}> => {
  const res = await axiosInstance.post("/auth/send-otp", credentials);
  return res.data;
};

export const sendOTP = async (credentials: {email: string | undefined; phone: string | undefined}): Promise<{status: boolean; message: string}> => {
  const res = await axiosInstance.post("/auth/otp-verify", credentials);
  return res.data;
};

export const logoutAPI = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
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

export const sendOtp = createAsyncThunk<{status: boolean; message: string}, {email: string | undefined; phone: string | undefined}, {rejectValue: string}>(
  "auth/send-otp",
  async (credentials, {rejectWithValue}) => {
    try {
      return await sendOTP(credentials);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "OTP Sending failed");
    }
  },
);

export const verifyOtp = createAsyncThunk<{status: boolean; message: string}, VerifyOtpCredentials, {rejectValue: string}>(
  "auth/verify-otp",
  async (credentials, {rejectWithValue}) => {
    try {
      return await verifyOtpAPI(credentials);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "OTP verification failed");
    }
  },
);

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
