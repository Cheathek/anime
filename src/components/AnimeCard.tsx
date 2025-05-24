// AnimeCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "../utils/helpers";
import type { Anime } from "../types/anime";

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
  const imageUrl = anime.images?.jpg?.large_image_url || "";
  const title = anime.title_english || anime.title;

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className={cn(
        "group relative flex-shrink-0 overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg",
        {
          "w-36 sm:w-44": size === "sm",
          "w-44 sm:w-56": size === "md",
          "w-64 sm:w-72": size === "lg",
        },
        className
      )}
    >
      <div className="relative aspect-[2/3] w-full">
        {/* Image */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Top overlay for score */}
        <div className="absolute top-0 left-0 right-0 p-2">
          {anime.score > 0 && (
            <div className="ml-auto flex w-max items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{anime.score.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
          <div className="flex flex-wrap gap-1">
            <span className="rounded-full bg-gray-800/90 px-2 py-1 text-xs font-medium text-white">
              {anime.type || "Unknown"}
            </span>
            {anime.episodes && (
              <span className="rounded-full bg-gray-800/90 px-2 py-1 text-xs font-medium text-white">
                {anime.episodes} eps
              </span>
            )}
            <span className="rounded-full bg-gray-800/90 px-2 py-1 text-xs font-medium text-white">
              {anime.status || "Unknown"}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-white">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
