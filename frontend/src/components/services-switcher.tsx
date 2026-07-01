"use client";

import * as React from "react";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {GalleryVerticalEndIcon, ChevronsUpDownIcon, CheckIcon} from "lucide-react";

export function VersionSwitcher({
  services,
  selectedService,
  onServiceChange,
}: {
  services: string[]
  selectedService: string
  onServiceChange: (service: string) => void
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5 leading-none">
              <span className="font-medium">Service</span>
              <span className="truncate">{selectedService}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {services.map((service) => (
              <DropdownMenuItem key={service} onClick={() => onServiceChange(service)}>
                {service} {service === selectedService && <CheckIcon className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
