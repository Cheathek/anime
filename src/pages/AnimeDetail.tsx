import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import RelatedAnimeCards from "../components/RelatedAnimeCards";

import {
  Calendar,
  ChevronLeft,
  Clock,
  ExternalLink,
  Monitor,
  Star,
  Users,
} from "lucide-react";
import { getAnimeById, getAnimeCharacters } from "../services/api";
import { cn } from "../utils/helpers";
import YouTubeEmbed from "../components/YouTubeEmbed";
import LoadingSkeleton from "../components/LoadingSkeleton";
import GenreTag from "../components/GenreTag";
import CharacterList from "../components/CharacterList";

// Define basic types for the component
interface RelatedEntry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface AnimeData {
  mal_id: number;
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  status: string;
  airing: boolean;
  episodes: number;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  members: number;
  synopsis: string;
  aired: { string: string };
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  images: { jpg: { large_image_url: string } };
  trailer: { youtube_id: string };
  relations?: { relation: string; entry: RelatedEntry[] }[];
}

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const animeId = Number(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch anime details
  const { data: animeData, isLoading: isLoadingAnime } = useQuery(
    ["anime", animeId],
    () => getAnimeById(animeId),
    {
      enabled: !!animeId && !isNaN(animeId),
      select: (data) => data.data as AnimeData,
    }
  );

  // Fetch characters
  const { data: charactersData, isLoading: isLoadingCharacters } = useQuery(
    ["characters", animeId],
    () => getAnimeCharacters(animeId),
    {
      enabled: !!animeId && !isNaN(animeId),
      select: (data) => data.data,
    }
  );

  // Get related anime from the anime data
  const relatedAnime =
    animeData?.relations?.flatMap((relation) =>
      relation.entry.filter((entry) => entry.type === "anime")
    ) || [];

  if (isLoadingAnime) {
    return (
      <div className="container-custom pt-[calc(var(--header-height)+2rem)]">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (!animeData) {
    return (
      <div className="container-custom flex min-h-[50vh] flex-col items-center justify-center pt-[calc(var(--header-height)+2rem)]">
        <h2 className="text-2xl font-semibold">Anime Not Found</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The anime you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  const title = animeData.title_english || animeData.title;
  const imageUrl = animeData.images?.jpg?.large_image_url;

  return (
    <main className="min-h-screen pb-16 pt-[calc(var(--header-height)+2rem)]">
      {/* Background image */}
      <div className="absolute left-0 right-0 top-0 -z-10 h-[50vh]">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20 blur-xl"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
      </div>

      <div className="container-custom">
        {/* Back button */}
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

        {/* Anime Details Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Image and Stats */}
          <div className="flex flex-col gap-6">
            {/* Image */}
            <div className="overflow-hidden rounded-lg shadow-xl">
              <img
                src={imageUrl}
                alt={title}
                className="aspect-[2/3] w-full object-cover"
              />
            </div>

            {/* Stats */}
            <div className="card divide-y divide-gray-200 dark:divide-gray-700">
              <div className="flex items-center p-4">
                <Star className="mr-3 h-5 w-5 text-yellow-500" />
                <div>
                  <h3 className="font-medium">Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {animeData.score ? `${animeData.score} / 10` : "N/A"}
                    {animeData.scored_by
                      ? ` (${animeData.scored_by.toLocaleString()} users)`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4">
                <Users className="mr-3 h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="font-medium">Members</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {animeData.members
                      ? animeData.members.toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4">
                <Calendar className="mr-3 h-5 w-5 text-green-500" />
                <div>
                  <h3 className="font-medium">Aired</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {animeData.aired?.string || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4">
                <Clock className="mr-3 h-5 w-5 text-purple-500" />
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {animeData.duration || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4">
                <Monitor className="mr-3 h-5 w-5 text-pink-500" />
                <div>
                  <h3 className="font-medium">Type</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {animeData.type || "N/A"} ({animeData.episodes || "?"}{" "}
                    episodes)
                  </p>
                </div>
              </div>

              {animeData.studios && animeData.studios.length > 0 && (
                <div className="flex items-center p-4">
                  <ExternalLink className="mr-3 h-5 w-5 text-indigo-500" />
                  <div>
                    <h3 className="font-medium">Studios</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {animeData.studios
                        .map((studio) => studio.name)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Title, Description, etc. */}
          <div className="lg:col-span-2">
            {/* Title and Status */}
            <div className="mb-4">
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    animeData.airing
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  )}
                >
                  {animeData.status}
                </span>

                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {animeData.rating || "No rating available"}
                </span>
              </div>

              <h1 className="text-3xl font-semibold lg:text-4xl">{title}</h1>

              {animeData.title_japanese && (
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Japanese: {animeData.title_japanese}
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="mb-6 flex flex-wrap gap-2">
              {animeData.genres?.map((genre) => (
                <GenreTag key={genre.mal_id} name={genre.name} />
              ))}
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold">Synopsis</h2>
              <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                {animeData.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Trailer */}
            {animeData.trailer?.youtube_id && (
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-semibold">Trailer</h2>
                <YouTubeEmbed videoId={animeData.trailer.youtube_id} />
              </div>
            )}

            {/* Characters */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Characters</h2>

              {isLoadingCharacters ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="card animate-pulse flex h-24 overflow-hidden"
                    >
                      <div className="w-1/3 bg-gray-300 dark:bg-gray-800"></div>
                      <div className="w-2/3 p-3">
                        <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-800"></div>
                        <div className="mt-2 h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-800"></div>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-800"></div>
                          <div className="h-3 w-16 rounded bg-gray-300 dark:bg-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <CharacterList characters={charactersData || []} />
              )}
            </div>

            {/* Related Anime */}
            {relatedAnime.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Related Anime</h2>
                <RelatedAnimeCards relatedAnime={relatedAnime} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnimeDetail;
