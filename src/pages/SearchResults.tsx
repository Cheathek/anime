import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { searchAnime } from "../services/api";
import { Search, ChevronLeft } from "lucide-react";
import Pagination from "../components/Pagination";
import AnimeCard from "../components/AnimeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL when page changes
    setSearchParams({
      q: query,
      page: newPage.toString(),
    });
  };

  // Update page when URL changes
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam));
    } else {
      setPage(1);
    }
  }, [pageParam]);

  // Fetch search results with proper typing
  const { data, isLoading, isError } = useQuery(
    ["search", query, page],
    () => searchAnime(query, page),
    {
      enabled: !!query,
      keepPreviousData: true,
    }
  );

  const results = data?.data || [];
  const hasNextPage = data?.pagination?.has_next_page || false;
  const totalPages = (data?.pagination as any)?.last_visible_page || 1;

  // Handle search form submission
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim(), page: "1" });
      setPage(1);
    }
  };

  return (
    <div className="min-h-screen pb-16 pt-[calc(var(--header-height)+2rem)]">
      <div className="container-custom">
        {/* Back link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 group transition-colors"
        >
          <span className="relative mr-1 mt-1 inline-block overflow-hidden">
            <ChevronLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            <ChevronLeft
              size={16}
              className="absolute left-0 top-0 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
            />
          </span>
          Back to Home
        </Link>

        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search anime..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full capitalize rounded-lg border border-gray-300 py-3 pl-12 pr-4 shadow-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
            />
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-primary-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="mb-8">
          <h1
            className="mb-6 text-2xl font-semibold md:text-3xl"
            dangerouslySetInnerHTML={
              query
                ? {
                    __html: `Search results for "<span class="text-primary-600 italic dark:text-primary-400">${query}</span>"`,
                  }
                : { __html: "Search for anime" }
            }
          />

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-200">
              <p>Error loading search results. Please try again.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center">
              {query ? (
                <div className="my-12">
                  <h3 className="text-xl font-medium">No results found</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Try using different keywords or check your spelling.
                  </p>
                </div>
              ) : (
                <p className="my-12 text-gray-600 dark:text-gray-400">
                  Enter a search term to find anime.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {results.map((anime: any) => (
                  <AnimeCard key={anime.mal_id} anime={anime} size="sm" />
                ))}
              </div>

              {/* Only show pagination if there are results */}
              {results.length > 0 && (
                <Pagination
                  currentPage={page}
                  hasNextPage={hasNextPage}
                  onPageChange={handlePageChange}
                  className="mt-12"
                  showFirstLast={true}
                  totalPages={totalPages}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
