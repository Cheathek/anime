import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAnimeById } from "../services/api";

interface RelatedEntry {
  mal_id: number;
  type: string;
  name: string;
}

interface AnimeInfo {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  score?: number;
  type: string;
}

interface Props {
  relatedAnime: RelatedEntry[];
}

const RelatedAnimeCards: React.FC<Props> = ({ relatedAnime }) => {
  const [details, setDetails] = useState<Record<number, AnimeInfo>>({});
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const limitedAnime = relatedAnime.slice(0, 4); // Limit to 4 to reduce API calls

    const fetchWithDelay = async () => {
      setIsLoading(true);
      setLoadedCount(0);

      for (let i = 0; i < limitedAnime.length; i++) {
        try {
          // Wait longer between requests (1 second)
          if (i > 0) await new Promise((r) => setTimeout(r, 1000));

          const res = await getAnimeById(limitedAnime[i].mal_id);

          setDetails((prev) => ({
            ...prev,
            [limitedAnime[i].mal_id]: res.data,
          }));

          setLoadedCount(i + 1);
        } catch (err) {
          console.log(`Failed to fetch anime ${limitedAnime[i].mal_id}`);
          setLoadedCount(i + 1);
        }
      }

      setIsLoading(false);
    };

    if (limitedAnime.length) {
      fetchWithDelay();
    } else {
      setIsLoading(false);
    }
  }, [relatedAnime]);

  const limitedAnime = relatedAnime.slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {limitedAnime.map((anime, index) => {
        const info = details[anime.mal_id];
        const isLoaded = index < loadedCount;

        return (
          <Link
            key={anime.mal_id}
            to={`/anime/${anime.mal_id}`}
            className="card h-32 flex hover:shadow-lg transition-shadow group"
          >
            <div className="w-1/3 overflow-hidden bg-gray-200 dark:bg-gray-700">
              {isLoaded && info?.images?.jpg?.image_url ? (
                <img
                  src={info.images.jpg.image_url}
                  alt={info.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {isLoading && index >= loadedCount ? (
                    <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <span className="text-xs text-gray-500">No Image</span>
                  )}
                </div>
              )}
            </div>

            <div className="w-2/3 p-3 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {info?.title || anime.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {info?.type || anime.type}
                </p>
              </div>

              {info?.score && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-xs">{info.score}</span>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RelatedAnimeCards;
