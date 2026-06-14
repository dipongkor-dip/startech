"use client";

import * as React from "react";
import {ChevronDownIcon, ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel} from "@/components/ui/sidebar";
import {Sheet, SheetContent} from "@/components/ui/sheet";
import {Button} from "@base-ui/react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

type NavCategory = {
  _id: string;
  name: string;
  child?: NavCategory[];
};

const NAV_CATEGORIES: NavCategory[] = [
  {
    _id: "desktopsdfg",
    name: "Desktop",
    child: [
      {_id: "desktop-offer", name: "Desktop Offer"},
      {
        _id: "star-pc",
        name: "Star PC",
        child: [
          {_id: "star-intel-pc", name: "Intel PC"},
          {_id: "star-ryzen-pc", name: "Ryzen PC"},
        ],
      },
      {
        _id: "gaming-pc",
        name: "Gaming PC",
        child: [
          {_id: "gaming-intel-pc", name: "Intel PC"},
          {_id: "gaming-ryzen-pc", name: "Ryzen PC"},
        ],
      },
      {
        _id: "brand-pc",
        name: "Brand PC",
        child: [
          {_id: "brand-acer", name: "Acer"},
          {_id: "brand-asus", name: "ASUS"},
          {_id: "brand-dell", name: "Dell"},
          {_id: "brand-hp", name: "HP"},
          {_id: "brand-lenovo", name: "Lenovo"},
          {_id: "brand-msi", name: "MSI"},
          {_id: "brand-gigabyte", name: "Gigabyte"},
        ],
      },
      {
        _id: "all-in-one-pc",
        name: "All-in-One PC",
        child: [
          {_id: "aio-hp", name: "HP"},
          {_id: "aio-dell", name: "Dell"},
          {_id: "aio-asus", name: "ASUS"},
        ],
      },
      {_id: "ai-pc", name: "AI PC"},
      {_id: "portable-mini-pc", name: "Portable Mini PC"},
      {
        _id: "apple-mac-mini",
        name: "Apple Mac Mini",
        child: [
          {_id: "mac-mini-m1", name: "M1"},
          {_id: "mac-mini-m2", name: "M2"},
          {_id: "mac-mini-m3", name: "M3"},
        ],
      },
      {_id: "apple-imac", name: "Apple iMac"},
      {_id: "apple-imac-studio", name: "Apple iMac Studio"},
      {_id: "apple-mac-pro", name: "Apple Mac Pro"},
      {_id: "show-all-desktop", name: "Show All Desktop"},
    ],
  },
];

function SubFlyout({
  items,
  parentLabel,
  depth,
  activePath,
  onHover,
  onCloseDepth,
  onSelect,
  onClose,
}: {
  items: NavCategory[];
  parentLabel: string;
  depth: number;
  activePath: string[];
  onHover: (depth: number, id: string) => void;
  onCloseDepth: (depth: number) => void;
  onSelect: (categoryId: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "absolute left-full top-0 z-50 min-w-[14rem] shadow-lg transition-all duration-150 rounded-sm",
        "border border-slate-200 bg-white py-1 text-slate-900",
      )}
      role="menu"
      aria-name={`${parentLabel} subcategories`}
    >
      {items.map((item, index) => {
        const hasChildren = item.child && item.child.length > 0;
        const isActive = activePath[depth] === item._id;

        return (
          <div
            key={`${item._id || item.name}-${depth}-${index}`}
            className={cn(hasChildren ? "relative" : undefined, "border-b border-slate-100 last:border-b-0")}
            onMouseEnter={() => {
              if (hasChildren) onHover(depth, item._id);
            }}
            onMouseLeave={() => {
              if (hasChildren) onCloseDepth(depth);
            }}
          >
            <Button
              onClick={() => {
                onSelect(item._id || item.name);
                onClose();
              }}
              className="flex w-full child-center justify-between gap-2 px-3 py-2 text-sm text-slate-900 transition-colors hover:bg-slate-100"
            >
              <span>{item.name}</span>
              {hasChildren ? <ChevronRightIcon className="size-4 shrink-0 opacity-70 text-slate-500" aria-hidden /> : null}
            </Button>
            {hasChildren && isActive ? (
              <SubFlyout
                items={item.child!}
                parentLabel={item.name}
                depth={depth + 1}
                activePath={activePath}
                onHover={onHover}
                onCloseDepth={onCloseDepth}
                onSelect={onSelect}
                onClose={onClose}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function renderMobileItems(items: NavCategory[], level: number, onSelect: (categoryId: string) => void, onClose: () => void) {
  return (
    <div className={cn(level === 0 ? "space-y-1" : "ml-4 space-y-1")}>
      {items.map((item, index) => (
        <div key={`${item._id || item.name}-${level}-${index}`}>
          <Button
            onClick={() => {
              onSelect(item._id);
              onClose();
            }}
            className={cn(
              "block w-full text-left px-2 py-1 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded",
              level === 0 ? "text-sm" : "text-xs",
            )}
          >
            {item.name}
          </Button>
          {item.child && item.child.length > 0 ? renderMobileItems(item.child, level + 1, onSelect, onClose) : null}
        </div>
      ))}
    </div>
  );
}

type CategoryMegaMenuProps = {
  mobileSidebarOpen?: boolean;
  onMobileSidebarOpenChange?: (open: boolean) => void;
};

export function DemoCategoryMegaMenu({mobileSidebarOpen: mobileSidebarOpenProp, onMobileSidebarOpenChange}: CategoryMegaMenuProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
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

  const setPath = (category_id: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("category_id", category_id);
    router.push(`${pathname}?${newSearchParams.toString()}`);
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
    <nav aria-name="Product categories" className="bg-card">
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[18rem] border-r bg-sidebar p-0 text-sidebar-foreground sm:max-w-none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sm font-semibold text-sidebar-foreground">Categories</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-0">
                  {NAV_CATEGORIES.map((category) => (
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
                                (id) => {
                                  setPath(id);
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
          {NAV_CATEGORIES.map((category) => (
            <li key={category.name} className="relative py-2" onMouseEnter={() => setOpenCategory(category.name)} onMouseLeave={handleCloseAll}>
              <Button
                onClick={() => {
                  setOpenCategory(category.name);

                  setPath(category._id);
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
                    <div className="relative">
                      <SubFlyout
                        items={category.child}
                        parentLabel={category.name}
                        depth={0}
                        activePath={openSubPath}
                        onHover={handleHoverSub}
                        onCloseDepth={handleCloseSubPath}
                        onSelect={setPath}
                        onClose={handleCloseAll}
                      />
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
