"use client";

import * as React from "react";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

export function PaginationFilter({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));

  const paginationRange = React.useMemo<Array<number | "left-ellipsis" | "right-ellipsis">>(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);
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
  }, [currentPage, totalPages, siblingCount]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center justify-around border", className)}>
      <UIPagination className="border w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              size={10}
              onClick={() => currentPage !== 1 && onPageChange(1)}
              className={cn(
                "rounded-none border px-3 py-1 text-sm font-semibold",
                currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationPrevious
              size={10}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={cn(
                "rounded-none border px-3 py-1 text-sm font-semibold",
                currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
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
                  onClick={() => onPageChange(page as number)}
                  isActive={currentPage === page}
                  className={cn(
                    "rounded-none border px-3 py-1 text-sm font-semibold",
                    currentPage === page ? "bg-chart-1 text-white" : "bg-white text-black",
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              size={10}
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={cn(
                "rounded-none border px-3 py-1 text-sm font-semibold",
                currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLast
              size={10}
              onClick={() => currentPage !== totalPages && onPageChange(totalPages)}
              className={cn(
                "rounded-none border px-3 py-1 text-sm font-semibold",
                currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </UIPagination>

      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} ({totalPages} Pages)
      </div>
    </div>
  );
}
