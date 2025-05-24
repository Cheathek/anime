import axios from 'axios';
import type { AnimeResponse, AnimeDetailResponse, CharactersResponse } from '../types/anime';

const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Jikan API has rate limiting (4 requests per second)
// This helper adds delay between requests if needed
const rateLimit = () => new Promise(resolve => setTimeout(resolve, 250));

export const getTopAnime = async (filter: string = 'airing', limit: number = 12, page: number = 1) => {
  await rateLimit();
  const response = await api.get<AnimeResponse>(`/top/anime`, {
    params: { filter, limit, page }
  });
  return response.data;
};

export const getSeasonalAnime = async (year: number = new Date().getFullYear(), season: string = 'now', limit: number = 12) => {
  await rateLimit();
  const response = await api.get<AnimeResponse>(`/seasons/${season !== 'now' ? year + '/' + season : 'now'}`, {
    params: { limit }
  });
  return response.data;
};

export const getLatestAnime = async (limit: number = 12) => {
  await rateLimit();
  const response = await api.get<AnimeResponse>('/anime', {
    params: { 
      order_by: 'start_date', 
      sort: 'desc',
      limit,
      status: 'airing'
    }
  });
  return response.data;
};

export const searchAnime = async (query: string, page: number = 1, limit: number = 20) => {
  if (!query.trim()) return { data: [], pagination: { has_next_page: false } };
  
  await rateLimit();
  const response = await api.get<AnimeResponse>('/anime', {
    params: { q: query, page, limit }
  });
  return response.data;
};

export const getAnimeById = async (id: number) => {
  await rateLimit();
  const response = await api.get<AnimeDetailResponse>(`/anime/${id}/full`);
  return response.data;
};

export const getAnimeCharacters = async (id: number) => {
  await rateLimit();
  const response = await api.get<CharactersResponse>(`/anime/${id}/characters`);
  return response.data;
};

export const getRelatedAnime = async (id: number) => {
  // This data is already included in the full anime endpoint
  const response = await getAnimeById(id);
  return response.data.relations || [];
};