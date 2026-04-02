import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchUser, login, logout, register, verifyOtp} from "./api";
import {initialState, User} from "./interface";

const authSlice = createSlice({
  name: "auth",
  initialState, // when first time init redux then set initial values
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload.isValidate;
      state.needPasswordChange = action.payload.needPasswordReset;
    },
    reset: () => initialState, // when user logout -> call this reset function then set initial values
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.loginCredential = action.payload.loginCredential;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = action.payload.isValidated;
        state.loginCredential = action.payload.loginCredential;
        state.needPasswordChange = action.payload.needPasswordReset;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isValidated;
        state.initialized = false;
        state.loginCredential = null;
      })
      .addCase(verifyOtp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = action.payload?.isValidate || false;
        state.needPasswordChange = action.payload?.needPasswordReset || false;
        state.loginCredential = null;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.initialized = false;
        state.isAuthenticated = false;
        state.loginCredential = null;
      });
  },
});

export const {setUser, reset} = authSlice.actions;
export default authSlice.reducer;
