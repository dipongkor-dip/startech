"use client";

import {useState} from "react";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Button} from "@/components/ui/button";
import {login, register} from "@/store/slices/auth/api";
import PassportLogin from "./PassportLogin";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {store} from "@/store";
import {roleBaseDashboards} from "@/proxy";
import {UserRole} from "@/store/slices/auth/interface";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const login_email = loginValue.includes("@") ? loginValue : undefined;
    const login_phone = !loginValue.includes("@") ? loginValue : undefined;

    try {
      if (mode === "login") {
        const data = await dispatch(login({email: login_email, phone: login_phone, password})).unwrap();
        console.log(data);
        setLoading(false);
        toast.success(data.message);

        const {user} = store.getState().auth;

        let path = roleBaseDashboards[user?.role as UserRole];

        if (user && !user.isValidated && user.role !== UserRole.CUSTOMER) {
          path = "/send-otp";
        }

        router.replace(path);
      } else {
        await dispatch(
          register({
            name,
            email: loginValue.includes("@") ? loginValue : undefined,
            phone: !loginValue.includes("@") ? loginValue : undefined,
            password,
          }),
        ).unwrap();

        setLoading(false);

        router.replace("/send-otp");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      setError(err?.message || err || (mode === "login" ? "Login failed" : "Registration failed"));
    }
  };

  return (
    <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-center mb-6">StarTech Login</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="flex gap-2 mb-6">
        <Button
          type="button"
          onClick={() => {
            (setMode("login"), setError(null));
          }}
          className={`flex-1 py-2 rounded-lg font-medium ${mode === "login" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Login
        </Button>
        <Button
          type="button"
          onClick={() => {
            (setMode("register"), setError(null));
          }}
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
        <Button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
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

      <PassportLogin></PassportLogin>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/" className="text-indigo-600 hover:underline">
          Back to Home
        </Link>
      </p>
    </div>
  );
}
