import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";

export interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  profile?: {
    id: string;
    name?: string | null;
    avatar?: string | null;
    address?: string | null;
    role: string;
    isActive: boolean;
  } | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
};

export const fetchUser = createAsyncThunk<User | null, void, {rejectValue: string}>("auth/fetchUser", async (_, {rejectWithValue}) => {
  let res = await fetch("/api/auth/me", {credentials: "include"});
  if (res.ok) return res.json();
  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      res = await fetch("/api/auth/me", {credentials: "include"});
      if (res.ok) return res.json();
    }
    return null;
  }
  return rejectWithValue("Failed to fetch user");
});

export const login = createAsyncThunk<{user: User}, {login: string; password: string}, {rejectValue: string}>(
  "auth/login",
  async (credentials, {rejectWithValue}) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || "Login failed");
    return {user: data.user};
  },
);

export const register = createAsyncThunk<{user: User}, {email?: string; phone?: string; password: string; name?: string}, {rejectValue: string}>(
  "auth/register",
  async (body, {rejectWithValue}) => {
    const payload = {
      email: body.email || undefined,
      phone: body.phone || undefined,
      password: body.password,
      profile: body.name ? {name: body.name} : undefined,
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || "Registration failed");
    return {user: data.user};
  },
);

export const logout = createAsyncThunk<void, void, {rejectValue: string}>("auth/logout", async (_, {rejectWithValue}) => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return rejectWithValue("Logout failed");
});

export const setCookiesFromOAuth = createAsyncThunk<void, {accessToken: string; refreshToken: string}, {rejectValue: string}>(
  "auth/setCookiesFromOAuth",
  async (tokens, {rejectWithValue}) => {
    const res = await fetch("/api/auth/set-cookies", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(tokens),
    });
    if (!res.ok) return rejectWithValue("Failed to set session");
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(setCookiesFromOAuth.fulfilled, (state) => {
        // User will be fetched by initializeAuth
      });
  },
});

export const {setUser, reset} = authSlice.actions;
export default authSlice.reducer;
