"use client";

import Link from "next/link";
import {useAppSelector} from "@/store/hooks";
import {ThemeChanger} from "@/components/theme/ThemeChanger";
import {useState} from "react";
import {Gift, User, Hourglass} from "lucide-react";

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
                {isAuthenticated && !initialized ? (
                  <Link href="/dashboard" className="text-xs font-medium cursor-pointer underline">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/login" className="text-xs hover:underline hover:text-chart-1">
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
    </>
  );
}
