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
      console.log("object", categories);
      console.log("root", rootSlug);
      // প্রথমে রুট বা প্যারেন্ট চেইন জেনারেট করা হলো (যেমন: [Samsung])
      const baseChain = buildParentChain(categories, rootSlug);

      // যদি ইউআরএল-এ সাব-স্লাগ (যেমন: galaxy-s24-ultra) থাকে, তাকেও অ্যারেতে পুশ করা হচ্ছে
      if (subSlug && baseChain.length > 0) {
        // স্লাগকে সুন্দর নাম (Capitalized words) এ রূপান্তর করা: "galaxy-s24-ultra" -> "Galaxy S24 Ultra"
        const formattedName = subSlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        // 🎯 Type Assertion (as Category) ব্যবহার করে টাইপস্ক্রিপ্টের এরর ফিক্স করা হলো
        const customChildNode = {
          id: subSlug,
          name: formattedName,
          slug: `${rootSlug}/${subSlug}`,
          child: [],
          // যদি ইন্টারফেসের কড়া নিয়ম মানতে চান, তবে ডিফল্ট ভ্যালু দিতে পারেন,
          // অথবা সরাসরি অবজেক্টের শেষে `as Category` লিখে দিতে পারেন।
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
