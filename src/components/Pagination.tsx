import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "../utils/helpers";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  totalPages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  hasNextPage,
  onPageChange,
  className,
  showFirstLast = true, // Changed back to true to show first/last buttons
  totalPages,
}) => {
  // If totalPages is not provided, use hasNextPage for infinite pagination
  const isInfinite = !totalPages;
  const actualTotalPages =
    totalPages || (hasNextPage ? currentPage + 1 : currentPage);

  const goToPage = (page: number) => {
    if (page >= 1 && (isInfinite || page <= actualTotalPages)) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Don't render if there's only one page and we know the total
  if (!isInfinite && actualTotalPages <= 1) return null;

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    if (isInfinite) {
      // For infinite pagination, show current page and surrounding pages
      const pages = [];
      const start = Math.max(1, currentPage - 1);
      const end = currentPage + (hasNextPage ? 1 : 0);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }

    // For known total pages
    if (actualTotalPages <= 3) {
      return Array.from({ length: actualTotalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const halfVisible = Math.floor(3 / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(actualTotalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (end - start + 1 < 3) {
      if (start === 1) {
        end = Math.min(actualTotalPages, start + 3 - 1);
      } else {
        start = Math.max(1, end - 3 + 1);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const canGoPrevious = currentPage > 1;
  const canGoNext = isInfinite ? hasNextPage : currentPage < actualTotalPages;

  return (
    <div className={cn("flex justify-center", className)}>
      <nav
        className="flex items-center gap-1"
        role="navigation"
        aria-label="Pagination"
      >
        {/* First Page Button - Show when enabled and conditions are met */}
        {showFirstLast &&
          !isInfinite &&
          totalPages &&
          totalPages > 3 &&
          currentPage > 1 && (
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 dark:border-gray-700 dark:bg-gray-800",
                currentPage === 1
                  ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              )}
              aria-label="Go to first page"
              title="First page"
            >
              <ChevronsLeft size={16} />
            </button>
          )}

        {/* Previous Page Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!canGoPrevious}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 dark:border-gray-700 dark:bg-gray-800",
            !canGoPrevious
              ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          )}
          aria-label="Go to previous page"
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {/* Visible page numbers */}
          {visiblePages.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={cn(
                "flex h-10 min-w-[2.5rem] items-center justify-center px-3 text-sm font-medium rounded-lg border transition-all duration-200",
                currentPage === pageNum
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              )}
              aria-current={currentPage === pageNum ? "page" : undefined}
              aria-label={`Go to page ${pageNum}`}
            >
              {pageNum}
            </button>
          ))}

          {/* Show next page placeholder if infinite and has next */}
          {isInfinite &&
            hasNextPage &&
            !visiblePages.includes(currentPage + 1) && (
              <span className="flex h-10 w-10 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                ...
              </span>
            )}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!canGoNext}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 dark:border-gray-700 dark:bg-gray-800",
            !canGoNext
              ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          )}
          aria-label="Go to next page"
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last Page Button - Show when enabled and we know total pages */}
        {showFirstLast &&
          !isInfinite &&
          totalPages &&
          totalPages > 3 &&
          currentPage < totalPages && (
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 dark:border-gray-700 dark:bg-gray-800",
                currentPage === totalPages
                  ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              )}
              aria-label="Go to last page"
              title="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          )}
      </nav>

      {/* Page Info - Only show for finite pagination */}
      {!isInfinite && (
        <div className="ml-4 hidden text-sm text-gray-600 dark:text-gray-400 sm:flex items-center">
          Page {currentPage} of {actualTotalPages}
        </div>
      )}

      {/* Current page info for infinite pagination */}
      {isInfinite && (
        <div className="ml-4 hidden text-sm text-gray-600 dark:text-gray-400 sm:flex items-center">
          Page {currentPage}
        </div>
      )}
    </div>
  );
};

export default Pagination;
