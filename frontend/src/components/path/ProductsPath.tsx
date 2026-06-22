"use client";

import React from "react";
import Link from "next/link";
import {HomeIcon} from "lucide-react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";

const ProductsPath = ({parentChain}: {parentChain: [{slug: string; name: string}]}) => {
  return (
    <div className="bg-white dark:bg-card shadow-sm py-5">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" className="inline-flex items-center gap-1" />}>
                <HomeIcon className="size-4" />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {parentChain.map((parent, i) => (
              <React.Fragment key={`${parent.slug}-${i}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {i === parentChain.length - 1 ? (
                    <BreadcrumbPage>{parent.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={`/${parent.slug}`} />}>{parent.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default ProductsPath;
