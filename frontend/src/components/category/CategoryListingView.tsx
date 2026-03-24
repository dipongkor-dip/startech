"use client";

import * as React from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {HomeIcon} from "lucide-react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import {PaginationFilter} from "@/components/pagination/PaginationFilter";
import type {CategoryListingResolved, MockProduct} from "@/lib/category-listing";
import {getMockProducts} from "@/lib/category-listing";
import {CategoryFilters} from "@/components/category/CategoryFilters";
import {CategoryProductCard} from "@/components/category/CategoryProductCard";

export function CategoryListingView({listing, products = getMockProducts()}: {listing: CategoryListingResolved; products?: MockProduct[]}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageSize, setPageSize] = React.useState<string>(searchParams.get("limit") || "12");
  const [sortBy, setSortBy] = React.useState<string>(searchParams.get("sortBy") || "default");
  const [currentPage, setCurrentPage] = React.useState<number>(parseInt(searchParams.get("page") || "1"));

  const totalItems = products.length;
  const limit = Math.max(1, Number(pageSize));
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const handlePageChange = (page: number) => {
    const normalizedPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(normalizedPage);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("limit", pageSize);
    newSearchParams.set("sortBy", sortBy);
    newSearchParams.set("page", normalizedPage.toString());
    router.push(`${listing.path}?${newSearchParams.toString()}`);
  };

  const hasCategoryPills = listing.pills.length > 0;
  const crumbs = listing.breadcrumbs;
  const showMainCategoryHeader = crumbs.length <= 2;

  return (
    <div className="flex flex-1 flex-col">
      {/** NavBar Categories */}
      <div className="bg-background">
        <div className="mx-auto max-w-7xl py-5">
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((c, i) => (
                <React.Fragment key={`${c.href}-${i}`}>
                  {i > 0 ? <BreadcrumbSeparator /> : null}
                  <BreadcrumbItem>
                    {i === 0 ? (
                      <BreadcrumbLink render={<Link href={c.href} className="inline-flex items-center gap-1" aria-label={c.label} />}>
                        <HomeIcon className="size-4" />
                        <span className="sr-only">{c.label}</span>
                      </BreadcrumbLink>
                    ) : i < crumbs.length - 1 ? (
                      <BreadcrumbLink render={<Link href={c.href} />}>{c.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{c.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/** existing categories */}
      <div className="mx-auto w-full max-w-7xl flex-1">
        {showMainCategoryHeader ? (
          <header className="mb-6 max-w-3xl">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{listing.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
          </header>
        ) : null}

        {hasCategoryPills ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {listing.pills.map((pill) => {
              const active = pill.href === listing.path;
              return (
                <Link
                  key={pill.href}
                  href={pill.href}
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/40" : "border-border bg-background hover:bg-muted",
                  )}
                >
                  {pill.label}
                </Link>
              );
            })}
          </div>
        ) : null}

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/** category filters */}
          <CategoryFilters currentPath={listing.path} />

          <div className="min-w-0 flex-1 space-y-4">
            {/** Products header */}
            <div className="flex flex-col gap-3 rounded border border-border bg-card px-4 py-3 shadow-sm shadow-sidebar-border sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold text-foreground">{listing.sectionLabel}</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show</span>
                  <Select
                    value={pageSize}
                    onValueChange={(v) => {
                      if (v) {
                        setPageSize(v);
                        setCurrentPage(1);
                        const newSearchParams = new URLSearchParams(searchParams.toString());
                        newSearchParams.set("limit", v);
                        newSearchParams.set("sortBy", sortBy);
                        newSearchParams.set("page", "1");
                        router.push(`${listing.path}?${newSearchParams.toString()}`);
                      }
                    }}
                  >
                    <SelectTrigger size="sm" className="min-w-[5rem] border-none bg-background rounded-none ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-none bg-card">
                      <SelectItem value="12" className="hover:bg-blue-600 hover:text-white">
                        12
                      </SelectItem>
                      <SelectItem value="24" className="hover:bg-blue-600 hover:text-white">
                        24
                      </SelectItem>
                      <SelectItem value="36" className="hover:bg-blue-600 hover:text-white">
                        36
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort By</span>
                  <Select
                    value={sortBy}
                    onValueChange={(v) => {
                      if (v) {
                        setSortBy(v);
                        setCurrentPage(1);
                        const newSearchParams = new URLSearchParams(searchParams.toString());
                        newSearchParams.set("limit", pageSize);
                        newSearchParams.set("sortBy", v);
                        newSearchParams.set("page", "1");
                        router.push(`${listing.path}?${newSearchParams.toString()}`);
                      }
                    }}
                  >
                    <SelectTrigger size="sm" className="min-w-[10rem] border-none bg-background ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="default" className="hover:bg-blue-600 hover:text-white">
                        Default
                      </SelectItem>
                      <SelectItem value="asc" className="hover:bg-blue-600 hover:text-white">
                        Price (Low &gt; High)
                      </SelectItem>
                      <SelectItem value="desc" className="hover:bg-blue-600 hover:text-white">
                        Price (High &lt; Low)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/** Products */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.length === 0 ? (
                <div className="col-span-full py-16 text-center text-sm text-muted-foreground">Sorry! No Product Found</div>
              ) : (
                products.map((p) => <CategoryProductCard key={p.id} product={p} />)
              )}
            </div>

            {/** Pagination */}
            {products.length > 0 && (
              <PaginationFilter
                currentPage={currentPage}
                pageSize={limit}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                className="mt-1"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
