"use client";

import * as React from "react";

import {useAppSelector} from "@/store/hooks";
import {NavDocuments} from "@/components/nav-documents";
import {NavMain} from "@/components/nav-main";
import {NavSecondary} from "@/components/nav-secondary";
import {NavUser} from "@/components/nav-user";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  PackageIcon,
  TruckIcon,
  HeadsetIcon,
  ClipboardListIcon,
  UsersIcon,
  ShieldCheckIcon,
  BoxesIcon,
  BarChart3Icon,
  CalendarClockIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  CommandIcon,
} from "lucide-react";

type SidebarData = {
  navMain: {title: string; url: string; icon: React.ReactNode}[];
  navSecondary: {title: string; url: string; icon: React.ReactNode}[];
  documents: {name: string; url: string; icon: React.ReactNode}[];
};

const BASE_SECONDARY: SidebarData["navSecondary"] = [
  {title: "Settings", url: "/dashboard/settings", icon: <Settings2Icon />},
  {title: "Get Help", url: "/dashboard/help", icon: <CircleHelpIcon />},
  {title: "Search", url: "/dashboard/search", icon: <SearchIcon />},
];

const ROLE_NAV: Record<string, SidebarData> = {
  superadmin: {
    navMain: [
      {title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon />},
      {title: "Admins", url: "/dashboard/admins", icon: <ShieldCheckIcon />},
      {title: "Users", url: "/dashboard/users", icon: <UsersIcon />},
      {title: "Reports", url: "/dashboard/reports", icon: <BarChart3Icon />},
    ],
    documents: [{name: "System Logs", url: "/dashboard/system-logs", icon: <ClipboardListIcon />}],
    navSecondary: BASE_SECONDARY,
  },
  admin: {
    navMain: [
      {title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon />},
      {title: "Products", url: "/dashboard/products", icon: <PackageIcon />},
      {title: "Orders", url: "/dashboard/orders", icon: <ClipboardListIcon />},
      {title: "Delivery", url: "/dashboard/delivery", icon: <TruckIcon />},
    ],
    documents: [{name: "Sales Reports", url: "/dashboard/reports", icon: <BarChart3Icon />}],
    navSecondary: BASE_SECONDARY,
  },
  productManager: {
    navMain: [
      {title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon />},
      {title: "Products", url: "/dashboard/products", icon: <BoxesIcon />},
      {title: "Inventory", url: "/dashboard/inventory", icon: <PackageIcon />},
      {title: "Reports", url: "/dashboard/reports", icon: <BarChart3Icon />},
    ],
    documents: [{name: "Catalog", url: "/dashboard/catalog", icon: <ClipboardListIcon />}],
    navSecondary: BASE_SECONDARY,
  },
  deliveryBoy: {
    navMain: [
      {title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon />},
      {title: "Assigned Orders", url: "/dashboard/orders/assigned", icon: <ClipboardListIcon />},
      {title: "Delivery Route", url: "/dashboard/delivery/route", icon: <TruckIcon />},
      {title: "Schedule", url: "/dashboard/delivery/schedule", icon: <CalendarClockIcon />},
    ],
    documents: [{name: "Delivery Notes", url: "/dashboard/delivery/notes", icon: <ClipboardListIcon />}],
    navSecondary: BASE_SECONDARY,
  },
  customerSupportManager: {
    navMain: [
      {title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon />},
      {title: "Support Tickets", url: "/dashboard/support/tickets", icon: <HeadsetIcon />},
      {title: "Customers", url: "/dashboard/customers", icon: <UsersIcon />},
      {title: "Order Issues", url: "/dashboard/support/orders", icon: <ClipboardListIcon />},
    ],
    documents: [{name: "Help Center", url: "/dashboard/help-center", icon: <ClipboardListIcon />}],
    navSecondary: BASE_SECONDARY,
  },
  customer: {
    navMain: [
      {title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon />},
      {title: "My Orders", url: "/dashboard/my-orders", icon: <ClipboardListIcon />},
      {title: "Track Delivery", url: "/dashboard/track-delivery", icon: <TruckIcon />},
    ],
    documents: [{name: "Saved Items", url: "/dashboard/saved-items", icon: <PackageIcon />}],
    navSecondary: BASE_SECONDARY,
  },
};
export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const authUser = useAppSelector((s) => s.auth.user);
  const role = authUser?.role || "customer";
  const data = ROLE_NAV[role] ?? ROLE_NAV.customer;
  const sidebarUser = {
    name: authUser?.profile?.name || authUser?.email || authUser?.phone || "User",
    email: authUser?.email || authUser?.phone || "",
    avatar: authUser?.profile?.avatar || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!" render={<a href="#" />}>
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Acme Inc.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
