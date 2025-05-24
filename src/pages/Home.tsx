import React from "react";
import { useQuery } from "react-query";
import Banner from "../components/Banner";
import AnimeCarousel from "../components/AnimeCarousel";
import { getTopAnime, getLatestAnime, getSeasonalAnime } from "../services/api";
// import type { Anime } from '../types/anime';

const Home: React.FC = () => {
  // Fetch top airing anime for the banner
  const { data: topAiringData, isLoading: isLoadingTopAiring } = useQuery(
    ["topAiring"],
    () => getTopAnime("airing", 10),
    {
      select: (data) => data.data,
    }
  );

  // Fetch popular anime
  const { data: popularAnimeData, isLoading: isLoadingPopular } = useQuery(
    ["popular"],
    () => getTopAnime("bypopularity", 20),
    {
      select: (data) => data.data,
    }
  );

  // Fetch latest anime
  const { data: latestAnimeData, isLoading: isLoadingLatest } = useQuery(
    ["latest"],
    () => getLatestAnime(20),
    {
      select: (data) => data.data,
    }
  );

  // Fetch seasonal anime
  const { data: seasonalAnimeData, isLoading: isLoadingSeasonal } = useQuery(
    ["seasonal"],
    () => getSeasonalAnime(),
    {
      select: (data) => data.data,
    }
  );

  return (
    <main>
      {/* Hero Banner */}
      <Banner animeList={topAiringData || []} isLoading={isLoadingTopAiring} />

      <div className="container-custom pt-10">
        {/* Latest Anime Section */}
        <AnimeCarousel
          title="Latest Anime"
          animeList={latestAnimeData || []}
          isLoading={isLoadingLatest}
          viewAllLink="/latest"
        />

        {/* Most Popular Anime Section */}
        <AnimeCarousel
          title="Most Popular"
          animeList={popularAnimeData || []}
          isLoading={isLoadingPopular}
          viewAllLink="/popular"
        />

        {/* Seasonal Anime Section */}
        <AnimeCarousel
          title="Seasonal Anime"
          animeList={seasonalAnimeData || []}
          isLoading={isLoadingSeasonal}
          viewAllLink="/seasonal"
        />
      </div>
    </main>
  );
};

export default Home;
