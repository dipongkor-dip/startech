import {createAsyncThunk} from "@reduxjs/toolkit";
import type {LoginCredentials, LoginResponse, RegisterData, RegisterResponse, User, VerifyOtpCredentials} from "./interface";
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
  const res = await axiosInstance.post("/auth/verify-otp", credentials);
  return res.data;
};

export const sendOTP = async (credentials: {email: string | undefined; phone: string | undefined}): Promise<{status: boolean; message: string}> => {
  const res = await axiosInstance.post("/auth/send-otp", credentials);
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

// 🟢 লগইন থাঙ্ক আপডেট
export const login = createAsyncThunk<LoginResponse, LoginCredentials, {rejectValue: string}>("auth/login", async (credentials, {rejectWithValue, dispatch}) => {
  // 🎯 ১. এখানে dispatch যুক্ত করুন
  try {
    const response = await loginAPI(credentials);

    // 🎯 ২. লগইন সফল হলে সাথে সাথে ইউজার প্রোফাইল ফেচ করার থাঙ্ক কল হবে
    await dispatch(fetchUser());

    return response;
  } catch (error: any) {
    // 💡 প্রফেশনাল ট্রিক: Axios এর আসল ব্যাকএন্ড এরর মেসেজ পাস করা
    const errMsg = error.response?.data?.message || error.message || "Login failed";
    return rejectWithValue(errMsg);
  }
});

// 🟢 রেজিস্ট্রেশন থাঙ্ক আপডেট
export const register = createAsyncThunk<RegisterResponse, RegisterData, {rejectValue: string}>("auth/register", async (userData, {rejectWithValue, dispatch}) => {
  // 🎯 ১. এখানে dispatch যুক্ত করুন
  try {
    const response = await registerAPI(userData);

    // 🎯 ২. রেজিস্ট্রেশন সফল হলে (যদি আপনার আর্কিটেকচারে রেজিস্ট্রেশনের পর সরাসরি লগইন হয়ে যায়)
    await dispatch(fetchUser());

    return response;
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message || "Registration failed";
    return rejectWithValue(errMsg);
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
  async (credentials, {rejectWithValue, dispatch}) => {
    // 🎯 dispatch যুক্ত করা হলো
    try {
      const response = await verifyOtpAPI(credentials);

      // 🎯 ওটিপি সফলভাবে ভেরিফাই হলে ইউজারের কারেন্ট প্রোফাইল লোড হবে
      await dispatch(fetchUser());

      return response;
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "OTP verification failed";
      return rejectWithValue(errMsg);
    }
  },
);

export const logout = createAsyncThunk<void, void, {rejectValue: string}>("auth/logout", async (_, {rejectWithValue}) => {
  try {
    await logoutAPI();

    
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Logout failed");
  }
});
