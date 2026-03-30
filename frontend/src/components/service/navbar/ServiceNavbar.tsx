"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ServiceReqForm from "@/components/service/service-req-form/ServiceReqForm";
import { useState } from "react";

const serviceNavItems = [
  { name: "Build at Home", href: "/service/build-at-home" },
  { name: "Home Services", href: "/service/home-service" },
  { name: "Desktop Services", href: "/service/desktop-service" },
  { name: "Laptop Services", href: "/service/laptop-service" },
  { name: "Printer Services", href: "/service/printer-service" },
  { name: "Other Services", href: "/service/other-service" },
];

interface ServiceNavbarProps {
  onBookService: () => void;
}

export default function ServiceNavbar({ onBookService }: ServiceNavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Navigation Items */}
          <div className="hidden md:flex space-x-8">
            {serviceNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side - Book A Service Button */}
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onBookService}
          >
            Book A Service
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-wrap gap-2 py-2">
          {serviceNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}