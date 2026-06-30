"use client";

import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import {Laptop, MessageSquare, Wrench, ArrowRight, SquareArrowOutUpRight} from "lucide-react";

const services = [
  {
    id: 2,
    title: "Raise a Complain",
    description: "Submit and track your complaints",
    icon: MessageSquare,
    href: "/complain",
    color: "bg-red-500",
  },
  {
    id: 4,
    title: "Servicing Center",
    description: "Visit our service center for repairs",
    icon: Wrench,
    href: "/service",
    color: "bg-red-500",
  },
];

export function ServicesShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Link href="/laptop-finder">
        <Card className="group relative overflow-hidden bg-white dark:bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ring-0 ring-transparent">
          <CardContent className="relative">
            {/* Flex Row Layout */}
            <div className="flex items-center gap-4">
              {/* Small Icon */}
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 overflow-hidden aspect-square`}
              >
                <Laptop className="h-5 w-5 text-white flex-shrink-0" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Laptop Finder
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">Find the perfect laptop for your needs</p>

                {/* Arrow */}
                <div className="flex items-center text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium mr-2">Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </CardContent>
        </Card>
      </Link>

      <Link href="/apply-form">
        <Card className="group relative overflow-hidden bg-white dark:bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ring-0 ring-transparent">
          <CardContent className="relative">
            {/* Flex Row Layout */}
            <div className="flex items-center gap-4">
              {/* Small Icon */}
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 overflow-hidden aspect-square`}
              >
                <SquareArrowOutUpRight className="h-5 w-5 text-white flex-shrink-0" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Delivery Partner
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">Join as a Delivery partner</p>

                {/* Arrow */}
                <div className="flex items-center text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium mr-2">Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </CardContent>
        </Card>
      </Link>

      {services.map((service) => {
        const Icon = service.icon;
        return (
          <Link target="_blank" key={service.id} href={service.href}>
            <Card className="group relative overflow-hidden bg-white dark:bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ring-0 ring-transparent">
              <CardContent className="relative">
                {/* Flex Row Layout */}
                <div className="flex items-center gap-4">
                  {/* Small Icon */}
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${service.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0 overflow-hidden aspect-square`}
                  >
                    <Icon className="h-5 w-5 text-white flex-shrink-0" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{service.description}</p>

                    {/* Arrow */}
                    <div className="flex items-center text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium mr-2">Learn More</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
