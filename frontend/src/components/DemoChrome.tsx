"use client";

import {usePathname} from "next/navigation";
import {RootFooter} from "@/components/footer/RootFooter";
import {DashboardFooter} from "@/components/footer/DashboardFooter";
import DemoNavbar from "./DemoNavbar";

export function DemoSiteChrome({children}: {children: React.ReactNode}) {
  const pathname = usePathname() || "/";
  const isDashboard = pathname.startsWith("/dashboard");
  const isPcBuilderPrint = pathname.startsWith("/pc-builder/print");

  return (
    <>
      {!isPcBuilderPrint ? <DemoNavbar /> : null}
      <main className="min-h-0 flex flex-1 flex-col">{children}</main>
      {!isPcBuilderPrint ? (isDashboard ? <DashboardFooter /> : <RootFooter />) : null}
    </>
  );
}
