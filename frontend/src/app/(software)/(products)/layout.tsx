"use client";

import React, {Suspense, useEffect, useState} from "react";
import Link from "next/link";
import {MenuIcon, SearchIcon, ShoppingCartIcon} from "lucide-react";
import {CategoryMegaMenu, CategoryMegaMenuSkeleton} from "@/components/CategoryMegaMenu";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {fetchCategories} from "@/store/slices/categories/api";

export interface NavCategory {
  slug: string;
  name: string;
  child?: NavCategory[];
}

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  const dispatch = useAppDispatch();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const categories: NavCategory[] = useAppSelector((state) => state.categories.categories) || [];
  const categoriesLoading = useAppSelector((state) => state.categories.loading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
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
        <Suspense fallback={<CategoryMegaMenuSkeleton />}>
          <CategoryMegaMenu
            categories={categories || []}
            loading={categoriesLoading}
            mobileSidebarOpen={mobileSidebarOpen}
            onMobileSidebarOpenChange={setMobileSidebarOpen}
          />
        </Suspense>
      </div>
      {children}
    </>
  );
}
