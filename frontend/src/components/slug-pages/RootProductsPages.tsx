"use client";

import * as React from "react";

import Product from "./Product";
import {ProductsFilters} from "../pagination/ProductsFilters";
import {PaginationFilter} from "@/components/pagination/PaginationFilter";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import ProductsHeader from "./ProductsHeader";
import ChildCategories from "./ChildCategories";
import {fetchProducts} from "@/store/slices/products/api";
import {Category} from "@/store/slices/categories/interface";

function findCategoryBySlug(categories: Category[], slug?: string | null): Category | null {
  if (!slug) return null;

  for (const category of categories) {
    if (category.slug === slug) return category;
    const childMatch = findCategoryBySlug(category.child ?? [], slug);
    if (childMatch) return childMatch;
  }

  return null;
}

export default function RootProductsPages({slug, query}: {slug: string | null; query: any}) {
  const dispatch = useAppDispatch();
  const {categories, loading: load, error: cateError} = useAppSelector((state) => state.categories);
  const {products, loading, error} = useAppSelector((state) => state.products);
  const [matchedCategory, setMatchedCategory] = React.useState<Category | null>(null);

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
    if (slug && categories.length) {
      setMatchedCategory(findCategoryBySlug(categories, slug));
    }
  }, [slug, categories]);

  React.useEffect(() => {
    dispatch(fetchProducts(normalizedQuery));
  }, [normalizedQuery, dispatch, query, matchedCategory?.id]);

  const childCategories = matchedCategory?.child ?? [];

  // 🎯 নতুন যুক্ত (Optimization): চাইল্ড ক্যাটাগরিগুলোর ID এবং Slug এর একটি ম্যাপ তৈরি করা
  // এর ফলে লুপের ভেতরে বারবার .find() চালাতে হবে না, পারফরম্যান্স সুপার ফাস্ট থাকবে।
  const childSlugMap = React.useMemo(() => {
    const map = new Map<string, string>();

    // সেফটি চেক: কারেন্ট প্যারেন্ট ক্যাটাগরির নিজস্ব স্লাগও ব্যাকআপ হিসেবে ম্যাপে রাখছি
    if (matchedCategory) {
      map.set(String(matchedCategory.id), matchedCategory.slug);
    }

    // সকল চাইল্ড ক্যাটাগরি ম্যাপে পুশ করা হচ্ছে
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
      <ChildCategories category={matchedCategory as Category} childCategories={childCategories as any} />

      <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 lg:flex-row lg:gap-8">
        <ProductsFilters />

        <div className="min-w-0 flex-1 space-y-4">
          <ProductsHeader categoryName={matchedCategory?.name || "Products"}></ProductsHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-h-[calc(100vh-26rem)]">
            {loading && <div className="col-span-full py-16 text-center text-sm text-muted-foreground">Loading products...</div>}

            {!loading && error && <div className="col-span-full py-16 text-center text-sm text-destructive">{error}</div>}

            {!loading && !error && products.length === 0 && (
              <div className="col-span-full py-16 text-center text-sm text-muted-foreground space-y-4">
                <strong>Sorry! No Product Found</strong>
                <p>Please try searching for something else</p>
              </div>
            )}

            {/* 🎯 ডাইনামিক স্লাগ পাসিং লুপ */}
            {!loading &&
              !error &&
              products.length > 0 &&
              products.map((product, i: number) => {
                // প্রোডাক্টের category (id অথবা slug reference) দিয়ে ম্যাপ থেকে ডাইনামিক স্লাগ নেওয়া হচ্ছে,
                // না পাওয়া গেলে প্যারেন্টের মেইন স্লাগ ফলব্যাক হবে
                const dynamicSlug = childSlugMap.get(String(product.categoryId)) || matchedCategory?.slug || "products";

                return (
                  <Product
                    key={i}
                    product={product}
                    slug={dynamicSlug} // 🎯 এখানে ডাইনামিক স্লাগ চলে গেল
                  />
                );
              })}
          </div>

          <PaginationFilter page={metaData.page} limit={Number(metaData.limit || 16)} total={metaData.total} className="mt-1" />
        </div>
      </div>
    </>
  );
}
