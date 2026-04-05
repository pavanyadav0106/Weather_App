// ============================================
// FILE: frontend/src/components/FavoritesPanel.jsx
// Sidebar panel showing saved favourite cities
// ============================================

import { X, Star, MapPin } from "lucide-react";

/**
 * FavoritesPanel
 * Props:
 *   favorites       — string[] of city names
 *   onSelect(city)  — called when user clicks a favourite
 *   onRemove(city)  — called when user removes a favourite
 *   currentCity     — currently displayed city (for highlight)
 */
export default function FavoritesPanel({ favorites, onSelect, onRemove, currentCity }) {
  return (
    <div className="glass-strong rounded-3xl p-5 animate-slide-up">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <Star size={15} className="text-amber-400 fill-amber-400" />
        <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-widest">
          Favourites
        </h2>
        <span className="ml-auto glass rounded-full px-2 py-0.5 text-white/50 text-xs font-mono">
          {favorites.length}/10
        </span>
      </div>

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {favorites.length === 0 && (
        <div className="text-center py-6">
          <MapPin size={28} className="text-white/20 mx-auto mb-2" />
          <p className="text-white/35 text-sm">No favourites yet.</p>
          <p className="text-white/25 text-xs mt-1">
            Click the ♥ on any city to save it.
          </p>
        </div>
      )}

      {/* ── List ────────────────────────────────────────────────────── */}
      <ul className="flex flex-col gap-1.5">
        {favorites.map((city) => {
          const isActive = city === currentCity;
          return (
            <li key={city} className="flex items-center gap-2 group">
              <button
                onClick={() => onSelect(city)}
                className={`
                  flex-1 text-left px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-150
                  ${isActive
                    ? "bg-white/20 text-white"
                    : "glass text-white/70 hover:bg-white/12 hover:text-white"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <MapPin size={13} className={isActive ? "text-sky-300" : "text-white/30"} />
                  {city}
                </span>
              </button>

              {/* Remove button */}
              <button
                onClick={() => onRemove(city)}
                title="Remove"
                className="
                  opacity-0 group-hover:opacity-100
                  flex items-center justify-center
                  w-7 h-7 rounded-lg glass
                  text-white/40 hover:text-rose-400
                  transition-all duration-150
                  shrink-0
                "
              >
                <X size={13} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
