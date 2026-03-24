"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useAppDispatch} from "@/store/hooks";
import {fetchUser} from "@/store/slices/authSlice";

export default function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const type = searchParams.get("type") === "phone" ? "phone" : "email";
  const identifier = searchParams.get("identifier") ?? "";

  const maskedIdentifier = useMemo(() => {
    if (!identifier) return type === "phone" ? "your phone number" : "your email address";
    if (type === "phone") {
      const visible = identifier.slice(-4);
      return `••••••${visible}`;
    }
    const [name, domain = ""] = identifier.split("@");
    if (!name || !domain) return identifier;
    const safeName = `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}`;
    return `${safeName}@${domain}`;
  }, [identifier, type]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{4,8}$/.test(otp)) {
      setError("Enter a valid OTP code.");
      return;
    }

    setSubmitting(true);
    const payload = type === "phone" ? {phone: identifier, otp} : {email: identifier, otp};
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
      await dispatch(fetchUser()).unwrap();
      setSubmitting(false);
      router.push("/dashboard");
    } catch {
      setError("OTP verification failed");
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendMessage("");
    setError("");
    if (!identifier) {
      setError("Missing email or phone for OTP resend.");
      return;
    }
    setResendLoading(true);
    try {
      const payload = type === "phone" ? {phone: identifier} : {email: identifier};
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-900">OTP Verification</h1>
        <p className="mt-2 text-sm text-gray-600">We sent a verification code to {maskedIdentifier}. Enter the code to continue.</p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label htmlFor="otp-code" className="mb-1 block text-sm font-medium text-gray-700">
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {resendMessage ? <p className="text-sm text-green-600">{resendMessage}</p> : null}

          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
            {submitting ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <button type="button" onClick={handleResend} disabled={resendLoading} className="text-indigo-600 hover:underline disabled:opacity-60">
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 hover:underline">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  );
}
