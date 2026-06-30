"use client";

import {useAppSelector} from "@/store/hooks";
import {useRouter} from "next/navigation";
import React from "react";

import {AppSidebar} from "@/components/app-sidebar";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col gap-4 p-4 border border-red-500">
        <div className="w-fit flex-col gap-4 p-4 border border-red-500">asdf asdfsdf</div>
        <div className="flex-1 flex-col gap-4 p-4 border border-red-500">asdf asdfsdf</div>
      </div>
      <SidebarInset className="flex-1">
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
