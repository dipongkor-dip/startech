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

const services = ["Home", "Chat", "Users", "Products", "Orders", "Deliveries", "Payments"];

const serviceNav: Record<string, {title: string; url: string; items: {title: string; url: string; isActive?: boolean}[]}[]> = {
  Home: [
    {
      title: "Home Overview",
      url: "#",
      items: [
        {title: "Dashboard", url: "#", isActive: true},
        {title: "Activity", url: "#"},
        {title: "Announcements", url: "#"},
      ],
    },
    {
      title: "Getting Started",
      url: "#",
      items: [
        {title: "Installation", url: "#"},
        {title: "Project Structure", url: "#"},
      ],
    },
  ],
  Chat: [
    {
      title: "Conversations",
      url: "#",
      items: [
        {title: "Recent Messages", url: "#", isActive: true},
        {title: "Channels", url: "#"},
        {title: "Groups", url: "#"},
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {title: "Notifications", url: "#"},
        {title: "Privacy", url: "#"},
      ],
    },
  ],
  Users: [
    {
      title: "User Management",
      url: "#",
      items: [
        {title: "All Users", url: "#", isActive: true},
        {title: "Roles", url: "#"},
        {title: "Permissions", url: "#"},
      ],
    },
    {
      title: "Profiles",
      url: "#",
      items: [
        {title: "Active", url: "#"},
        {title: "Invited", url: "#"},
      ],
    },
  ],
  Products: [
    {
      title: "Catalog",
      url: "#",
      items: [
        {title: "Products", url: "#", isActive: true},
        {title: "Categories", url: "#"},
        {title: "Inventory", url: "#"},
      ],
    },
    {
      title: "Pricing",
      url: "#",
      items: [
        {title: "Discounts", url: "#"},
        {title: "Offers", url: "#"},
      ],
    },
  ],
  Orders: [
    {
      title: "Orders",
      url: "#",
      items: [
        {title: "All Orders", url: "#", isActive: true},
        {title: "Pending", url: "#"},
        {title: "Completed", url: "#"},
      ],
    },
    {
      title: "Returns",
      url: "#",
      items: [
        {title: "Open Returns", url: "#"},
        {title: "Refunds", url: "#"},
      ],
    },
  ],
  Deliveries: [
    {
      title: "Shipments",
      url: "#",
      items: [
        {title: "Scheduled", url: "#", isActive: true},
        {title: "In Transit", url: "#"},
        {title: "Delivered", url: "#"},
      ],
    },
    {
      title: "Routes",
      url: "#",
      items: [
        {title: "Route Planner", url: "#"},
        {title: "Drivers", url: "#"},
      ],
    },
  ],
  Payments: [
    {
      title: "Billing",
      url: "#",
      items: [
        {title: "Invoices", url: "#", isActive: true},
        {title: "Transactions", url: "#"},
        {title: "Payouts", url: "#"},
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {title: "Payment Methods", url: "#"},
        {title: "Tax Settings", url: "#"},
      ],
    },
  ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const [selectedService, setSelectedService] = React.useState(services[0]);
  const navMain = serviceNav[selectedService] ?? serviceNav.Home;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher services={services} selectedService={selectedService} onServiceChange={setSelectedService} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {navMain.map((item) => (
          <Collapsible key={item.title} title={item.title} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                render={<CollapsibleTrigger />}
              >
                {item.title} <ChevronRightIcon className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton isActive={item.isActive} render={<a href={item.url} />}>
                          {item.title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
