"use client";

import {useAppSelector} from "@/store/hooks";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

const SendOTP = () => {
  const router = useRouter();
  const {user, loading: authLoading} = useAppSelector((state) => state.auth);
  const [authData, setAuthData] = useState<{type: "email" | "phone"; value: string} | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedPayload = sessionStorage.getItem("otp_auth_payload");

    if (savedPayload) {
      try {
        const parsed = JSON.parse(savedPayload);
        if (parsed.type === "email" || parsed.type === "phone") {
          setAuthData(parsed);
        } else {
          // router.replace("/");
        }
      } catch (e) {
        // router.replace("/");
      }
    } else {
      // router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (user && user?.isValidated) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSendOTP = async () => {
    if (!authData?.value) {
      toast.error("No email or phone number found.");
      return;
    }

    // ব্যাকএন্ড এপিআই অনুযায়ী ডাইনামিক পেলোড তৈরি
    const payload = authData.type === "email" ? {email: authData.value, phone: undefined} : {email: undefined, phone: authData.value};

    // Sonner-এর প্রফেশনাল প্রমিজ টোস্ট মেকানিজম
    toast.promise(
      async () => {
        const res = await fetch("http://localhost:5003/api/v1/auth/send-otp", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || data?.error || "Failed to send OTP");
        }

        return data;
      },
      {
        loading: "Sending OTP code, please wait...",
        success: () => {
          router.push("/otp-verification");
          return `OTP sent successfully to ${authData.value}`;
        },
        error: (err: any) => err?.message || "Something went wrong. Try again.",
      },
    );
  };

  if (!isMounted || authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading session...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-card p-8 shadow-lg text-center border border-gray-100 dark:border-zinc-800">
        <h1 className="text-2xl font-bold mb-2">Verify Your Identity</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We need to send a one-time password (OTP) to secure your account.</p>

        {/* ডাইনামিকালি ইমেইল বা ফোন নম্বর কার্ডের মতো দেখাবে */}
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 mb-6 border border-gray-200 dark:border-zinc-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Selected {authData?.type}</span>
          <span className="text-lg font-medium text-zinc-800 dark:text-zinc-200 break-all">{authData?.value}</span>
        </div>

        <Button onClick={handleSendOTP} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all">
          Send OTP Verification Code
        </Button>

        <div className="mt-4">
          <button onClick={() => router.replace("/auth")} className="text-sm text-gray-500 hover:underline dark:text-gray-400">
            Change Email or Phone
          </button>
        </div>
      </section>
    </main>
  );
};

export default SendOTP;
