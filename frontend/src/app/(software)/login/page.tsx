"use server";
import LoginForm from "@/components/auth/LoginPage";
import {Suspense} from "react";

export default async function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
        <LoginForm/>
      </Suspense>
    </main>
  );
}
