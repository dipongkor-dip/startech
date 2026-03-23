"use client";

import Link from "next/link";
import {ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {NAV_CATEGORIES} from "@/data/nav-categories";

function SubFlyout({sub, parentLabel}: {sub: NonNullable<(typeof NAV_CATEGORIES)[0]["items"][0]["sub"]>; parentLabel: string}) {
  return (
    <div
      className={cn(
        "invisible absolute left-full top-0 z-50 min-w-[10rem] opacity-0 shadow-lg transition-all duration-150",
        "group-hover/sub:visible group-hover/sub:opacity-100",
        "border bg-popover py-1 text-popover-foreground",
      )}
      role="menu"
      aria-label={`${parentLabel} subcategories`}
    >
      {sub.map((s) => (
        <Link key={s.href} href={s.href} className="block px-3 py-1 text-sm transition-colors hover:bg-orange-500 hover:text-white">
          {s.label}
        </Link>
      ))}
    </div>
  );
}

export function CategoryMegaMenu() {
  return (
    <nav aria-label="Product categories" className="bg-background">
      <div className="mx-auto max-w-7xl">
        <ul className="flex flex-wrap items-center">
          {NAV_CATEGORIES.map((category) => (
            <li key={category.label} className="group/cat relative py-2">
              <Link
                href={category.href ?? "#"}
                className="inline-flex items-center pr-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-orange-500 group-hover/cat:text-orange-500"
              >
                {category.label}
              </Link>

              {/* pt-2 = hover bridge between trigger and panel */}
              <div
                className={cn(
                  "invisible absolute left-0 top-full z-40 min-w-[14rem] opacity-0 transition-opacity duration-150",
                  "group-hover/cat:visible group-hover/cat:opacity-100",
                  "group-focus-within/cat:visible group-focus-within/cat:opacity-100 border border-t-2 border-t-orange-500",
                )}
              >
                <div className="border border-border bg-popover shadow-lg">
                  {category.items.map((item) =>
                    item.sub && item.sub.length > 0 ? (
                      <div key={item.label} className="group/sub relative">
                        <Link
                          href={item.href}
                          className="flex items-center justify-between gap-2 px-2 py-1 text-sm text-foreground transition-colors hover:bg-orange-500 hover:text-white"
                        >
                          <span>{item.label}</span>
                          <ChevronRightIcon className="size-4 shrink-0 opacity-70" aria-hidden />
                        </Link>
                        <SubFlyout sub={item.sub} parentLabel={item.label} />
                      </div>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-2 py-1 text-sm text-foreground transition-colors hover:bg-orange-500 hover:text-white"
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
