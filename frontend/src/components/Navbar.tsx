"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useAppSelector} from "@/store/hooks";
import {CategoryMegaMenu} from "@/components/CategoryMegaMenu";
import {ThemeChanger} from "@/components/theme/ThemeChanger";
import {useState} from "react";
import {Gift, Cpu} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const {user, isAuthenticated} = useAppSelector((s) => s.auth);
  const [query, setQuery] = useState("");

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      {/* Top bar */}
      <header className="bg-[var(--navbar-background)]">
        <div className="max-w-7xl mx-auto py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-500">Star Tech</span>
          </Link>

          {/* Search box */}
          <div className="flex-1 max-w-xl relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 px-3 rounded-md bg-background text-foreground outline-none"
            />
          </div>

          <nav className="flex items-center md:gap-10">
            <ThemeChanger />

            <Link href="/offers" className="flex items-center gap-1 text-sm font-medium text-white cursor-pointer">
              <Gift className="md:h-auto md:w-auto h-4 w-4 text-chart-1" />
              <span>Offers</span>
            </Link>

            <Link href="/pc-builder" className="flex items-center gap-1 text-sm font-medium text-white cursor-pointer">
              <Cpu className="md:h-auto md:w-auto h-4 w-4 text-chart-1" />
              <span>PC Builder</span>
            </Link>

            {isAuthenticated && user ? (
              <Link href="/dashboard" className="text-sm font-medium text-white cursor-pointer">
                {user.profile?.name || user.email || "Account"}
              </Link>
            ) : (
              <Link href="/login" className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Sticky CategoryMegaMenu */}
      <div className="sticky top-0 z-40 shadow-md">
        <CategoryMegaMenu />
      </div>
    </>
  );
}
