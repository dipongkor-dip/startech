"use client";

import * as React from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@base-ui/react";
import {useRouter} from "next/navigation";
import {useAppSelector} from "@/store/hooks";
import {selectFlatCategories} from "@/store/slices/categories/selectors";
import {getChildCategoriesByParentId} from "@/lib/category-utils";

export function CategoryMegaMenu() {
  const router = useRouter();
  const flatCategories = useAppSelector(selectFlatCategories);
  console.log("object", flatCategories);

  // Get only root categories (no parent)
  const rootCategories = React.useMemo(() => flatCategories.filter((cat) => !cat.parentId), [flatCategories]);

  const [openCategoryId, setOpenCategoryId] = React.useState<string | null>(null);

  // Get child categories for hovered category
  const hoveredChildCategories = React.useMemo(() => {
    if (!openCategoryId) return [];
    return getChildCategoriesByParentId(flatCategories, openCategoryId);
  }, [openCategoryId, flatCategories]);

  const handleCategoryClick = (slug: string) => {
    router.push(`/${slug}`);
    setOpenCategoryId(null);
  };

  return (
    <nav aria-label="categories" className="bg-card">
      <div className="mx-auto max-w-7xl">
        <ul className="hidden flex-wrap child-center xl:flex">
          {rootCategories.map((category) => (
            <li key={category.id} className="relative py-2" onMouseEnter={() => setOpenCategoryId(category.id)} onMouseLeave={() => setOpenCategoryId(null)}>
              <Button
                onClick={() => handleCategoryClick(category.slug)}
                className="inline-flex child-center pr-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-chart-1"
              >
                {category.name}
              </Button>

              {/* Dropdown Panel */}
              {hoveredChildCategories.length > 0 && openCategoryId === category.id && (
                <div
                  className={cn(
                    "absolute left-0 top-full z-40 min-w-[14rem] mt-0 transition-opacity duration-150 border border-t-2 border-t-chart-1 visible opacity-100",
                  )}
                >
                  <div className="border shadow-lg bg-popover">
                    <div
                      className="relative"
                      style={{
                        display: "grid",
                        gridAutoFlow: "column",
                        gridTemplateRows: "repeat(20, minmax(0, auto))",
                        gridAutoColumns: "15rem",
                        gap: "0.125rem",
                      }}
                    >
                      {hoveredChildCategories.map((child) => (
                        <Link
                          key={child.id}
                          href={`/${child.slug}`}
                          onClick={() => setOpenCategoryId(null)}
                          className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-chart-1 hover:text-white"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
