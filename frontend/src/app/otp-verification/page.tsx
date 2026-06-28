"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {sendOtp, verifyOtp} from "@/store/slices/auth/api";
import {toast} from "sonner";
import {roleBaseDashboards} from "@/proxy";
import {UserRole} from "@/store/slices/auth/interface";

export default function OtpVerificationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const {user, loading} = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (user && user?.isValidated) {
        router.replace("/");
        return;
      }
      // যদি রিফ্রেশ বা অন্য কারণে রেডক্স স্টেট থেকে ইউজার উধাও হয়ে যায়, লগইনে পাঠান
      if (!user) {
        router.replace("/auth");
      }
    }
  }, [user, loading, router]);

  // 🎯 ৩. sessionStorage ছাড়াই ডাইনামিক মাস্কিং লজিক
  const maskedIdentifier = useMemo(() => {
    if (!user) return "your verification target";

    // ইউজারের ইমেইল থাকলে ইমেইল, না থাকলে ফোন ব্যবহার হবে
    if (user.email) {
      const [name, domain = ""] = user.email.split("@");
      if (!name || !domain) return user.email;
      const safeName = `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}`;
      return `${safeName}@${domain}`;
    }

    if (user.phone) {
      const visible = user.phone.slice(-4);
      return `••••••${visible}`;
    }

    return "your contact method";
  }, [user]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) return;

    if (!/^\d{4,8}$/.test(otp)) {
      setError("Enter a valid OTP code.");
      return;
    }

    setSubmitting(true);

    // 🎯 ৪. ডাইনামিক পেলোড সরাসরি user অবজেক্ট থেকে জেনারেট হচ্ছে
    const payload = user.email ? {email: user.email, phone: undefined, otp} : {phone: user.phone as string, email: undefined, otp};

    toast.promise(
      async () => {
        // .unwrap() ব্যবহারের ফলে এরর থাকলে অটোমেটিক ক্যাচ হবে
        const data = await dispatch(verifyOtp(payload)).unwrap();
        return data;
      },
      {
        loading: "Verifying OTP code...",
        success: (data) => {
          setSubmitting(false);
          let findLink = roleBaseDashboards[user?.role as UserRole];
          router.push(findLink);
          return data?.message || "Verification Successful!";
        },
        error: (err: any) => {
          setSubmitting(false);
          const errMsg = typeof err === "string" ? err : err?.message || "OTP verification failed";
          setError(errMsg);
          return errMsg;
        },
      },
    );
  };

  // 🎯 ৫. ওটিপি রিসেন্ড হ্যান্ডলার
  const handleResend = async () => {
    setError("");

    if (!user) {
      toast.error("Missing user session for OTP resend.");
      return;
    }

    setResendLoading(true);

    const payload = user.email ? {email: user.email, phone: undefined} : {email: undefined, phone: user.phone as string};

    toast.promise(
      async () => {
        // এখানেও আপনি চাইলে রিজেকশন ক্যাচ করার জন্য .unwrap() ব্যবহার করতে পারেন
        return await dispatch(sendOtp(payload)).unwrap();
      },
      {
        loading: "Resending OTP code...",
        success: () => {
          setResendLoading(false);
          return "OTP resent successfully.";
        },
        error: (err: any) => {
          setResendLoading(false);
          const errMsg = typeof err === "string" ? err : err?.message || "Failed to resend OTP";
          setError(errMsg);
          return errMsg;
        },
      },
    );
  };

  // মাউন্ট হওয়ার আগে অথবা ইউজার স্টেট লোড হওয়ার সময় ব্ল্যাঙ্ক স্ক্রিন আটকানো
  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading session...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-card p-8 shadow-lg border border-gray-100 dark:border-zinc-800">
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
