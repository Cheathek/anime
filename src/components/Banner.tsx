import React, { useState, useEffect } from "react";
import { Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn, truncateText, stringToColor } from "../utils/helpers";
import type { Anime } from "../types/anime";

interface BannerProps {
  animeList: Anime[];
  isLoading?: boolean;
}

const Banner: React.FC<BannerProps> = ({ animeList, isLoading = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const featuredAnime = animeList[activeIndex];

  useEffect(() => {
    if (animeList.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((current) => (current + 1) % animeList.length);
        setIsAnimating(false);
      }, 1000);
    }, 6000);

    return () => clearInterval(interval);
  }, [animeList.length, activeIndex]);

  const handleIndicatorClick = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsAnimating(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="relative h-[70vh] min-h-[600px] w-full animate-pulse bg-gray-300 dark:bg-gray-800">
        <div className="absolute bottom-12 left-8 right-8 max-w-2xl rounded-lg bg-gray-400 p-6 dark:bg-gray-700">
          <div className="h-8 w-3/4 rounded bg-gray-500 dark:bg-gray-600"></div>
          <div className="mt-4 h-20 w-full rounded bg-gray-500 dark:bg-gray-600"></div>
          <div className="mt-4 flex space-x-4">
            <div className="h-10 w-32 rounded-full bg-gray-500 dark:bg-gray-600"></div>
            <div className="h-10 w-32 rounded-full bg-gray-500 dark:bg-gray-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredAnime) return null;

  const imageUrl = featuredAnime.images?.jpg?.large_image_url;
  const title = featuredAnime.title_english || featuredAnime.title;

  return (
    <div className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image with Right-to-Left Slide Animation */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500",
          isAnimating
            ? "-translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        )}
        style={{
          backgroundImage: `url(${imageUrl})`,
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70" />

      {/* Content with Fade Animation */}
      <div
        className={cn(
          "container-custom relative z-10 flex h-full items-end pb-12 transition-opacity duration-500",
          isAnimating ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="glass max-w-3xl rounded-xl p-6 backdrop-blur-lg">
          <div className="flex flex-wrap items-start gap-4 lg:flex-nowrap">
            <div className="hidden shrink-0 overflow-hidden rounded-lg shadow-lg sm:block sm:w-1/3 lg:w-1/4">
              <img
                src={imageUrl}
                alt={title}
                className="aspect-[2/3] h-full w-full object-cover transition-all duration-500"
              />
            </div>

            <div className="w-full sm:w-2/3 lg:w-3/4">
              <h2 className="mb-2 text-2xl font-semibold text-white md:text-3xl lg:text-4xl">
                {title}
              </h2>

              <div className="mb-3 flex flex-wrap items-center gap-3">
                {featuredAnime.score > 0 && (
                  <div className="flex items-center text-yellow-400">
                    <Star size={16} className="mr-1 fill-current" />
                    <span>{featuredAnime.score.toFixed(1)}</span>
                  </div>
                )}
                {featuredAnime.type && (
                  <span className="text-sm text-gray-200">
                    {featuredAnime.type}{" "}
                    {featuredAnime.episodes
                      ? `(${featuredAnime.episodes} eps)`
                      : ""}
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    featuredAnime.airing ? "bg-green-500/80" : "bg-gray-600/80"
                  )}
                >
                  {featuredAnime.airing ? "Airing" : featuredAnime.status}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {featuredAnime.genres?.slice(0, 4).map((genre) => (
                  <span
                    key={genre.mal_id}
                    className={cn(
                      "rounded px-2 py-1 text-xs font-medium",
                      stringToColor(genre.name)
                    )}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="mb-4 text-sm text-gray-200 md:text-base">
                {truncateText(featuredAnime.synopsis || "", 200)}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/anime/${featuredAnime.mal_id}`}
                  className="btn-primary group"
                >
                  <Play size={18} className="mr-2" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {animeList.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center overflow-x-auto px-4 py-2">
          <div className="flex gap-1.5">
            {animeList.map((_, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(index)}
                className={cn(
                  "h-1.5 w-6 rounded-full transition-all sm:h-2 sm:w-8",
                  index === activeIndex
                    ? "bg-white"
                    : "bg-white/30 hover:bg-white/50"
                )}
                aria-label={`View anime ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
