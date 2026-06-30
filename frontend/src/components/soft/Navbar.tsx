"use client";

import Link from "next/link";
import {useAppSelector} from "@/store/hooks";
import {ThemeChanger} from "@/components/theme/ThemeChanger";
import {useState} from "react";
import {Gift, User, Hourglass, ShoppingCartIcon, SearchIcon, MenuIcon} from "lucide-react";
import {UserRole} from "@/store/slices/auth/interface";
import {roleBaseDashboards} from "@/proxy";
import {MobileSidebar} from "../MobileSidebar";

export default function Navbar() {
  const {user, loading} = useAppSelector((s) => s.auth);
  const [query, setQuery] = useState("");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  let findLink = roleBaseDashboards[user?.role as UserRole];

  if (user && !user.isValidated && user.role !== UserRole.CUSTOMER) {
    findLink = "/send-otp";
  }

  return (
    <>
      {/* Top bar */}
      <header className="hidden bg-[var(--navbar-background)] xl:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 xl:px-0 px-3 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-500">Star Tech</span>
          </Link>

          {/* Search box */}
          <div className="relative hidden max-w-xl flex-1 md:block">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 px-3 rounded-md text-foreground outline-none"
            />
          </div>

          <nav className="hidden items-center gap-5 xl:flex text-white">
            <ThemeChanger />

            <span className="flex items-center gap-3">
              <Gift size={20} className="text-chart-1" />
              <Link href="/offers">
                <span className="flex flex-col gap-0 cursor-pointer">
                  <strong className="text-sm">Offers</strong>
                  <p className="text-xs">Latest Offers</p>
                </span>
              </Link>
            </span>

            <span className="flex items-center gap-3">
              <Hourglass size={20} className="text-chart-1" />
              <Link href="/specials">
                <span className="flex flex-col gap-0 cursor-pointer">
                  <strong className="text-sm">Happy Hour</strong>
                  <p className="text-xs">Special Deals</p>
                </span>
              </Link>
            </span>

            <span className="flex items-center gap-3">
              <User size={20} className="text-chart-1" />
              <span className="flex flex-col gap-0">
                <strong className="text-sm">Account</strong>

                {(user?.email || user?.phone) && !loading ? (
                  <Link href={`${findLink}`} className="text-xs font-medium cursor-pointer hover:underline">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/auth" className="text-xs hover:underline hover:text-chart-1">
                    Login
                  </Link>
                )}
              </span>
            </span>

            <Link href="/pc-builder" type="button" className="flex items-center gap-1 text-sm font-medium px-3 py-2 bg-chart-2 rounded-sm cursor-pointer">
              <strong>PC Builder</strong>
            </Link>
          </nav>

          <div className="xl:hidden">
            <ThemeChanger />
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-50 border-b border-border bg-[var(--navbar-background)] xl:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2">
          <button
            type="button"
            aria-label="Open category menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/90 hover:bg-white/10"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <MenuIcon className="size-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-500">Star Tech</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/90 hover:bg-white/10"
              onClick={() => setShowMobileSearch((prev) => !prev)}
            >
              <SearchIcon className="size-5" />
            </button>
            <Link href="/cart" aria-label="Cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-white/90 hover:bg-white/10">
              <ShoppingCartIcon className="size-5" />
              <span className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                0
              </span>
            </Link>
          </div>
        </div>

        <div className="z-40 shadow-sm shadow-gray-300 dark:shadow-gray-800 xl:sticky xl:top-0">
          <MobileSidebar mobileSidebarOpen={mobileSidebarOpen} onMobileSidebarOpenChange={setMobileSidebarOpen} />
        </div>
      </div>
    </>
  );
}
