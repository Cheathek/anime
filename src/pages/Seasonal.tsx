import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { getSeasonalAnime } from "../services/api";
import AnimeCard from "../components/AnimeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Pagination from "../components/Pagination";
import { cn } from "../utils/helpers";

const Seasonal: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [season, setSeason] = useState("now");
  const [page, setPage] = useState(1); // Add page state
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);

  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const seasonDropdownRef = useRef<HTMLDivElement>(null);

  // This will automatically refetch when year, season, or page changes
  const { data, isLoading, isFetching } = useQuery(
    ["seasonal", year, season], // Query key includes year and season
    () => getSeasonalAnime(year, season, 24),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const hasNextPage = data?.pagination?.has_next_page || false;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearDropdownOpen(false);
      }
      if (
        seasonDropdownRef.current &&
        !seasonDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSeasonDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [year, season]);

  const animeList = data?.data || [];

  // Generate year options (last 10 years)
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Season options
  const seasons = [
    { value: "now", label: "Current Season" },
    { value: "winter", label: "Winter" },
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "fall", label: "Fall" },
  ];

  // Handle season change
  const handleSeasonChange = (newSeason: string) => {
    setSeason(newSeason);
    // Reset to current year when selecting "now"
    if (newSeason === "now") {
      setYear(currentYear);
    }
    setIsSeasonDropdownOpen(false);
  };

  // Handle year change
  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    setIsYearDropdownOpen(false);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen pb-16 pt-[calc(var(--header-height)+2rem)]">
      <div className="container-custom">
        {/* Back link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
        >
          <ArrowLeft size={16} className="mr-1 mt-1" />
          Back to Home
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold md:text-3xl">
            {season === "now"
              ? "Current"
              : season.charAt(0).toUpperCase() + season.slice(1)}{" "}
            Season
            {season !== "now" ? ` ${year}` : ""}
          </h1>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-4">
            {/* Season selector */}
            <div className="relative" ref={seasonDropdownRef}>
              <button
                onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                {seasons.find((s) => s.value === season)?.label || "Season"}
                <ChevronDown size={16} />
              </button>

              {isSeasonDropdownOpen && (
                <div className="absolute left-0 z-50 mt-1 w-40 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <ul className="py-1">
                    {seasons.map((s) => (
                      <li key={s.value}>
                        <button
                          onClick={() => handleSeasonChange(s.value)}
                          className={cn(
                            "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                            season === s.value &&
                              "bg-gray-100 font-medium dark:bg-gray-700"
                          )}
                        >
                          {s.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Year selector (only shown when not on "current season") */}
            {season !== "now" && (
              <div className="relative" ref={yearDropdownRef}>
                <button
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {year}
                  <ChevronDown size={16} />
                </button>

                {isYearDropdownOpen && (
                  <div className="absolute left-0 z-50 mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <ul className="max-h-60 overflow-y-auto py-1">
                      {years.map((y) => (
                        <li key={y}>
                          <button
                            onClick={() => handleYearChange(y)}
                            className={cn(
                              "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                              year === y &&
                                "bg-gray-100 font-medium dark:bg-gray-700"
                            )}
                          >
                            {y}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading || isFetching ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 24 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : animeList.length === 0 ? (
          <div className="my-16 text-center">
            <h3 className="text-xl font-medium">
              No anime found for this season
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try selecting a different season or year.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {animeList.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} size="sm" />
              ))}
            </div>

            {/* Pagination - moved outside the grid */}
            <Pagination
              currentPage={page}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
              className="mt-12"
              showFirstLast={true}
              totalPages={data?.pagination?.last_visible_page}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Seasonal;
