"use client";

import Path from "@/components/path/Path";
import {useSelectedLayoutSegments} from "next/navigation";

import React from "react";

export default function ProductLayout({children}: {children: React.ReactNode}) {
  const segments = useSelectedLayoutSegments();

  const categorySlug = segments.length > 0 ? segments[segments.length - 1] : null;

  return (
    <>
      {categorySlug && <Path slug={categorySlug} />}
      {children}
    </>
  );
}
