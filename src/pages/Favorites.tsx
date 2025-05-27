import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ChevronLeft, RefreshCw } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { getAnimeById } from "../services/api";
import AnimeCard from "../components/AnimeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import type { AnimeDetailResponse } from "../types/anime";

const Favorites: React.FC = () => {
  const { favoriteIds } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteAnimeDetails, setFavoriteAnimeDetails] = useState<
    AnimeDetailResponse["data"][]
  >([]);
  const [failedIds, setFailedIds] = useState<number[]>([]);

  const fetchAllFavorites = async () => {
    if (favoriteIds.length === 0) {
      setFavoriteAnimeDetails([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const results: AnimeDetailResponse["data"][] = [];
    const newFailedIds: number[] = [];

    // Fetch details with retry logic
    for (const id of favoriteIds) {
      let retries = 2; // Number of retry attempts
      let success = false;

      while (retries > 0 && !success) {
        try {
          const response = await getAnimeById(id);
          if (response?.data) {
            results.push(response.data);
            success = true;
          } else {
            console.warn(`No data found for favorite anime ID: ${id}`);
            retries--;
          }
        } catch (err) {
          console.error(`Failed to fetch favorite anime ID: ${id}`, err);
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }

      if (!success) {
        newFailedIds.push(id);
      }
    }

    setFavoriteAnimeDetails(results);
    setFailedIds(newFailedIds);

    if (newFailedIds.length > 0) {
      setError(
        `Failed to fetch ${newFailedIds.length} favorite anime. ${
          results.length > 0 ? "Showing available results." : ""
        }`
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllFavorites();
  }, [favoriteIds]);

  const handleRetry = async () => {
    if (failedIds.length === 0) return;
    setError("Retrying failed requests...");
    setIsLoading(true);

    const results = [...favoriteAnimeDetails];
    const newFailedIds: number[] = [];

    for (const id of failedIds) {
      try {
        const response = await getAnimeById(id);
        if (response?.data) {
          results.push(response.data);
        } else {
          newFailedIds.push(id);
        }
      } catch (err) {
        console.error(`Failed again to fetch favorite anime ID: ${id}`, err);
        newFailedIds.push(id);
      }
    }

    setFavoriteAnimeDetails(results);
    setFailedIds(newFailedIds);

    if (newFailedIds.length > 0) {
      setError(
        `Still failed to fetch ${newFailedIds.length} favorite anime. ${
          results.length > 0 ? "Showing available results." : ""
        }`
      );
    } else {
      setError(null);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pb-16 pt-[calc(var(--header-height)+2rem)]">
      <div className="container-custom">
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
          Your Favorites {favoriteIds.length}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: favoriteIds.length || 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="mb-6 rounded-lg bg-yellow-100 p-4 text-center text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
            <p>{error}</p>
            {failedIds.length > 0 && (
              <button
                onClick={handleRetry}
                className="mt-3 inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
            )}
          </div>
        ) : favoriteAnimeDetails.length === 0 ? (
          <div className="my-12 text-center">
            <Bookmark
              className="text-yellow-400 mx-auto h-12 w-12 dark:text-yellow-500"
              strokeWidth={1}
            />
            <h3 className="mt-4 text-xl font-medium">No favorites yet</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Click the Bookmark icon on an anime card to save it here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {favoriteAnimeDetails.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
            {failedIds.length > 0 && (
              <div className="mt-6 rounded-lg bg-gray-100 p-4 text-center text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <p>Couldn't load {failedIds.length} favorites</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Try loading them again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
