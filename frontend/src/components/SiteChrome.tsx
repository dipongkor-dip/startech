"use client";

import {usePathname} from "next/navigation";
import Navbar from "@/components/Navbar";
import {RootFooter} from "@/components/footer/RootFooter";
import {DashboardFooter} from "@/components/footer/DashboardFooter";

export function SiteChrome({children}: {children: React.ReactNode}) {
  const pathname = usePathname() || "/";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <Navbar />
      <main className="min-h-0 flex flex-1 flex-col">{children}</main>
      {isDashboard ? <DashboardFooter /> : <RootFooter />}
    </>
  );
}
