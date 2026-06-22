"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAppSelector} from "@/store/hooks";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {user, loading} = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!loading && (!user?.email && !user?.phone)) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return <>{children}</>;
}
