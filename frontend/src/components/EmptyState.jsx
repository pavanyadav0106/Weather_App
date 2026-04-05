// ============================================
// FILE: frontend/src/components/EmptyState.jsx
// Welcome screen shown before any search is made
// ============================================

import { Cloud, Search, MapPin, Star } from "lucide-react";

const QUICK_CITIES = ["London", "Tokyo", "New York", "Sydney", "Paris", "Dubai"];

/**
 * EmptyState
 * Props:
 *   onSearch(city)  — called when user clicks a quick-city button
 */
export default function EmptyState({ onSearch }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {/* Animated cloud icon */}
      <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mb-6 animate-float">
        <span className="text-5xl">🌤️</span>
      </div>

      <h2 className="font-display text-3xl font-bold text-white mb-3">
        Welcome to SkyCast
      </h2>
      <p className="text-white/50 text-base max-w-md leading-relaxed mb-8">
        Search for any city to see real-time weather, a 5-day forecast,
        temperature charts, and more.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {[
          { icon: Search,  label: "City search"       },
          { icon: MapPin,  label: "GPS location"      },
          { icon: Star,    label: "Save favourites"   },
          { icon: Cloud,   label: "5-day forecast"    },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5"
          >
            <Icon size={13} className="text-sky-300" />
            <span className="text-white/60 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* Quick-select cities */}
      <p className="text-white/35 text-xs uppercase tracking-widest mb-3">
        Quick search
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_CITIES.map((city) => (
          <button
            key={city}
            onClick={() => onSearch(city)}
            className="
              glass glass-hover rounded-xl px-4 py-2
              text-white/70 hover:text-white
              text-sm font-medium
              transition-all duration-150 active:scale-95
            "
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
