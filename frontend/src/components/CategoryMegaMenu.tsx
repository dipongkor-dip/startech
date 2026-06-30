"use client";

import * as React from "react";
import Link from "next/link";
import {ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@base-ui/react";
import {useRouter} from "next/navigation";
import {NavCategory} from "@/app/(software)/(products)/layout";
import {useAppSelector} from "@/store/hooks";

function SubFlyout({
  categories,
  parentLabel,
  isOpen,
  onLinkClick,
  direction = "right",
}: {
  categories: NavCategory[];
  parentLabel: string;
  isOpen: boolean;
  onLinkClick: () => void;
  direction?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "absolute top-0 z-50 min-w-[10rem] shadow-sm transition-all duration-150 bg-background",
        direction === "right" ? "left-full" : "right-full",
        isOpen ? "visible opacity-100" : "invisible opacity-0",
        "border bg-popover py-1 text-popover-foreground",
      )}
      role="menu"
      aria-label={`${parentLabel} subcategories`}
    >
      {categories.map((s) => (
        <Link key={s.slug} href={`/${s.slug}`} onClick={onLinkClick} className="block px-3 py-1 text-sm transition-colors hover:bg-chart-1 hover:text-white">
          {s.name}
        </Link>
      ))}
    </div>
  );
}

export function CategoryMegaMenu() {
  const router = useRouter();

  const {categories} = useAppSelector((s) => s.categories);

  const [openCategory, setOpenCategory] = React.useState<string | null>(null);
  const [openSubPath, setOpenSubPath] = React.useState<string[]>([]);

  const setPath = (category: string) => {
    router.push(`/${category}`);
  };

  const handleHoverSub = React.useCallback((depth: number, id: string) => {
    setOpenSubPath((prev) => [...prev.slice(0, depth), id]);
  }, []);

  const handleCloseSubPath = React.useCallback((depth: number) => {
    setOpenSubPath((prev) => prev.slice(0, depth));
  }, []);

  const handleCloseAll = React.useCallback(() => {
    setOpenCategory(null);
    setOpenSubPath([]);
  }, []);

  return (
    <nav aria-label="categories" className="bg-card">
      <div className="mx-auto max-w-7xl">
        <ul className="hidden flex-wrap child-center xl:flex">
          {categories.map((category) => (
            <li key={category.name} className="relative py-2" onMouseEnter={() => setOpenCategory(category.name)} onMouseLeave={handleCloseAll}>
              <Button
                onClick={() => {
                  setOpenCategory(category.name);

                  setPath(category.slug);
                  handleCloseAll();
                }}
                className="inline-flex child-center pr-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-chart-1 group-hover/cat:text-chart-1"
              >
                {category.name}
              </Button>

              {/* pt-2 = hover bridge between trigger and panel */}
              <div
                className={cn(
                  "absolute left-0 top-full z-40 min-w-[14rem] transition-opacity duration-150 border border-t-2 border-t-chart-1",
                  openCategory === category.name ? "visible opacity-100" : "invisible opacity-0",
                )}
              >
                <div className="border shadow-lg">
                  {category.child ? (
                    <div
                      className="relative bg-popover"
                      style={{
                        display: "grid",
                        gridAutoFlow: "column",
                        gridTemplateRows: "repeat(20, minmax(0, auto))",
                        gridAutoColumns: "15rem",
                        gap: "0.125rem",
                      }}
                    >
                      {category.child.map((item) =>
                        item.child && item.child.length > 0 ? (
                          <div key={item.slug} className="relative w-full" onMouseEnter={() => handleHoverSub(0, item.slug)} onMouseLeave={() => handleCloseSubPath(0)}>
                            <Link
                              href={`/${item.slug}`}
                              onClick={handleCloseAll}
                              className="flex child-center justify-between gap-2 px-2 py-1 text-sm text-foreground transition-colors hover:bg-chart-1 hover:text-white w-full"
                            >
                              <span>{item.name}</span>
                              <ChevronRightIcon className="size-4 shrink-0 opacity-70 text-chart-1" aria-hidden />
                            </Link>
                            <SubFlyout categories={item.child} parentLabel={item.name} isOpen={openSubPath[0] === item.slug} onLinkClick={handleCloseAll} />
                          </div>
                        ) : (
                          <Link
                            key={item.slug}
                            href={`/${item.slug}`}
                            onClick={handleCloseAll}
                            className="block px-2 py-1 text-sm text-foreground transition-colors hover:bg-chart-1 hover:text-white w-full"
                          >
                            {item.name}
                          </Link>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
