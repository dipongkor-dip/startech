"use client";

import * as React from "react";
import Link from "next/link";
import {ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {NAV_CATEGORIES} from "@/data/nav-categories";

function SubFlyout({
  sub,
  parentLabel,
  isOpen,
  onLinkClick,
}: {
  sub: NonNullable<(typeof NAV_CATEGORIES)[0]["items"][0]["sub"]>;
  parentLabel: string;
  isOpen: boolean;
  onLinkClick: () => void;
}) {
  return (
    <div
      className={cn(
        "absolute left-full top-0 z-50 min-w-[10rem] shadow-lg transition-all duration-150",
        isOpen ? "visible opacity-100" : "invisible opacity-0",
        "border bg-popover py-1 text-popover-foreground",
      )}
      role="menu"
      aria-label={`${parentLabel} subcategories`}
    >
      {sub.map((s) => (
        <Link key={s.href} href={s.href} onClick={onLinkClick} className="block px-3 py-1 text-sm transition-colors hover:bg-chart-1 hover:text-white">
          {s.label}
        </Link>
      ))}
    </div>
  );
}

export function CategoryMegaMenu() {
  const [openCategory, setOpenCategory] = React.useState<string | null>(null);
  const [openSub, setOpenSub] = React.useState<string | null>(null);

  const handleCloseAll = React.useCallback(() => {
    setOpenCategory(null);
    setOpenSub(null);
  }, []);

  return (
    <nav aria-label="Product categories" className="bg-card">
      <div className="mx-auto max-w-7xl">
        <ul className="flex flex-wrap items-center">
          {NAV_CATEGORIES.map((category) => (
            <li
              key={category.label}
              className="relative py-2"
              onMouseEnter={() => setOpenCategory(category.label)}
              onMouseLeave={handleCloseAll}
            >
              <Link
                href={category.href ?? "#"}
                onClick={handleCloseAll}
                className="inline-flex items-center pr-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-chart-1 group-hover/cat:text-chart-1"
              >
                {category.label}
              </Link>

              {/* pt-2 = hover bridge between trigger and panel */}
              <div
                className={cn(
                  "absolute left-0 top-full z-40 min-w-[14rem] transition-opacity duration-150 border border-t-2 border-t-chart-1",
                  openCategory === category.label ? "visible opacity-100" : "invisible opacity-0",
                )}
              >
                <div className="border border-border bg-popover shadow-lg">
                  {category.items.map((item) =>
                    item.sub && item.sub.length > 0 ? (
                      <div
                        key={item.label}
                        className="relative"
                        onMouseEnter={() => setOpenSub(item.label)}
                        onMouseLeave={() => setOpenSub(null)}
                      >
                        <Link
                          href={item.href}
                          onClick={handleCloseAll}
                          className="flex items-center justify-between gap-2 px-2 py-1 text-sm text-foreground transition-colors hover:bg-chart-1 hover:text-white"
                        >
                          <span>{item.label}</span>
                          <ChevronRightIcon className="size-4 shrink-0 opacity-70" aria-hidden />
                        </Link>
                        <SubFlyout sub={item.sub} parentLabel={item.label} isOpen={openSub === item.label} onLinkClick={handleCloseAll} />
                      </div>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleCloseAll}
                        className="block px-2 py-1 text-sm text-foreground transition-colors hover:bg-chart-1 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
