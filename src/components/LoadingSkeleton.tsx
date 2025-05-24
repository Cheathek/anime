import React from "react";
import { cn } from "../utils/helpers";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "banner" | "detail";
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = "card",
}) => {
  if (variant === "banner") {
    return (
      <div className="relative h-[50vh] min-h-[400px] w-full animate-pulse bg-gray-300 dark:bg-gray-800">
        <div className="absolute bottom-12 left-4 right-4 max-w-2xl rounded-lg bg-gray-400 p-6 dark:bg-gray-700 md:left-8 md:right-8">
          <div className="h-8 w-3/4 rounded bg-gray-500 dark:bg-gray-600"></div>
          <div className="mt-4 h-20 w-full rounded bg-gray-500 dark:bg-gray-600"></div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-10 w-24 rounded-full bg-gray-500 dark:bg-gray-600 md:w-32"></div>
            <div className="h-10 w-24 rounded-full bg-gray-500 dark:bg-gray-600 md:w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="animate-pulse">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left column - image and stats */}
          <div className="w-full lg:max-w-[300px]">
            <div className="aspect-[2/3] w-full rounded-lg bg-gray-300 dark:bg-gray-800"></div>
            <div className="mt-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-1 h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - content */}
          <div className="flex-1">
            <div className="mb-4 h-8 w-3/4 rounded bg-gray-300 dark:bg-gray-800"></div>
            <div className="mb-6 flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-800"
                ></div>
              ))}
            </div>
            <div className="mb-8 space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded bg-gray-300 dark:bg-gray-800 ${
                    i === 7 ? "w-5/6" : "w-full"
                  }`}
                ></div>
              ))}
            </div>

            {/* Characters loading */}
            <div className="mb-8">
              <div className="mb-4 h-6 w-1/3 rounded bg-gray-300 dark:bg-gray-800"></div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex h-24 rounded bg-gray-300 dark:bg-gray-800"
                  >
                    <div className="w-1/3 bg-gray-400 dark:bg-gray-700"></div>
                    <div className="w-2/3 p-2">
                      <div className="h-4 w-3/4 rounded bg-gray-400 dark:bg-gray-700"></div>
                      <div className="mt-2 h-3 w-1/2 rounded bg-gray-400 dark:bg-gray-700"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related anime loading */}
            <div>
              <div className="mb-4 h-6 w-1/3 rounded bg-gray-300 dark:bg-gray-800"></div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[2/3] rounded bg-gray-300 dark:bg-gray-800"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div
      className={cn(
        "card animate-pulse overflow-hidden w-full",
        "min-w-[150px] sm:min-w-[180px] md:min-w-[200px]",
        className
      )}
    >
      <div className="aspect-[2/3] w-full bg-gray-300 dark:bg-gray-800"></div>
      <div className="p-3">
        <div className="h-5 w-full rounded bg-gray-300 dark:bg-gray-800"></div>
        <div className="mt-2 h-5 w-2/3 rounded bg-gray-300 dark:bg-gray-800"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
