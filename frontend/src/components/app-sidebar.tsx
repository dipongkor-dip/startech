"use client";

import * as React from "react";

import {SearchForm} from "@/components/search-form";
import {VersionSwitcher} from "@/components/services-switcher";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {ChevronRightIcon} from "lucide-react";
import Link from "next/link";
import {roleBaseDashboards} from "@/proxy";
import {UserRole} from "@/store/slices/auth/interface";
import {useAppSelector} from "@/store/hooks";

let services = ["Home", "Chat", "Users", "Products", "Orders", "Deliveries", "Payments", "Services"];

const serviceNav: Record<
  string,
  {title: string; url: string; permission: UserRole[]; items?: {title: string; url: string; isActive?: boolean; permission: UserRole[]}[]}[]
> = {
  Home: [
    {
      title: "Home Overview",
      url: "#",
      items: [
        {title: "Dashboard", url: "#", isActive: true, permission: [UserRole.ADMIN]},
        {title: "Activity", url: "#", permission: [UserRole.ADMIN]},
        {title: "Announcements", url: "#", permission: [UserRole.ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
    {title: "Categories", url: "/categories", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
    {
      title: "Getting Started",
      url: "#",
      items: [
        {title: "Installation", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Project Structure", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
  ],
  Chat: [
    {
      title: "Conversations",
      url: "#",
      items: [
        {title: "Recent Messages", url: "#", isActive: true, permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Channels", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Groups", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {title: "Notifications", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Privacy", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
  ],
  Users: [
    {
      title: "User Management",
      url: "#",
      items: [
        {title: "All Users", url: "#", isActive: true, permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Roles", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Permissions", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
    {
      title: "Profiles",
      url: "#",
      items: [
        {title: "Active", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Invited", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
  ],
  Products: [
    {
      title: "Catalog",
      url: "#",
      items: [
        {title: "Products", url: "#", isActive: true, permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Inventory", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
    {
      title: "Pricing",
      url: "#",
      items: [
        {title: "Discounts", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Offers", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
  ],
  Orders: [
    {
      title: "Orders",
      url: "#",
      items: [
        {title: "All Orders", url: "#", isActive: true, permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Pending", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Completed", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
    {
      title: "Returns",
      url: "#",
      items: [
        {title: "Open Returns", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Refunds", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
  ],
  Deliveries: [
    {
      title: "Shipments",
      url: "#",
      items: [
        {title: "Scheduled", url: "#", isActive: true, permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "In Transit", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Delivered", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
    {
      title: "Routes",
      url: "#",
      items: [
        {title: "Route Planner", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Drivers", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
  ],
  Payments: [
    {
      title: "Billing",
      url: "#",
      items: [
        {title: "Invoices", url: "/invoice", isActive: true, permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Transactions", url: "/transactions", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Payouts", url: "/payouts", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {title: "Payment Methods", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
        {title: "Tax Settings", url: "#", permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN]},
      ],
      permission: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    },
  ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const {user} = useAppSelector((state) => state.auth);
  const [selectedService, setSelectedService] = React.useState(services[0]);
  const navMain = serviceNav[selectedService] ?? serviceNav.Home;

  let path = roleBaseDashboards[user?.role as UserRole];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher services={services} selectedService={selectedService} onServiceChange={setSelectedService} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {navMain.map(
          (item) =>
            item.permission.includes(user?.role as UserRole) && (
              <Collapsible key={item.title} title={item.title} defaultOpen className="group/collapsible">
                <SidebarGroup>
                  <SidebarGroupLabel
                    className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    render={<CollapsibleTrigger />}
                  >
                    <Link href={`${path}/${item.url}`}>
                    {item.title}

                    </Link>
                    {item.items && item.items.length > 0 && (
                    <ChevronRightIcon className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
                    )}
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {item.items?.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton isActive={item.isActive} render={<Link href={`${path}/${item.url}`} />}>
                              {item.title}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ),
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
