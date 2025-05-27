import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'favoriteAnimeIds';

/**
 * Reads favorite anime IDs from Local Storage.
 * @returns {number[]} Array of favorite anime IDs.
 */
const getFavoritesFromStorage = (): number[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error reading favorites from local storage:', error);
    return [];
  }
};

/**
 * Writes favorite anime IDs to Local Storage.
 * @param {number[]} favorites Array of favorite anime IDs.
 */
const saveFavoritesToStorage = (favorites: number[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to local storage:', error);
  }
};

/**
 * Custom hook to manage favorite anime IDs using Local Storage.
 * Provides the list of favorite IDs and functions to add/remove favorites.
 */
export const useFavorites = () => {
  // Initialize state directly from local storage
  const [favoriteIds, setFavoriteIds] = useState<number[]>(getFavoritesFromStorage);

  // Effect to update local storage whenever favoriteIds state changes
  // This ensures consistency if the state is updated from multiple places (though unlikely here)
  useEffect(() => {
    saveFavoritesToStorage(favoriteIds);
  }, [favoriteIds]);

  /**
   * Adds an anime ID to the favorites list.
   * @param {number} animeId The ID of the anime to add.
   */
  const addFavorite = useCallback((animeId: number) => {
    setFavoriteIds((prevFavorites) => {
      // Avoid duplicates
      if (prevFavorites.includes(animeId)) {
        return prevFavorites;
      }
      const updatedFavorites = [...prevFavorites, animeId];
      // Note: The useEffect above handles saving to storage
      return updatedFavorites;
    });
  }, []);

  /**
   * Removes an anime ID from the favorites list.
   * @param {number} animeId The ID of the anime to remove.
   */
  const removeFavorite = useCallback((animeId: number) => {
    setFavoriteIds((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((id) => id !== animeId);
      // Note: The useEffect above handles saving to storage
      return updatedFavorites;
    });
  }, []);

  /**
   * Checks if an anime ID is in the favorites list.
   * @param {number} animeId The ID of the anime to check.
   * @returns {boolean} True if the anime is a favorite, false otherwise.
   */
  const isFavorite = useCallback((animeId: number): boolean => {
    return favoriteIds.includes(animeId);
  }, [favoriteIds]);

  return { favoriteIds, addFavorite, removeFavorite, isFavorite };
};

