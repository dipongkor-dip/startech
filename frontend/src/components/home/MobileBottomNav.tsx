"use client";

import Link from "next/link";
import {Gift, Hourglass, Laptop, ArrowLeftRight, User} from "lucide-react";
import {useAppSelector} from "@/store/hooks";
import {roleBaseDashboards} from "@/proxy";
import {UserRole} from "@/store/slices/auth/interface";

export default function MobileBottomNav() {
  const {user, loading} = useAppSelector((s) => s.auth);

  let findLink = user ? roleBaseDashboards[user.role as UserRole] : "/auth";

  if (user && !user.isValidated && user.role !== UserRole.CUSTOMER) {
    findLink = "/send-otp";
  }

  const navItems = [
    {label: "Offers", icon: Gift, href: "/offers"},
    {label: "Special Deal", icon: Hourglass, href: "/specials"},
    {label: "PC Builder", icon: Laptop, href: "/pc-builder", highlight: true}, // স্পেশাল হাইলাইট যদি চান
    {label: "Compare (0)", icon: ArrowLeftRight, href: "/compare"},
    {label: "Account", icon: User, href: `${findLink}`},
  ];

  return (
    // xl স্ক্রিনের উপর গেলে এটি hidden থাকবে, এর নিচে স্ক্রিনের একদম নিচে ফিক্সড থাকবে
    <div className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-slate-950 border-t border-slate-800 text-slate-400 xl:hidden shadow-lg">
      <div className="grid h-full max-w-4xl grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-1 hover:text-orange-500 text-slate-300 transition-colors group"
            >
              <Icon size={20} className="mb-1 text-slate-400 group-hover:text-orange-500 transition-colors" />
              <span className="text-[10px] sm:text-xs tracking-tight whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
