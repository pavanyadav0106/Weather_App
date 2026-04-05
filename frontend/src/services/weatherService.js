// ============================================
// FILE: frontend/src/services/weatherService.js
// Axios wrappers for all backend API calls
// ============================================

import axios from "axios";

// Axios instance — all requests go to /api (proxied to backend via Vite)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  timeout: 12000,
});

// ── Response interceptor: unwrap data or throw clean error ────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

// ── API Functions ─────────────────────────────────────────────────────────────

/**
 * Fetch current weather for a named city.
 * @param {string} city
 * @returns {Promise<object>} Transformed current weather object
 */
export const getCurrentWeather = (city) =>
  api.get("/weather/current", { params: { city } });

/**
 * Fetch 5-day forecast for a named city.
 * @param {string} city
 * @returns {Promise<object>} Forecast object with `days` array
 */
export const getForecast = (city) =>
  api.get("/weather/forecast", { params: { city } });

/**
 * Fetch current weather + forecast by GPS coordinates.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object>} { current, forecast }
 */
export const getWeatherByLocation = (lat, lon) =>
  api.get("/weather/location", { params: { lat, lon } });

export default api;
