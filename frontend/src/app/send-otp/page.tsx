"use client";

import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {sendOtp} from "@/store/slices/auth/api";

const SendOTP = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {user, loading} = useAppSelector((state) => state.auth);

  // 🟢 হাইড্রেশন এরর আটকানোর জন্য মাউন্টেড স্টেট
  const [isMounted, setIsMounted] = useState(false);

  // কম্পোনেন্ট ব্রাউজারে লোড হলে এটি ট্রু (true) হবে
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user && user.isValidated) {
      router.replace("/");
    }
  }, [user, router, isMounted]);

  const handleSendOTP = async () => {
    if (!user) return;

    const payload = user.email ? {email: user.email, phone: undefined} : {email: undefined, phone: user?.phone as string};

    toast.promise(
      async () => {
        const data = await dispatch(sendOtp(payload)).unwrap();
        return data;
      },
      {
        loading: "Sending OTP code, please wait...",
        success: () => {
          router.push("/otp-verification");
          return `OTP sent successfully to ${user?.email || user?.phone}`;
        },
        error: (err: any) => err?.message || "Something went wrong. Try again.",
      },
    );
  };

  // 🟢 লোডিং বা মাউন্ট হওয়ার আগের স্টেট হ্যান্ডেল করা
  if (loading || !isMounted) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading session...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-card p-8 shadow-lg text-center border border-gray-100 dark:border-zinc-800">
        <h1 className="text-2xl font-bold mb-2">Verify Your Identity</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We need to send a one-time password (OTP) to secure your account.</p>

        {/* 🎯 এখন এটি সুরক্ষিত, কারণ ক্লায়েন্টে আসার পরেই কেবল এটি রেন্ডার হবে */}
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 mb-6 border border-gray-200 dark:border-zinc-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Selected {user?.email ? "email" : "phone"}</span>
          <span className="text-lg font-medium text-zinc-800 dark:text-zinc-200 break-all">{user?.phone || user?.email || "No contact found"}</span>
        </div>

        <Button onClick={handleSendOTP} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all">
          Send OTP Verification Code
        </Button>

        <div className="mt-4">
          <button onClick={() => router.push("/")} className="text-sm text-gray-500 hover:underline dark:text-gray-400">
            Skip this time
          </button>
        </div>
      </section>
    </main>
  );
};

export default SendOTP;
