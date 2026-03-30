"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ServiceNavbar from "@/components/service/navbar/ServiceNavbar";
import ServiceReqForm from "@/components/service/service-req-form/ServiceReqForm";

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  
  // Generate breadcrumb path
  const generateBreadcrumb = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumb = [
      { name: "Home", href: "/" },
      ...pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join('/');
        const name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return { name, href };
      })
    ];
    return breadcrumb;
  };

  const breadcrumb = generateBreadcrumb();

  return (
    <div className="min-h-screen">
      {/* Service Navigation */}
      <ServiceNavbar onBookService={() => setIsServiceFormOpen(true)} />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumb.map((item, index) => (
                <li key={item.href} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                  <Link
                    href={item.href}
                    className={`${
                      index === breadcrumb.length - 1
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Service Request Form Modal */}
      <ServiceReqForm 
        isOpen={isServiceFormOpen} 
        onClose={() => setIsServiceFormOpen(false)} 
      />
    </div>
  );
}