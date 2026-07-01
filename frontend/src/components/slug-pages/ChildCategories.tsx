"use client";

import Link from "next/link";
import {cn} from "@/lib/utils";
import {Category} from "@/store/slices/categories/interface";

const ChildCategories = ({category, childCategories}: {category: {name: string; description: string}; childCategories: Category[]}) => {
  return (
    <div className="bg-white dark:bg-card mb-3 shadow-sm pb-5">
      <div className="max-w-7xl mx-auto space-y-2">
        <header className="max-w-3xl pt-3">
          <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">{category?.name || "Products"}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Browse all {category?.name || "products"} available in our store</p>
        </header>

        {/* Child Categories Pills */}
        {childCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {childCategories.map((child) => (
              <Link
                key={child.id}
                href={`/${child.slug}`}
                className={cn("inline-flex rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent")}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildCategories;
