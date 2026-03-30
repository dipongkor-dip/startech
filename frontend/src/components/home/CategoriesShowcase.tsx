"use client";

import Link from "next/link";
import { Monitor, Laptop, Cpu, Smartphone, Tablet, Zap, Package, HardDrive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NAV_CATEGORIES } from "@/data/nav-categories";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Desktop": Monitor,
  "Laptop": Laptop,
  "Component": Cpu,
  "Phone": Smartphone,
  "Tab": Tablet,
  "Power": Zap,
  "Monitor": Monitor,
  "Storage": HardDrive,
};

export function CategoriesShowcase() {
  const mainCategories = NAV_CATEGORIES.slice(0, 8); // Show first 8 categories

  return (
    <>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainCategories.map((category) => {
            const Icon = categoryIcons[category.label] || Package;
            return (
              <Link key={category.label} href={category.href || "#"}>
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-background to-muted hover:from-card hover:to-card border-border shadow-md">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.label}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
    </>
  );
}
