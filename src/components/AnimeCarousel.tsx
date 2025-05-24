import React, { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "./AnimeCard";
import { cn } from "../utils/helpers";
import type { Anime } from "../types/anime";
import LoadingSkeleton from "./LoadingSkeleton";

interface AnimeCarouselProps {
  title: string;
  animeList: Anime[];
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  viewAllLink?: string;
}

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({
  title,
  animeList,
  isLoading = false,
  size = "md",
  viewAllLink,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Create unique list of anime by removing duplicates
  const uniqueAnimeList = React.useMemo(() => {
    const seenIds = new Set<number>();
    return animeList.filter(anime => {
      if (seenIds.has(anime.mal_id)) {
        console.warn(`Duplicate anime ID found: ${anime.mal_id}`);
        return false;
      }
      seenIds.add(anime.mal_id);
      return true;
    });
  }, [animeList]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -width / 1.5 : width / 1.5,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="my-8">
      <div className="mb-4 flex items-center justify-between px-2">
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        {viewAllLink && (
          <a
            href={viewAllLink}
            className="group flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View All
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 top-1/2 z-40 -translate-y-1/2 rounded-full p-2",
            "bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white",
            "dark:bg-gray-800/90 dark:hover:bg-gray-700",
            "border border-gray-200 dark:border-gray-600",
            "text-gray-800 hover:text-primary-600 dark:text-gray-200",
            "transition-all hover:scale-110 focus:outline-none",
            "md:-left-4"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-2 top-1/2 z-40 -translate-y-1/2 rounded-full p-2",
            "bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white",
            "dark:bg-gray-800/90 dark:hover:bg-gray-700",
            "border border-gray-200 dark:border-gray-600",
            "text-gray-800 hover:text-primary-600 dark:text-gray-200",
            "transition-all hover:scale-110 focus:outline-none",
            "md:-right-4"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={scrollContainerRef}
          className={cn(
            "flex gap-4 overflow-x-auto px-4 py-2 scrollbar-thin",
            "md:px-0",
            { "items-stretch": !isLoading }
          )}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <LoadingSkeleton
                  key={`skeleton-${index}`}
                  className={cn("rounded-xl", {
                    "w-36 sm:w-44": size === "sm",
                    "w-44 sm:w-56": size === "md",
                    "w-64 sm:w-72": size === "lg",
                  })}
                />
              ))
            : uniqueAnimeList.map((anime) => (
                <AnimeCard 
                  key={`anime-${anime.mal_id}`}
                  anime={anime} 
                  size={size} 
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default AnimeCarousel;