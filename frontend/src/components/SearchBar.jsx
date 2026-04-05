// ============================================
// FILE: frontend/src/components/SearchBar.jsx
// City search input with geolocation button
// ============================================

import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

/**
 * SearchBar
 * Props:
 *   onSearch(city)    — called when user submits a city name
 *   onLocate()        — called when user clicks the location button
 *   loading           — disables the form while a request is in-flight
 */
export default function SearchBar({ onSearch, onLocate, loading }) {
  const [value, setValue]           = useState("");
  const [locating, setLocating]     = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onLocate(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        alert("Unable to retrieve your location. Please allow location access.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full max-w-2xl mx-auto"
    >
      {/* ── Search input ─────────────────────────────────────────────────── */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search city… e.g. Tokyo, London, New York"
          disabled={loading}
          className="
            w-full pl-11 pr-4 py-3.5
            glass rounded-2xl
            text-white font-body text-sm
            transition-all duration-200
            focus:ring-2 focus:ring-white/25
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
      </div>

      {/* ── Search button ────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="
          flex items-center justify-center gap-2
          px-5 py-3.5 rounded-2xl
          bg-white/15 hover:bg-white/25
          border border-white/20
          text-white text-sm font-medium
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95
        "
      >
        {loading ? (
          <Loader2 size={18} className="spinner-ring" />
        ) : (
          <Search size={18} />
        )}
        <span className="hidden sm:inline">Search</span>
      </button>

      {/* ── Locate button ────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleLocate}
        disabled={loading || locating}
        title="Use my location"
        className="
          flex items-center justify-center
          w-12 h-12 rounded-2xl
          bg-white/10 hover:bg-white/20
          border border-white/20
          text-white
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95
        "
      >
        {locating ? (
          <Loader2 size={18} className="spinner-ring" />
        ) : (
          <MapPin size={18} />
        )}
      </button>
    </form>
  );
}
