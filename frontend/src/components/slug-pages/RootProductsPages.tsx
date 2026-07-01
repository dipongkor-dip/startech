"use client";

import * as React from "react";
import Product from "./Product";
import {ProductsFilters} from "../pagination/ProductsFilters";
import {PaginationFilter} from "@/components/pagination/PaginationFilter";
import ProductsHeader from "./ProductsHeader";
import ChildCategories from "./ChildCategories";
import {useGetProductsQuery} from "@/store/slices/products/api";
import {useAppSelector} from "@/store/hooks";
import {selectFlatCategories} from "@/store/slices/categories/selectors";
import {getChildCategoriesByParentId} from "@/lib/category-utils";

export default function RootProductsPages({slug, query}: {slug: string | null; query: any}) {
  const flatCategories = useAppSelector(selectFlatCategories);

  const normalizedQuery = React.useMemo(() => {
    const result: Record<string, string> = {};
    if (slug) result.slug = slug;

    if (query && typeof query === "object") {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        if (Array.isArray(value)) result[key] = value.join(",");
        else result[key] = String(value);
      });
    }

    return result;
  }, [query, slug]);
  const {data: products, isLoading: loading, error} = useGetProductsQuery(normalizedQuery);

  // Get matched category from flat array
  const matchedCategory = React.useMemo(() => {
    return slug ? flatCategories.find((cat) => cat.slug === slug) : null;
  }, [slug, flatCategories]);

  // Get all child categories by filtering with parentId === matchedCategory.id
  const childCategories = React.useMemo(() => {
    if (!matchedCategory) return [];
    return getChildCategoriesByParentId(flatCategories, matchedCategory.id);
  }, [matchedCategory, flatCategories]);

  // Build slug map for efficient dynamic slug resolution
  const childSlugMap = React.useMemo(() => {
    const map = new Map<string, string>();

    if (matchedCategory) {
      map.set(String(matchedCategory.id), matchedCategory.slug);
    }

    childCategories.forEach((child) => {
      if (child.id && child.slug) {
        map.set(String(child.id), child.slug);
      }
    });

    return map;
  }, [childCategories, matchedCategory]);

  const metaData = {limit: 16, page: 1, total: 20};

  return (
    <>
      {matchedCategory && (
        <ChildCategories
          category={{
            name: matchedCategory.name,
            description: matchedCategory.description || "",
          }}
          childCategories={childCategories}
        />
      )}

      <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 lg:flex-row lg:gap-8">
        <ProductsFilters />

        <div className="min-w-0 flex-1 space-y-4">
          <ProductsHeader categoryName={matchedCategory?.name || "Products"} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-h-[calc(100vh-26rem)]">
            {loading && <div className="col-span-full py-16 text-center text-sm text-muted-foreground">Loading products...</div>}

            {!loading && error && <div className="col-span-full py-16 text-center text-sm text-destructive">Error Loading products</div>}

            {!loading && !error && products?.length === 0 && (
              <div className="col-span-full py-16 text-center text-sm text-muted-foreground space-y-4">
                <strong>Sorry! No Product Found</strong>
                <p>Please try searching for something else</p>
              </div>
            )}

            {/* 🎯 ডাইনামিক স্লাগ পাসিং লুপ */}
            {!loading &&
              !error &&
              products?.map((product, i: number) => {
                // Resolve dynamic slug from child categories or fallback to parent slug
                const dynamicSlug = childSlugMap.get(String(product.categoryId)) || matchedCategory?.slug || "products";

                return <Product key={`${product.id}-${i}`} product={product} slug={dynamicSlug} />;
              })}
          </div>

          <PaginationFilter page={metaData.page} limit={Number(metaData.limit || 16)} total={metaData.total} className="mt-1" />
        </div>
      </div>
    </>
  );
}
