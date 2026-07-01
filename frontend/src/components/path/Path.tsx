"use client";

import React from "react";
import ProductsPath from "./ProductsPath";
import {useAppSelector} from "@/store/hooks";
import {Category} from "@/store/slices/categories/interface";

function buildParentChain(categories: Category[], slug: string | null): Category[] {
  if (!slug) return [];

  for (const category of categories) {
    if (category.slug === slug) return [category];
    const childMatch = buildParentChain(category.child ?? [], slug);
    if (childMatch.length > 0) return [category, ...childMatch];
  }

  return [];
}

const Path = ({slug}: {slug: string}) => {
  const [parentChain, setParentChain] = React.useState<Category[]>([]);
  const {categories, loading} = useAppSelector((state) => state.categories);

  // ১. স্ল্যাশ দিয়ে স্প্লিট করে প্যারেন্ট এবং চাইল্ড সেগমেন্ট আলাদা করা
  const {rootSlug, subSlug} = React.useMemo(() => {
    if (!slug) return {rootSlug: "", subSlug: null};
    const parts = slug.split("/");
    return {
      rootSlug: parts[0], // "samsung"
      subSlug: parts[1] || null, // "galaxy-s24-ultra" (যদি থাকে)
    };
  }, [slug]);

  React.useEffect(() => {
    if (rootSlug && categories.length) {
      // Generate parent chain for root slug
      const baseChain = buildParentChain(categories, rootSlug);

      // If URL has sub-slug, add it as a custom category
      if (subSlug && baseChain.length > 0) {
        // Format sub-slug to readable name: "galaxy-s24-ultra" -> "Galaxy S24 Ultra"
        const formattedName = subSlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const customChildNode = {
          id: subSlug,
          name: formattedName,
          slug: `${rootSlug}/${subSlug}`,
          child: [],
          description: "",
          isActive: true,
          autoNumber: 0,
        } as Category;

        setParentChain([...baseChain, customChildNode]);
      } else {
        setParentChain(baseChain);
      }
    }
  }, [rootSlug, subSlug, categories]);

  return <ProductsPath parentChain={parentChain as any}></ProductsPath>;
};

export default Path;
