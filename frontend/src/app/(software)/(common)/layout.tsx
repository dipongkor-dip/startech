"use client";

import React, {useState} from "react";
import {usePathname, useRouter} from "next/navigation"; // 🎯 useRouter ইম্পোর্ট করা হয়েছে
import {Home, User, ShoppingBag, CreditCard, MessageSquare, Menu, LogOut} from "lucide-react"; // 🎯 LogOut আইকন যুক্ত করা হয়েছে
import {useAppSelector, useAppDispatch} from "@/store/hooks"; // 🎯 useAppDispatch ইম্পোর্ট করা হয়েছে
import {UserRole} from "@/store/slices/auth/interface";
import {Sidebar} from "@/components/dashboard/common/Sidebar";
import {logout} from "@/store/slices/auth/api";
import {toast} from "sonner"; // 🎯 sonner থেকে toast ইম্পোর্ট করুন

const Layout = ({children}: {children: React.ReactNode}) => {
  const pathname = usePathname();
  const router = useRouter(); // 🎯 রাউটার ইনিশিয়ালাইজ করা হয়েছে
  const dispatch = useAppDispatch(); // 🎯 ডিসপ্যাচ ইনিশিয়ালাইজ করা হয়েছে

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // লগআউট স্টেট ট্র্যাকিং

  const {user, loading} = useAppSelector((state) => state.auth);
  const userRole = user?.role as UserRole;

  // CUSTOMER sidebar items
  const menuItemsCustomer = [
    {name: "Home", path: "/dashboard", icon: <Home size={18} />},
    {name: "Profile", path: "/dashboard/profile", icon: <User size={18} />},
    {name: "Order Products", path: "/dashboard/orders", icon: <ShoppingBag size={18} />},
    {name: "Payments", path: "/dashboard/payments", icon: <CreditCard size={18} />},
    {name: "Messages & Media", path: "/dashboard/messages", icon: <MessageSquare size={18} />},
  ];

  // DELIVERY BOY sidebar items
  const menuItemsDelivery = [
    {name: "Home", path: "/delivery-boy/dashboard", icon: <Home size={18} />},
    {name: "Profile", path: "/delivery-boy/dashboard/profile", icon: <User size={18} />},
    {name: "Order Products", path: "/delivery-boy/dashboard/orders", icon: <ShoppingBag size={18} />},
    {name: "Payments", path: "/delivery-boy/dashboard/payments", icon: <CreditCard size={18} />},
    {name: "Messages & Media", path: "/delivery-boy/dashboard/messages", icon: <MessageSquare size={18} />},
  ];

  const currentMenuItems = userRole === UserRole.DELIVERY_BOY ? menuItemsDelivery : menuItemsCustomer;

  const getActiveSidebarName = () => {
    const currentItem = currentMenuItems.find((item) => item.path === pathname);
    if (currentItem) return currentItem.name;

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace("-", " ");
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const res = await dispatch(logout()).unwrap();

      // 🎯 সাকসেস টোস্ট
      toast.success(res.message, {
        description: "You have been securely logged out of your account.",
      });

      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);

      // 🎯 এরর টোস্ট
      toast.error("Logout Failed", {
        description: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 🎯 ফুটারের সাথে ১০০% ম্যাচ করার জন্য max-w-7xl, mx-auto */}
      <div className="max-w-7xl mx-auto flex min-h-screen gap-6 md:gap-5 my-3 px-4 sm:px-6 md:px-8 xl:px-0">
        {/* 🟢 ১. ডেস্কটপ সাইডবার */}
        <Sidebar menuItems={currentMenuItems} pathname={pathname} />

        {/* 📱 ২. মোবাইল সাইডবার */}
        {isOpen && <Sidebar menuItems={currentMenuItems} pathname={pathname} isMobile={true} onClose={() => setIsOpen(false)} />}

        {/* 🎯 ৩. মেইন কন্টেন্ট এরিয়া */}
        <div className="flex-1 flex flex-col min-w-0 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* 🔝 টপ হেডার */}
          <header className="flex items-center justify-between px-6 py-5 border-b border-border bg-background/50 backdrop-blur">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsOpen(true)} className="md:hidden text-muted-foreground hover:text-foreground">
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold tracking-tight">{getActiveSidebarName()}</h2>
            </div>

            {/* 🎯 ৪. প্রফেশনাল লগআউট বাটন */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-accent/50 text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <LogOut size={16} className={isLoggingOut ? "animate-spin" : ""} />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </header>

          {/* 📦 ৪. চাইল্ড পেজ কন্টেন্ট এরিয়া */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
