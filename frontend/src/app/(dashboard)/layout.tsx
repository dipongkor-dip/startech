"use client";

import {useRouter} from "next/navigation";
import {useAppSelector} from "@/store/hooks";
import DashNav from "@/components/dashboard/header/DashNav";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {user, loading} = useAppSelector((s) => s.auth);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <>
      <DashNav role={user?.role as string}></DashNav>
      {children}
    </>
  );
}
