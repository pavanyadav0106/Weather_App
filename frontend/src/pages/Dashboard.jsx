// ============================================
// FILE: frontend/src/pages/Dashboard.jsx
// Main weather dashboard page — composes all components
// ============================================

import { useEffect } from "react";

import { useWeather }   from "../hooks/useWeather";
import { useFavorites } from "../hooks/useFavorites";

import Header           from "../components/Header";
import SearchBar        from "../components/SearchBar";
import CurrentWeather   from "../components/CurrentWeather";
import ForecastCard     from "../components/ForecastCard";
import TemperatureChart from "../components/TemperatureChart";
import WeatherDetails   from "../components/WeatherDetails";
import FavoritesPanel   from "../components/FavoritesPanel";
import LoadingSpinner   from "../components/LoadingSpinner";
import ErrorMessage     from "../components/ErrorMessage";
import EmptyState       from "../components/EmptyState";

export default function Dashboard() {
  // ── Data layer ─────────────────────────────────────────────────────────────
  const {
    current, forecast, loading, error,
    fetchByCity, fetchByCoords, clearError,
  } = useWeather();

  const { favorites, toggleFavorite, isFavorite, removeFavorite } = useFavorites();

  // ── On mount: load last-viewed city from sessionStorage ───────────────────
  useEffect(() => {
    const last = sessionStorage.getItem("skycast_last_city");
    if (last) fetchByCity(last);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist last city so it reloads on page refresh ───────────────────────
  useEffect(() => {
    if (current?.city) sessionStorage.setItem("skycast_last_city", current.city);
  }, [current?.city]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = (city) => {
    clearError();
    fetchByCity(city);
  };

  const handleLocate = (lat, lon) => {
    clearError();
    fetchByCoords(lat, lon);
  };

  const handleFavSelect = (city) => {
    clearError();
    fetchByCity(city);
  };

  const hasData = !!(current && forecast);

  return (
    <div className="sky-bg">
      {/* Floating star particles (purely decorative) */}
      <Stars />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <Header />

        {/* ── Search bar ─────────────────────────────────────────────── */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            onLocate={handleLocate}
            loading={loading}
          />
        </div>

        {/* ── Error banner ───────────────────────────────────────────── */}
        {error && (
          <div className="mb-5">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        {/* ── Loading ────────────────────────────────────────────────── */}
        {loading && <LoadingSpinner />}

        {/* ── Empty / welcome state ──────────────────────────────────── */}
        {!loading && !hasData && !error && (
          <EmptyState onSearch={handleSearch} />
        )}

        {/* ── Main dashboard grid ────────────────────────────────────── */}
        {!loading && hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── Left column: current weather + details ─────────────── */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              <CurrentWeather
                data={current}
                isFavorite={isFavorite(current.city)}
                onToggleFav={() => toggleFavorite(current.city)}
              />
              <WeatherDetails data={current} />
            </div>

            {/* ── Right column: forecast + chart + favourites ─────────── */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <ForecastCard forecast={forecast} />
              <TemperatureChart forecast={forecast} />
              <FavoritesPanel
                favorites={favorites}
                onSelect={handleFavSelect}
                onRemove={removeFavorite}
                currentCity={current?.city}
              />
            </div>

          </div>
        )}

        {/* ── Favourites panel shown in empty state too ──────────────── */}
        {!loading && !hasData && favorites.length > 0 && (
          <div className="max-w-sm mx-auto mt-6">
            <FavoritesPanel
              favorites={favorites}
              onSelect={handleFavSelect}
              onRemove={removeFavorite}
              currentCity={null}
            />
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="text-center mt-10 text-white/20 text-xs">
          Powered by OpenWeatherMap &bull; Built with React + Vite + Node.js
        </footer>
      </div>
    </div>
  );
}

// ── Decorative star field ─────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top:  `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: `${Math.random() * 4}s`,
    duration: `${Math.random() * 3 + 2}s`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: Math.random() * 0.5 + 0.1,
            animation: `pulse ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
