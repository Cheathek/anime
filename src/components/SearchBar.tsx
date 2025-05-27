import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, X } from "lucide-react";
import { useQuery } from "react-query";
import { searchAnime } from "../services/api";
import { useClickAway } from "../hooks/useClickAway";
import { cn } from "../utils/helpers";

interface SearchBarProps {
  isMobile?: boolean;
  showMobileSearch?: boolean;
  onToggle?: () => void;
}

// Assuming Anime type is defined elsewhere
interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string; large_image_url: string } };
  score: number;
  type: string;
  episodes: number | null;
  aired: { string: string };
  status: string;
}

// Assuming AnimeResponse type is defined elsewhere
interface AnimeResponse {
  data: Anime[];
  pagination: any; // Simplified for brevity
}

const SearchBar: React.FC<SearchBarProps> = ({
  isMobile = false,
  showMobileSearch = false,
  onToggle,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions on click away
  useClickAway(searchRef, () => setShowSuggestions(false));

  const { data: searchResults, isLoading } = useQuery<AnimeResponse>(
    ["searchSuggestions", debouncedQuery],
    () => searchAnime(debouncedQuery, 1, 8), // Assuming searchAnime exists
    {
      enabled: debouncedQuery.length > 1,
      staleTime: 300000,
      refetchOnWindowFocus: false,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      resetSearch();
      if (isMobile && onToggle) onToggle(); // Close mobile search on submit
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 1);
  };

  const handleSuggestionClick = () => {
    resetSearch();
    if (isMobile && onToggle) onToggle(); // Close mobile search on suggestion click
  };

  // --- Mobile View Logic ---
  if (isMobile) {
    // Render the Search icon button ONLY when the search bar is closed
    if (!showMobileSearch) {
      return (
        <button
          onClick={onToggle} // This opens the search bar
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open search"
        >
          <Search size={22} />
        </button>
      );
    } else {
      // Render the styled search bar when open, including a Close button
      return (
        <div className="fixed inset-x-0 top-0 z-40 p-3 bg-[#1a1a1d]">
          <div ref={searchRef} className="relative">
            {/* Form wraps the styled bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full h-11 bg-[#2c2d30] rounded-full border border-gray-700/50 shadow-sm"
            >
              <Search
                size={18}
                className="ml-3.5 mr-2 text-gray-400 flex-shrink-0 pointer-events-none"
              />
              <input
                type="search"
                placeholder="Search Anime..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(searchQuery.length > 1)}
                className="flex-grow h-full capitalize bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none text-md pr-2"
                autoFocus
              />
              {/* Close Button - Styled like image's right section but with X */}
              <button
                type="button"
                onClick={onToggle}
                aria-label="Close search"
                className="flex items-center justify-center h-full w-11 rounded-r-full bg-[#4a5fd8] hover:bg-[#5a6fd8] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#2c2d30] transition-colors duration-150 ease-in-out flex-shrink-0"
              >
                <X size={20} />
              </button>
            </form>

            {/* Suggestions dropdown - positioned below the bar */}
            {showSuggestions && (
              <SearchSuggestions
                searchResults={searchResults}
                isLoading={isLoading}
                searchQuery={debouncedQuery}
                onSuggestionClick={handleSuggestionClick}
                isMobile={true}
              />
            )}
          </div>
        </div>
      );
    }
  }

  // --- Desktop Search Bar --- (Unchanged from original pasted_content.txt)
  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Anime..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(searchQuery.length > 1)}
            className="w-64 lg:w-72 capitalize rounded-l-full bg-gray-100 dark:bg-gray-700 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-400 focus:ring-inset text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
        <button
          type="submit"
          className="rounded-r-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 px-4 text-white transition-colors"
          aria-label="Submit search"
        >
          <Search size={18} />
        </button>
      </form>

      {showSuggestions && (
        <SearchSuggestions
          searchResults={searchResults}
          isLoading={isLoading}
          searchQuery={debouncedQuery}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
};

// --- Search Suggestions Component --- (Unchanged from original pasted_content.txt, but needs styling review)
interface SearchSuggestionsProps {
  searchResults: AnimeResponse | undefined;
  isLoading: boolean;
  searchQuery: string;
  onSuggestionClick: () => void;
  isMobile?: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  searchResults,
  isLoading,
  searchQuery,
  onSuggestionClick,
  isMobile = false,
}) => {
  // Added check for searchResults existence
  const hasResults =
    searchResults && searchResults.data && searchResults.data.length > 0;

  return (
    <div
      className={cn(
        "absolute bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50",
        // Adjusted positioning for the new mobile bar style
        isMobile
          ? "left-0 right-0 top-full mt-2 mx-3"
          : "left-0 right-0 top-full mt-1"
      )}
    >
      {isLoading ? (
        <div className="p-4 text-center">
          {/* Spinner */}
          <div
            className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent text-blue-500 rounded-full"
            role="status"
            aria-label="loading"
          ></div>
          <p className="mt-2 text-sm text-gray-500">Searching...</p>
        </div>
      ) : hasResults ? (
        <div className="py-1">
          {searchResults.data.map((anime: Anime, index: number) => (
            <Link
              key={anime.mal_id}
              to={`/anime/${anime.mal_id}`}
              className={cn(
                "flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                index < searchResults.data.length - 1 &&
                  "border-b border-gray-100 dark:border-gray-700"
              )}
              onClick={onSuggestionClick}
            >
              {/* Suggestion content remains the same */}
              <img
                src={anime.images.jpg.image_url} // Use smaller image for suggestions
                alt={anime.title}
                className="h-16 w-12 rounded object-cover flex-shrink-0 bg-gray-200 dark:bg-gray-700"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                  {anime.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                  <span>{anime.type}</span>
                  {anime.episodes && (
                    <>
                      <span>•</span>
                      <span>{anime.episodes} eps</span>
                    </>
                  )}
                  {anime.score > 0 && (
                    <span className="flex items-center">
                      <Star
                        size={12}
                        className="mr-0.5 text-yellow-400 fill-current"
                      />
                      {anime.score.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">{anime.status}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : searchQuery.length > 1 ? (
        <div className="p-4 text-center text-gray-500 text-sm">
          No results for "{searchQuery}"
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
