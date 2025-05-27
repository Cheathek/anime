import React, { useEffect, useState } from "react";
// import { useQuery } from 'react-query';
import { Link } from "react-router-dom";
import { Heart, ChevronLeft } from "lucide-react";

import { useFavorites } from "../hooks/useFavorites"; // Adjust path as needed
import { getAnimeById } from "../services/api"; // Adjust path as needed
import AnimeCard from "../components/AnimeCard"; // Use the updated AnimeCard
import LoadingSkeleton from "../components/LoadingSkeleton"; // Assuming this exists
import type { AnimeDetailResponse } from "../types/anime"; // Assuming this type exists

const Favorites: React.FC = () => {
  const { favoriteIds } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteAnimeDetails, setFavoriteAnimeDetails] = useState<
    AnimeDetailResponse["data"][]
  >([]);

  useEffect(() => {
    const fetchAllFavorites = async () => {
      if (favoriteIds.length === 0) {
        setFavoriteAnimeDetails([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      const results: AnimeDetailResponse["data"][] = [];
      let fetchError = false;

      // Fetch details sequentially using the rate-limited getAnimeById
      for (const id of favoriteIds) {
        try {
          // getAnimeById already includes rate limiting
          const response = await getAnimeById(id);
          if (response?.data) {
            results.push(response.data);
          } else {
            console.warn(`No data found for favorite anime ID: ${id}`);
            // Optionally handle missing data (e.g., remove ID from favorites)
          }
        } catch (err) {
          console.error(`Failed to fetch favorite anime ID: ${id}`, err);
          fetchError = true;
          // Decide if you want to stop fetching on first error or continue
          // break; // Uncomment to stop on first error
        }
      }

      setFavoriteAnimeDetails(results);
      if (fetchError) {
        setError(
          "Failed to fetch some favorite anime details. Please try refreshing."
        );
      }
      setIsLoading(false);
    };

    fetchAllFavorites();
  }, [favoriteIds]); // Re-fetch when favoriteIds change

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

        <h1 className="mb-6 text-2xl font-semibold md:text-3xl">
          Your Favorites
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {/* Show skeletons based on the number of favorites being loaded */}
            {Array.from({ length: favoriteIds.length || 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-100 p-4 text-center text-red-800 dark:bg-red-900/30 dark:text-red-200">
            <p>{error}</p>
          </div>
        ) : favoriteAnimeDetails.length === 0 ? (
          <div className="my-12 text-center">
            <Heart
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              strokeWidth={1}
            />
            <h3 className="mt-4 text-xl font-medium">No favorites yet</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Click the heart icon on an anime card to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {favoriteAnimeDetails.map((anime) => (
              // Use the updated AnimeCard which includes the favorite toggle logic
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
