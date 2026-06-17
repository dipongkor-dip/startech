"use client";

import * as React from "react";

import type {Category, Product} from "@/store/slices/product/interface";
import {getMockProducts} from "@/lib/category-listing";
import {CategoryProductCard} from "@/components/category/CategoryProductCard";
import {ProductsFilters} from "@/components/ProductsFilters";
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

export default function CategoryListingView({slug, query}: {slug: string | null; query: any}) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.products.categories);
  const categoriesLoading = useAppSelector((state) => state.products.categoriesLoading);
  const categoriesError = useAppSelector((state) => state.products.categoriesError);
  const [matchedCategory, setMatchedCategory] = React.useState<Category | null>(null);
  const [parentChain, setParentChain] = React.useState<Category[]>([]);

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
    console.log("params", query);
  }, [query]);

  const childCategories = matchedCategory?.child ?? [];

  const products = getMockProducts();

  const metaData = {
    limit: 16,
    page: 1,
    total: 20,
  };

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.length === 0 && <div className="col-span-full py-16 text-center text-sm text-muted-foreground">Sorry! No Product Found</div>}

            {/* {products.length > 0 && products.map((p) => <CategoryProductCard key={p.id} product={products} />)} */}
          </div>

          {/** Pagination */}
          <PaginationFilter page={metaData.page} limit={Number(metaData.limit || 16)} total={metaData.total} className="mt-1" />
        </div>
      </div>
    </>
  );
}
