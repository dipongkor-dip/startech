"use client";

import DashNav from "@/components/dashboard/header/DashNav";
import {useAppSelector} from "@/store/hooks";
import {UserRole} from "@/store/slices/auth/interface";
import {useRouter} from "next/navigation";
import React from "react";

const Layout = ({children}: {children: React.ReactNode}) => {
  const router = useRouter();
  const {user, loading} = useAppSelector((s) => s.auth);

  if (!loading && user && !user?.isValidated) {
    router.push("/send-otp");
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div>
      <DashNav role={user?.role as UserRole}></DashNav>
      {children}
    </div>
  );
};

export default Layout;
