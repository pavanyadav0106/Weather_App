// ============================================
// FILE: frontend/src/hooks/useFavorites.js
// Manages favourite cities stored in localStorage
// ============================================

import { useState, useCallback } from "react";

const STORAGE_KEY = "skycast_favorites";

/**
 * useFavorites — persists a list of favourite city names in localStorage.
 *
 * Returns:
 *   favorites        — string[]
 *   addFavorite(city)
 *   removeFavorite(city)
 *   isFavorite(city) — boolean
 *   toggleFavorite(city)
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const persist = (updated) => {
    setFavorites(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage quota or private-mode issue — silently fail
    }
  };

  const addFavorite = useCallback((city) => {
    setFavorites((prev) => {
      if (prev.includes(city)) return prev;
      const updated = [city, ...prev].slice(0, 10); // cap at 10
      persist(updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((city) => {
    setFavorites((prev) => {
      const updated = prev.filter((c) => c !== city);
      persist(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (city) => favorites.includes(city),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (city) => {
      if (favorites.includes(city)) removeFavorite(city);
      else addFavorite(city);
    },
    [favorites, addFavorite, removeFavorite]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
