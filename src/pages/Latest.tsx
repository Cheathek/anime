import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getLatestAnime } from "../services/api";
import AnimeCard from "../components/AnimeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Pagination from "../components/Pagination";

const Latest: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ["latestAnime", page],
    () => getLatestAnime(24),
    {
      keepPreviousData: true,
    }
  );

  const animeList = data?.data || [];
  const hasNextPage = data?.pagination?.has_next_page || false;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen pb-16 pt-[calc(var(--header-height)+2rem)]">
      <div className="container-custom">
        <Link
          to="/"
          className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
        >
          <ArrowLeft size={16} className="mr-1 mt-1" />
          Back to Home
        </Link>

        <h1 className="mb-8 text-2xl font-semibold md:text-3xl">
          Latest Anime Releases
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 24 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {animeList.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} size="sm" />
              ))}
            </div>

            <Pagination
              currentPage={page}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
              className="mt-12"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Latest;