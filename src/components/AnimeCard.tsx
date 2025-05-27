import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Bookmark } from "lucide-react";
import { cn } from "../utils/helpers"; // Assuming this helper exists
import type { Anime } from "../types/anime"; // Assuming this type exists
import { useFavorites } from "../hooks/useFavorites"; // Import the custom hook

interface AnimeCardProps {
  anime: Anime;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  className,
  size = "md",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  // Use the favorites hook
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Determine if the current anime is favorited
  const isCurrentlyFavorite = isFavorite(anime.mal_id);

  const imageUrl = anime.images?.jpg?.large_image_url || "";
  const title = anime.title_english || anime.title;

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent triggering card hover/link
    if (isCurrentlyFavorite) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime.mal_id);
    }
  };

  return (
    <div
      className={cn(
        "relative flex-shrink-0 transition-all duration-300 hover:z-10",
        {
          "w-36 sm:w-44": size === "sm",
          "w-44 sm:w-56": size === "md",
          "w-64 sm:w-72": size === "lg",
        },
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect (unchanged) */}
      <div
        className={cn(
          "absolute -inset-1 rounded-xl bg-primary-500/20 blur-md transition-all duration-500 md:block",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />

      <Link
        to={`/anime/${anime.mal_id}`}
        className={cn(
          "group relative block h-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-lg transition-all duration-300",
          isHovered ? "md:border-primary-400/30 md:shadow-primary-500/20" : ""
        )}
      >
        <div className="relative aspect-[2/3] w-full">
          {/* Image (unchanged) */}
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-700",
              isHovered ? "md:scale-110" : "scale-100"
            )}
          />

          {/* Favorite button (top right) - Updated */}
          <button
            className="absolute right-2 top-2 z-10 rounded-full p-1.5 backdrop-blur-sm transition-all hover:scale-110 bg-black/30 hover:bg-black/50"
            onClick={handleFavoriteToggle} // Use the new handler
            aria-label={
              isCurrentlyFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Bookmark
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isCurrentlyFavorite
                  ? "fill-yellow-400 text-yellow-400" // Style for favorited state
                  : "fill-none text-gray-300 hover:text-white" // Style for non-favorited state
              )}
              strokeWidth={isCurrentlyFavorite ? 0 : 2} // No stroke when filled
            />
          </button>

          {/* Score badge (unchanged) */}
          {anime.score > 0 && (
            <div
              className={cn(
                "absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm transition-all",
                isHovered
                  ? "md:bg-primary-900/80 md:text-primary-100"
                  : "bg-black/70 text-white"
              )}
            >
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{anime.score.toFixed(1)}</span>
            </div>
          )}

          {/* Bottom info panel (unchanged) */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transition-all duration-300",
              isHovered ? "md:translate-y-0" : "translate-y-0"
            )}
          >
            {/* Type badges (unchanged) */}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {anime.type && (
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                    isHovered
                      ? "md:bg-primary-500/90 md:text-white"
                      : "bg-gray-800/90 text-gray-300"
                  )}
                >
                  {anime.type}
                </span>
              )}
              {anime.episodes && (
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                    isHovered
                      ? "md:bg-primary-600/90 md:text-white"
                      : "bg-gray-800/90 text-gray-300"
                  )}
                >
                  {anime.episodes} eps
                </span>
              )}
            </div>

            {/* Title (unchanged) */}
            <h3
              className={cn(
                "line-clamp-2 text-sm font-semibold text-white transition-all",
                isHovered ? "md:text-primary-300 md:drop-shadow-primary" : ""
              )}
            >
              {title}
            </h3>

            {/* Additional info (unchanged) */}
            <div
              className={cn(
                "mt-1 overflow-hidden transition-all duration-300",
                isHovered
                  ? "md:max-h-20 md:opacity-100"
                  : "max-h-20 opacity-100 md:max-h-0 md:opacity-0"
              )}
            >
              <p className="text-xs text-gray-300 line-clamp-2">
                {anime.synopsis}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                {anime.studios?.[0]?.name && (
                  <span>{anime.studios[0].name}</span>
                )}
                {anime.year && <span>• {anime.year}</span>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;
