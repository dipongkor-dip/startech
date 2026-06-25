"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {fetchUser} from "@/store/slices/auth/api";

export default function OtpVerificationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const {user, loading} = useAppSelector((state) => state.auth);
  const [authData, setAuthData] = useState<{type: "email" | "phone"; value: string} | null>(null);

  // ১. সেশন স্টোরেজ থেকে সুরক্ষিতভাবে পেলোড ডাটা রিড এবং মেমোরি গেট-কিপিং
  useEffect(() => {
    setIsMounted(true);
    const savedPayload = sessionStorage.getItem("otp_auth_payload");

    // যদি অলরেডি ভ্যালিডেটেড ইউজার হয় অথবা স্টোরেজে ওটিপির ডাটা না থাকে, তবে ফিরিয়ে দিন
    if ((user && user?.isValidated) || !savedPayload) {
      router.replace("/");
      return;
    }

    if (savedPayload) {
      try {
        setAuthData(JSON.parse(savedPayload));
      } catch (e) {
        router.replace("/auth");
      }
    }
  }, [user, router]);

  // ২. ইমেইল বা ফোন নম্বর মাস্কিং (Masking) লজিক
  const maskedIdentifier = useMemo(() => {
    if (!authData?.value) return "your verification target";

    const identifier = authData.value;

    if (authData.type === "phone") {
      const visible = identifier.slice(-4);
      return `••••••${visible}`;
    }

    // ইমেইল মাস্কিং
    const [name, domain = ""] = identifier.split("@");
    if (!name || !domain) return identifier;
    const safeName = `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}`;
    return `${safeName}@${domain}`;
  }, [authData]);

  // ৩. ওটিপি ভেরিফিকেশন হ্যান্ডলার
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!authData?.value) {
      setError("Session expired. Please try registering again.");
      return;
    }

    if (!/^\d{4,8}$/.test(otp)) {
      setError("Enter a valid OTP code.");
      return;
    }

    setSubmitting(true);

    // ডাইনামিক পেলোড তৈরি
    const payload = authData.type === "phone" ? {phone: authData.value, otp} : {email: authData.value, otp};

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "OTP verification failed");
        setSubmitting(false);
        return;
      }

      // ভেরিফিকেশন সফল হলে স্টোরেজ ক্লিন করে দিন এবং ইউজার ডাটা রি-ফেচ করুন
      sessionStorage.removeItem("otp_auth_payload");
      await dispatch(fetchUser()).unwrap();

      setSubmitting(false);

      // ড্যাশবোর্ডে সম্পূর্ণ পেজ রিলোড দিয়ে নিয়ে যাওয়ার জন্য (আপনার আগের আর্কিটেকচার অনুযায়ী)
      window.location.href = "/dashboard";
    } catch {
      setError("OTP verification failed");
      setSubmitting(false);
    }
  };

  // ৪. ওটিপি রিসেন্ড হ্যান্ডলার
  const handleResend = async () => {
    setResendMessage("");
    setError("");

    if (!authData?.value) {
      setError("Missing email or phone for OTP resend.");
      return;
    }

    setResendLoading(true);

    const payload = authData.type === "phone" ? {phone: authData.value} : {email: authData.value};

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to resend OTP");
      } else {
        setResendMessage("OTP resent successfully.");
      }
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (!isMounted || !authData || loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading session...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-card p-8 shadow-lg">
        <h1 className="text-2xl font-semibold">OTP Verification</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          We sent a verification code to <strong>{maskedIdentifier}</strong>. Enter the code to continue.
        </p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label htmlFor="otp-code" className="mb-1 block text-sm font-medium">
              Verification Code
            </label>
            <input
              id="otp-code"
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500 dark:bg-zinc-900 dark:border-zinc-700"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {resendMessage ? <p className="text-sm text-green-600">{resendMessage}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-all"
          >
            {submitting ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <button type="button" onClick={handleResend} disabled={resendLoading} className="text-indigo-600 hover:underline disabled:opacity-60">
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
          <Link href="/login" className="text-gray-500 hover:underline">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  );
}
