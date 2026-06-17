"use client";

import * as React from "react";
import type {Category} from "@/store/slices/product/interface";
import Product from "./Product";
import {ProductsFilters} from "../pagination/ProductsFilters";
import {PaginationFilter} from "@/components/pagination/PaginationFilter";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {fetchCategories, fetchProducts} from "@/store/slices/product/api";
import ProductsPath from "./ProductsPath";
import ProductsHeader from "./ProductsHeader";

function findCategoryBySlug(categories: Category[], slug?: string | null): Category | null {
  if (!slug) return null;

  for (const category of categories) {
    if (category.slug === slug) return category;
    const childMatch = findCategoryBySlug(category.child ?? [], slug);
    if (childMatch) return childMatch;
  }

  return null;
}

function buildParentChain(categories: Category[], slug: string | null): Category[] {
  if (!slug) return [];

  for (const category of categories) {
    if (category.slug === slug) return [category];
    const childMatch = buildParentChain(category.child ?? [], slug);
    if (childMatch.length > 0) return [category, ...childMatch];
  }

  return [];
}

export default function RootProductsPages({slug, query}: {slug: string | null; query: any}) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.products.categories);
  const {products, loading, error} = useAppSelector((state) => state.products);
  const categoriesLoading = useAppSelector((state) => state.products.categoriesLoading);
  const categoriesError = useAppSelector((state) => state.products.categoriesError);
  const [matchedCategory, setMatchedCategory] = React.useState<Category | null>(null);
  const [parentChain, setParentChain] = React.useState<Category[]>([]);

  const normalizedQuery = React.useMemo(() => {
    const result: Record<string, string> = {};
    if (slug) result.slug = slug;

    if (query && typeof query === "object") {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          result[key] = value.join(",");
        } else {
          result[key] = String(value);
        }
      });
    }

    return result;
  }, [query, slug]);

  React.useEffect(() => {
    if (!categories.length && !categoriesLoading && !categoriesError) {
      dispatch(fetchCategories());
    }
  }, [categories.length, categoriesLoading, categoriesError, dispatch]);

  React.useEffect(() => {
    console.log("slug", slug);
    if (slug && categories.length) {
      setMatchedCategory(findCategoryBySlug(categories, slug));
      setParentChain(buildParentChain(categories, slug));
    }
  }, [slug, categories]);

  React.useEffect(() => {
    console.log("query", query);
    dispatch(fetchProducts(normalizedQuery));
  }, [normalizedQuery, dispatch, query]);

  console.log(products);

  const childCategories = matchedCategory?.child ?? [];

  const metaData = {limit: 16, page: 1, total: 20};

  return (
    <>
      <ProductsPath parentChain={parentChain} childCategories={childCategories} category={matchedCategory}></ProductsPath>

      <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/** category filters */}
        <ProductsFilters />

        <div className="min-w-0 flex-1 space-y-4">
          {/** Products header */}
          <ProductsHeader categoryName={matchedCategory?.name || "Products"}></ProductsHeader>

          {/** Products */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-h-[calc(100vh-26rem)]">
            {loading && <div className="col-span-full py-16 text-center text-sm text-muted-foreground">Loading products...</div>}

            {!loading && error && <div className="col-span-full py-16 text-center text-sm text-destructive">{error}</div>}

            {!loading && !error && products.length === 0 && (
              <div className="col-span-full py-16 text-center text-sm text-muted-foreground space-y-4">
                <strong>Sorry! No Product Found</strong>
                <p>Please try searching for something else</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && products.map((product) => <Product key={product.id} product={product} />)}
          </div>

          {/** Pagination */}
          <PaginationFilter page={metaData.page} limit={Number(metaData.limit || 16)} total={metaData.total} className="mt-1" />
        </div>
      </div>
    </>
  );
}
