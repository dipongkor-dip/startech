"use client";

import Link from "next/link";
import {useAppSelector} from "@/store/hooks";
import {ThemeChanger} from "@/components/theme/ThemeChanger";
import {useState} from "react";
import {Gift, Cpu} from "lucide-react";

export default function Navbar() {
  const {isAuthenticated, initialized} = useAppSelector((s) => s.auth);
  const [query, setQuery] = useState("");

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
    </>
  );
}
