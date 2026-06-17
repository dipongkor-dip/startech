"use client";

import * as React from "react";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {cn} from "@/lib/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  className?: string;
  siblingCount?: number;
}

export function PaginationFilter({page = 1, limit = 16, total, className, siblingCount = 1}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  const paginationRange = React.useMemo<Array<number | "left-ellipsis" | "right-ellipsis">>(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 2);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages - 1);
    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    const range: Array<number | "left-ellipsis" | "right-ellipsis"> = [1];

    if (showLeftEllipsis) {
      range.push("left-ellipsis");
    }

    for (let i = showLeftEllipsis ? leftSiblingIndex : 2; i <= (showRightEllipsis ? rightSiblingIndex : totalPages - 1); i += 1) {
      range.push(i);
    }

    if (showRightEllipsis) {
      range.push("right-ellipsis");
    }

    range.push(totalPages);
    return range;
  }, [page, totalPages, siblingCount]);

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(total, page * limit);

  if (total === 0) {
    return null;
  }

  const handlePageChange = (page: number) => {
    const normalizedPage = Math.min(Math.max(1, page), totalPages);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // do not persist sortBy when changing pages
    // newSearchParams.delete("sortBy");
    newSearchParams.set("page", normalizedPage.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center justify-between py-5", className)}>
      <UIPagination className="w-fit ml-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size={10}
              onClick={() => page > 1 && handlePageChange(page - 1)}
              className={cn("rounded-none border px-3 py-1 text-sm font-semibold", page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}
            />
          </PaginationItem>

          {paginationRange.map((page, index) =>
            page === "left-ellipsis" || page === "right-ellipsis" ? (
              <PaginationItem key={`${page}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  size={10}
                  onClick={() => handlePageChange(page as number)}
                  isActive={page === page}
                  className={cn("rounded-none border px-3 py-1 text-sm font-semibold", page === page ? "bg-chart-1 text-white" : "bg-white text-black")}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              size={10}
              onClick={() => page < totalPages && handlePageChange(page + 1)}
              className={cn("rounded-none border px-3 py-1 text-sm font-semibold", page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer")}
            />
          </PaginationItem>
        </PaginationContent>
      </UIPagination>

      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {total} ({totalPages} Pages)
      </div>
    </div>
  );
}
