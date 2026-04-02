"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Button} from "@/components/ui/button";
import {login, register} from "@/store/slices/auth/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const {isAuthenticated, loading} = useAppSelector((s) => s.auth);
  const router = useRouter();
  const [isNavigatingToOtp, setIsNavigatingToOtp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isNavigatingToOtp) {
      router.replace("/dashboard");
      return;
    }
  }, [isAuthenticated, isNavigatingToOtp, router]);

  useEffect(() => {
  
  }, [dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const login_email = loginValue.includes("@") ? loginValue : undefined;
    const login_phone = !loginValue.includes("@") ? loginValue : undefined;
    
    try {
      if (mode === "login") {
        // Login flow using Redux - cookies are handled by API route
        const result = await dispatch(login({email : login_email, phone: login_phone, password})).unwrap();
        // Handle login response based on validation status
        console.log("login", result);
        if (result.isValidated == false) {
          // User needs OTP verification
          const identifier = loginValue.includes("@") ? loginValue : undefined;
          const phone = !loginValue.includes("@") ? loginValue : undefined;
          router.push(`/otp-verification?type=${identifier ? "email" : "phone"}&identifier=${identifier || phone}`);
          return;
        }
        
        if (result.needPasswordReset == true) {
          // User needs password reset
          router.push("/password-change");
          return;
        }
        // Normal login - Redux handles setting user state and cookies via API
        router.replace("/dashboard");
      } else {
        // Register flow using Redux - cookies are handled by API route
        await dispatch(
          register({
            email: loginValue.includes("@") ? loginValue : undefined,
            phone: !loginValue.includes("@") ? loginValue : undefined,
            password,
            name,
          }),
        ).unwrap();

        // Registration successful - redirect to OTP verification
        const identifier = loginValue.includes("@") ? loginValue : undefined;
        const phone = !loginValue.includes("@") ? loginValue : undefined;
        router.push(`/otp-verification?type=${identifier ? "email" : "phone"}&identifier=${identifier || phone}`);
      }
    } catch (error: any) {
      setError(error || (mode === "login" ? "Login failed" : "Registration failed"));
    }
  };

  return (
    <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-center mb-6">StarTech Login</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="flex gap-2 mb-6">
        <Button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-lg font-medium ${mode === "login" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Login
        </Button>
        <Button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-lg font-medium ${mode === "register" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Register
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Email or Phone</label>
          <input
            type="text"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            placeholder="email@example.com or +1234567890"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none"
            required
          />
        </div>
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={mounted && loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {mounted && loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-card text-gray-500 dark:text-gray-100">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href={`${API_URL}/auth/google`}
          className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Link>
        <Link
          href={`${API_URL}/auth/facebook`}
          className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium"
        >
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/" className="text-indigo-600 hover:underline">
          Back to Home
        </Link>
      </p>
    </div>
  );
}
