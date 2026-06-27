"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {fetchUser} from "@/store/slices/auth/api";
import {UserRole} from "@/store/slices/auth/interface";
import {roleBaseDashboards} from "@/proxy";
import {toast} from "sonner";

export default function OtpVerificationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {user, loading} = useAppSelector((state) => state.auth);
  const [authData, setAuthData] = useState<{type: "email" | "phone"; value: string} | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedPayload = sessionStorage.getItem("otp_auth_payload");

    if ((user && user?.isValidated) || !savedPayload) {
      router.replace("/");
      return;
    }

    if (savedPayload) {
      try {
        setAuthData(JSON.parse(savedPayload));
      } catch (e) {
        router.replace("/");
      }
    }
  }, [user, router]);

  const maskedIdentifier = useMemo(() => {
    if (!authData?.value) return "your verification target";

    const identifier = authData.value;

    if (authData.type === "phone") {
      const visible = identifier.slice(-4);
      return `••••••${visible}`;
    }

    const [name, domain = ""] = identifier.split("@");
    if (!name || !domain) return identifier;
    const safeName = `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}`;
    return `${safeName}@${domain}`;
  }, [authData]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!authData?.value) {
      toast.error("Session expired. Please try registering again.");
      return;
    }

    if (!/^\d{4,8}$/.test(otp)) {
      setError("Enter a valid OTP code.");
      return;
    }

    setSubmitting(true);
    const payload = authData.type === "phone" ? {phone: authData.value, otp} : {email: authData.value, otp};

    toast.promise(
      async () => {
        const res = await fetch("http://localhost:5003/api/v1/auth/verify-otp", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || data?.error || "OTP verification failed");
        }

        sessionStorage.removeItem("otp_auth_payload");

        return data;
      },
      {
        loading: "Verifying OTP code...",
        success: () => {
          setSubmitting(false);
          const path = roleBaseDashboards[user?.role as UserRole] || "/dashboard";

          // সম্পূর্ণ পেজ ফ্রেশ স্টেটসহ রিলোড করার জন্য window.location.href ব্যবহার করাই বেস্ট
          // window.location.href = path;
          return "Verification Successful!";
        },
        error: (err: any) => {
          setSubmitting(false);
          setError(err?.message || "OTP verification failed");
          return err?.message || "OTP verification failed";
        },
      },
    );
  };

  // ৩. ওটিপি রিসেন্ড হ্যান্ডলার (Sonner toast.promise সহ)
  const handleResend = async () => {
    setError("");

    if (!authData?.value) {
      toast.error("Missing email or phone for OTP resend.");
      return;
    }

    setResendLoading(true);
    const payload = authData.type === "phone" ? {phone: authData.value} : {email: authData.value};

    toast.promise(
      async () => {
        const res = await fetch("/api/auth/resend-otp", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to resend OTP");
        }
        return data;
      },
      {
        loading: "Resending OTP code...",
        success: () => {
          setResendLoading(false);
          return "OTP resent successfully.";
        },
        error: (err: any) => {
          setResendLoading(false);
          setError(err?.message || "Failed to resend OTP");
          return err?.message || "Failed to resend OTP";
        },
      },
    );
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
