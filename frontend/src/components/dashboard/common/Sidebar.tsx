"use client";

import React from "react";
import Link from "next/link";
import {X} from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  menuItems: MenuItem[];
  pathname: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({menuItems, pathname, isMobile = false, onClose}: SidebarProps) => {
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-8 px-4 py-2">
        <h1 className="text-xl font-bold tracking-wide">StarTech</h1>
        {isMobile && onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={isMobile && onClose ? onClose : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex md:hidden bg-black/50 backdrop-blur-sm">
        <aside className="w-64 bg-card p-4 flex flex-col h-full border-r border-border">{sidebarContent}</aside>
      </div>
    );
  }

  return <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4">{sidebarContent}</aside>;
};
