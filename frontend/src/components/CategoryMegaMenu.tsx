"use client";

import * as React from "react";
import Link from "next/link";
import {ChevronDownIcon, ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel} from "@/components/ui/sidebar";
import {Sheet, SheetContent} from "@/components/ui/sheet";
import {Button} from "@base-ui/react";
import {useRouter} from "next/navigation";
import {NavCategory} from "@/app/(software)/(products)/layout";

function SubFlyout({categories, parentLabel, isOpen, onLinkClick}: {categories: NavCategory[]; parentLabel: string; isOpen: boolean; onLinkClick: () => void}) {
  return (
    <div
      className={cn(
        "absolute left-full top-0 z-50 min-w-[10rem] shadow-sm transition-all duration-150 bg-background",
        isOpen ? "visible opacity-100" : "invisible opacity-0",
        "border bg-popover py-1 text-popover-foreground",
      )}
      role="menu"
      aria-label={`${parentLabel} subcategories`}
    >
      {categories.map((s) => (
        <Link
          key={s.slug}
          href={`/${s.slug}`}
          onClick={onLinkClick}
          className="block px-3 py-1 text-sm transition-colors hover:bg-chart-1 hover:text-white"
        >
          {s.name}
        </Link>
      ))}
    </div>
  );
}

function renderMobileItems(categories: NavCategory[], level: number, onSelect: (categoryId: string) => void, onClose: () => void) {
  return (
    <div className={cn(level === 0 ? "space-y-1" : "ml-4 space-y-1")}>
      {categories.map((item, index) => (
        <div key={`${item.slug || item.name}-${level}-${index}`}>
          <Link
            href={`/${item.slug}`}
            onClick={() => {
              onSelect(item.slug);
              onClose();
            }}
            className={cn(
              "block w-full text-left px-2 py-1 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded",
              level === 0 ? "text-sm" : "text-xs",
            )}
          >
            {item.name}
          </Link>
          {item.child && item.child.length > 0 ? renderMobileItems(item.child, level + 1, onSelect, onClose) : null}
        </div>
      ))}
    </div>
  );
}

interface CategoryMegaMenuProps {
  categories: NavCategory[];
  mobileSidebarOpen?: boolean;
  onMobileSidebarOpenChange?: (open: boolean) => void;
}

export function CategoryMegaMenu({categories, mobileSidebarOpen: mobileSidebarOpenProp, onMobileSidebarOpenChange}: CategoryMegaMenuProps) {
  const router = useRouter();
  const [openCategory, setOpenCategory] = React.useState<string | null>(null);
  const [openSubPath, setOpenSubPath] = React.useState<string[]>([]);
  const [openMobileCategory, setOpenMobileCategory] = React.useState<string | null>(null);
  const [mobileSidebarOpenState, setMobileSidebarOpenState] = React.useState(false);
  const mobileSidebarOpen = mobileSidebarOpenProp ?? mobileSidebarOpenState;
  const setMobileSidebarOpen = React.useCallback(
    (open: boolean) => {
      onMobileSidebarOpenChange?.(open);
      if (mobileSidebarOpenProp === undefined) {
        setMobileSidebarOpenState(open);
      }
    },
    [onMobileSidebarOpenChange, mobileSidebarOpenProp],
  );

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
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[18rem] border-r bg-sidebar p-0 text-sidebar-foreground sm:max-w-none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sm font-semibold text-sidebar-foreground">Categories</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-0">
                  {categories.map((category) => (
                    <div key={category.name} className="border-b border-sidebar-border last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setOpenMobileCategory((prev) => (prev === category.name ? null : category.name))}
                        className="flex w-full child-center justify-between gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      >
                        <span>{category.name}</span>
                        <ChevronDownIcon className={cn("size-4 transition-transform", openMobileCategory === category.name ? "rotate-180" : "")} />
                      </button>
                      {openMobileCategory === category.name ? (
                        <div className="ml-4 space-y-1">
                          {category.child
                            ? renderMobileItems(
                                category.child,
                                0,
                                (slug) => {
                                  setPath(slug);
                                  setMobileSidebarOpen(false);
                                },
                                () => setMobileSidebarOpen(false),
                              )
                            : null}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </SheetContent>
      </Sheet>
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
                    <div className="relative bg-popover">
                      {category.child.map((item) =>
                        item.child && item.child.length > 0 ? (
                          <div key={item.slug} className="relative" onMouseEnter={() => handleHoverSub(0, item.slug)} onMouseLeave={() => handleCloseSubPath(0)}>
                            <Link
                              href={`/${item.slug}`}
                              onClick={handleCloseAll}
                              className="flex child-center justify-between gap-2 px-2 py-1 text-sm text-foreground transition-colors hover:bg-chart-1 hover:text-white"
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
                            className="block px-2 py-1 text-sm text-foreground transition-colors hover:bg-chart-1 hover:text-white"
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
