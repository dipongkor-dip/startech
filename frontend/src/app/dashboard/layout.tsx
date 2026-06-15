"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAppSelector} from "@/store/hooks";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {isAuthenticated, initialized, loading} = useAppSelector((s) => s.auth);
  useEffect(() => {
    if (!loading && !initialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router, loading]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
