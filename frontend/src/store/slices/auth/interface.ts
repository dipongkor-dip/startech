export interface User {
  email?: string | null;
  phone?: string | null;
  role?: string;
  isValidate: boolean;
  needPasswordReset: boolean;
  profile?: {
    name?: string | null;
    avatar?: string | null;
    address?: string | null;
    isActive: boolean;
  } | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  needPasswordChange: boolean;
  loading: boolean;
  initialized: boolean;
  loginCredential: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  needPasswordChange: false,
  loading: false,
  initialized: false,
  loginCredential: null,
};
