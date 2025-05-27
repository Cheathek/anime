// src/hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'favoriteAnimeIds';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [pendingFetches, setPendingFetches] = useState<Record<number, boolean>>({});

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const addFavorite = useCallback((animeId: number) => {
    setFavoriteIds(prev => {
      if (prev.includes(animeId)) return prev;
      return [...prev, animeId];
    });
    setPendingFetches(prev => ({ ...prev, [animeId]: true }));
  }, []);

  const removeFavorite = useCallback((animeId: number) => {
    setFavoriteIds(prev => prev.filter(id => id !== animeId));
    setPendingFetches(prev => ({ ...prev, [animeId]: false }));
  }, []);

  const markFetched = useCallback((animeId: number) => {
    setPendingFetches(prev => {
      const newState = { ...prev };
      delete newState[animeId];
      return newState;
    });
  }, []);

  const isFavorite = useCallback((animeId: number) => {
    return favoriteIds.includes(animeId);
  }, [favoriteIds]);

  return {
    favoriteIds,
    pendingFetches,
    addFavorite,
    removeFavorite,
    markFetched,
    isFavorite
  };
};