"use client";

import React from "react";
import Link from "next/link";
import {HomeIcon} from "lucide-react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {cn} from "@/lib/utils";

const ProductsPath = ({parentChain, childCategories , category}) => {
  return (
    <div className="bg-white dark:bg-card mb-3 shadow-sm py-5">
      {/** NavBar Path */}
      <div className="mx-auto max-w-7xl">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" className="inline-flex items-center gap-1" />}>
                <HomeIcon className="size-4" />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {parentChain.map((parent, i) => (
              <React.Fragment key={`${parent.slug}-${i}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {i === parentChain.length - 1 ? (
                    <BreadcrumbPage>{parent.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={`/${parent.slug}`} />}>{parent.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-7xl mx-auto space-y-2">
        <header className="max-w-3xl pt-3">
          <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">{category?.name || "Products"}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Browse all {category?.name || "products"} available in our store</p>
        </header>

        {/** exiting categories */}
        {childCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-4">
            {childCategories.map((child) => (
              <Link
                key={child.slug}
                href={`/${child.slug}`}
                className={cn("inline-flex rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent", "")}
              >
                {child.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductsPath;
