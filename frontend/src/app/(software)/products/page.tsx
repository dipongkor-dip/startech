"use client";

import * as React from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {HomeIcon} from "lucide-react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import type {CategoryListingResolved, MockProduct} from "@/lib/category-listing";
import {getMockProducts} from "@/lib/category-listing";
import {CategoryProductCard} from "@/components/category/CategoryProductCard";
import {DemoFilter} from "@/components/DemoFilters";
import {PaginationFilter} from "@/components/pagination/PaginationFilter";

export default function Products({products = getMockProducts()}: {listing?: CategoryListingResolved; products?: MockProduct[]}) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const [pageSize, setPageSize] = React.useState<string>(searchParams.get("limit") || "12");
  const [sortBy, setSortBy] = React.useState<string>(searchParams.get("sortBy") || "default");
  const [currentPage, setCurrentPage] = React.useState<number>(parseInt(searchParams.get("page") || "1"));

  const totalItems = 30;
  const limit = Math.max(1, Number(pageSize));
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  
  const sectionLabel = categoryId || "Products";

  const handlePageChange = (page: number) => {
    const normalizedPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(normalizedPage);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("limit", pageSize);
    newSearchParams.set("sortBy", sortBy);
    newSearchParams.set("page", normalizedPage.toString());
  };

  return (
    <>
      <div className="bg-white dark:bg-card mb-3 shadow-sm py-5">
        {/** NavBar Path */}
        <div className="mx-auto max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              {/* {crumbs.map((c, i) => ( */}
              {/* <React.Fragment key={`${c.href}-${i}`}> */}
              <React.Fragment>
                {/* {i > 0 ? <BreadcrumbSeparator /> : null} */}
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href={"/fasdf"} className="inline-flex items-center gap-1" aria-label={"asdf"} />}>
                    <HomeIcon className="size-4" />
                    Home
                    <span className="sr-only">asdf</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
              {/* ))} */}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-7xl mx-auto space-y-2">
          <header className="max-w-3xl pt-3">
            <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">title </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">listing description</p>
          </header>

          {/** existing categories */}

          <div className="flex flex-wrap gap-2 pt-4">
            <Link
              href={"/"}
              className={cn(
                "inline-flex rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/40",
              )}
            >
              asfasdfsadf
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/** category filters */}
        <DemoFilter />

        <div className="min-w-0 flex-1 space-y-4">
          {/** Products header */}
          <div className="flex flex-col gap-3 rounded border border-border bg-card px-4 py-3 shadow-sm shadow-sidebar-border sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-foreground">{sectionLabel}</h2>
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

          <PaginationFilter currentPage={currentPage} pageSize={limit} totalItems={totalItems} onPageChange={handlePageChange} className="mt-1" />
        </div>
      </div>
    </>
  );
}
