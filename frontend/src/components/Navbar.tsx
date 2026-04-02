"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useAppSelector} from "@/store/hooks";
import {CategoryMegaMenu} from "@/components/CategoryMegaMenu";
import {ThemeChanger} from "@/components/theme/ThemeChanger";
import {useState} from "react";
import {Gift, Cpu, MenuIcon, SearchIcon, ShoppingCartIcon} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const {isAuthenticated, initialized} = useAppSelector((s) => s.auth);
  const [query, setQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (pathname?.startsWith("/dashboard")) {
    return null;
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
              className="w-full py-2 px-3 rounded-md bg-background text-foreground outline-none"
            />
          </div>

          <nav className="hidden items-center gap-5 xl:flex">
            <ThemeChanger />

            <Link href="/offers" className="flex items-center gap-1 text-sm font-medium text-white cursor-pointer">
              <Gift className="md:h-auto md:w-auto h-4 w-4 text-chart-1" />
              <span>Offers</span>
            </Link>

            <Link href="/pc-builder" className="flex items-center gap-1 text-sm font-medium text-white cursor-pointer">
              <Cpu className="md:h-auto md:w-auto h-4 w-4 text-chart-1" />
              <span>PC Builder</span>
            </Link>

            {isAuthenticated && !initialized ? (
              <Link href="/dashboard" className="text-sm font-medium text-white cursor-pointer">
                Account
              </Link>
            ) : (
              <Link href="/login" className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                Login
              </Link>
            )}
          </nav>

          <div className="xl:hidden">
            <ThemeChanger />
          </div>
        </div>
      </header>

      {/* Mobile merged sticky navbar */}
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

        {showMobileSearch ? (
          <div className="border-t border-white/10 px-3 pb-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-md bg-background px-3 text-sm text-foreground outline-none"
            />
          </div>
        ) : null}
      </div>

      {/* Sticky CategoryMegaMenu */}
      <div className="z-40 shadow-sm shadow-gray-300 dark:shadow-gray-800 xl:sticky xl:top-0">
        <CategoryMegaMenu mobileSidebarOpen={mobileSidebarOpen} onMobileSidebarOpenChange={setMobileSidebarOpen} />
      </div>
    </>
  );
}
