import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star } from "lucide-react";
import { useQuery } from "react-query";
import { searchAnime } from "../services/api";
import { useClickAway } from "../hooks/useClickAway";
import { cn } from "../utils/helpers";

interface SearchBarProps {
  isMobile?: boolean;
  showMobileSearch?: boolean;
  onToggle?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  isMobile = false, 
  showMobileSearch = false,
  onToggle 
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query for immediate fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useClickAway(searchRef, () => {
    setShowSuggestions(false);
  });

  const { data: searchResults, isLoading } = useQuery(
    ["searchSuggestions", debouncedQuery],
    () => searchAnime(debouncedQuery, 1, 8),
    { 
      enabled: debouncedQuery.length > 1,
      staleTime: 300000,
      refetchOnWindowFocus: false
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      resetSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 1);
  };

  const handleSuggestionClick = () => {
    resetSearch();
  };

  // Mobile search toggle button
  if (isMobile && !showMobileSearch) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Search size={22} />
      </button>
    );
  }

  // Mobile search bar
  if (isMobile && showMobileSearch) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div ref={searchRef} className="relative">
          <form onSubmit={handleSearch} className="relative flex">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(searchQuery.length > 1)}
              className="w-full capitalize rounded-l-full bg-gray-100 dark:bg-gray-700 py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-400 focus:ring-inset text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-r-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 px-4 text-white transition-colors"
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
              isMobile={true}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop search bar
  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative">
          <input
            type="text"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(searchQuery.length > 1)}
            className="w-64 lg:w-72 capitalize rounded-l-full bg-gray-100 dark:bg-gray-700 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-400 focus:ring-inset text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div>
        <button
          type="submit"
          className="rounded-r-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 px-4 text-white transition-colors"
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

// Search Suggestions Component
interface SearchSuggestionsProps {
  searchResults: any;
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
  isMobile = false
}) => {
  return (
    <div className={cn(
      "absolute bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50",
      isMobile ? "left-0 right-0 top-full mt-2" : "left-0 right-0 top-full mt-1"
    )}>
      {isLoading ? (
        <div className="p-4 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Searching...</p>
        </div>
      ) : searchResults?.data?.length ? (
        <div className="py-2">
          {searchResults.data.map((anime: any, index: number) => (
            <Link
              key={anime.mal_id}
              to={`/anime/${anime.mal_id}`}
              className={cn(
                "flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                index < searchResults.data.length - 1 && "border-b border-gray-100 dark:border-gray-700"
              )}
              onClick={onSuggestionClick}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                  alt={anime.title}
                  className="h-16 w-12 rounded-md object-cover shadow-sm"
                  loading="lazy"
                />
                {anime.score > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-gray-900 text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center shadow-sm">
                    <Star className="w-3 h-3 mr-0.5 fill-current" />
                    {anime.score.toFixed(1)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                  {anime.title}
                </h4>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                  <span>{anime.type}</span>
                  <span>•</span>
                  <span>{anime.episodes || "?"} eps</span>
                  <span>•</span>
                  <span>{anime.aired.string.split(" to ")[0]}</span>
                </div>

                <div className="mt-2">
                  <span className={cn(
                    "inline-block text-xs px-2 py-0.5 rounded-full font-medium",
                    anime.status.toLowerCase().includes("airing")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  )}>
                    {anime.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : searchQuery.length > 1 ? (
        <div className="p-6 text-center">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No anime found for "<span className="text-primary-600 dark:text-primary-400">{searchQuery}</span>"</p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;