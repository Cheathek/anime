import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getTopAnime } from "../services/api";
import AnimeCard from "../components/AnimeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Pagination from "../components/Pagination";

const Popular: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ["popularAnime", page],
    () => getTopAnime("bypopularity", 24, page),
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

        <h1 className="mb-8 text-2xl font-semibold md:text-3xl">
          Most Popular Anime
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
              showFirstLast={true}
              totalPages={data?.pagination?.last_visible_page}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Popular;
