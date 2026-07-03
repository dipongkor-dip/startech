"use client";

import {AppSidebar} from "@/components/app-sidebar";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {useAppSelector} from "@/store/hooks";
import {UserRole} from "@/store/slices/auth/interface";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Page({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {user, loading} = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user && !user.isValidated) {
      router.replace("/send-otp");
    } else if (
      user &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.SUPER_ADMIN &&
      user.role !== UserRole.CUSTOMER_SUPPORT_MANAGER &&
      user.role !== UserRole.PRODUCT_MANAGER
    ) {
      router.replace("/unauthorized");
    }
  }, [router, user]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
}
