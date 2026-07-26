"use client";
import React from "react";
import {CategoryMegaMenu} from "@/components/CategoryMegaMenu";

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <>
      {/* Sticky CategoryMegaMenu */}
      <div className="z-40 shadow-sm shadow-gray-300 dark:shadow-gray-800 xl:sticky xl:top-0">
        <CategoryMegaMenu />
      </div>
      {children}
    </>
  );
}
