// ============================================
// FILE: frontend/src/hooks/useWeather.js
// Custom hook — encapsulates all weather state + data fetching logic
// ============================================

import { useState, useCallback } from "react";
import {
  getCurrentWeather,
  getForecast,
  getWeatherByLocation,
} from "../services/weatherService";

/**
 * useWeather — central state manager for the weather dashboard.
 *
 * Returns:
 *   current    — current weather object
 *   forecast   — { days: [] } forecast object
 *   loading    — boolean
 *   error      — string | null
 *   fetchByCity(city)            — search by city name
 *   fetchByCoords(lat, lon)      — search by GPS coordinates
 *   clearError()                 — reset error state
 */
export function useWeather() {
  const [current,  setCurrent]  = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  // ── Fetch by city name ────────────────────────────────────────────────────
  const fetchByCity = useCallback(async (city) => {
    if (!city || !city.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // Run current + forecast in parallel for speed
      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(city.trim()),
        getForecast(city.trim()),
      ]);

      setCurrent(currentData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
      setCurrent(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch by GPS coordinates ──────────────────────────────────────────────
  const fetchByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByLocation(lat, lon);
      setCurrent(data.current);
      setForecast(data.forecast);
    } catch (err) {
      setError(err.message);
      setCurrent(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Clear error ───────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  return { current, forecast, loading, error, fetchByCity, fetchByCoords, clearError };
}
