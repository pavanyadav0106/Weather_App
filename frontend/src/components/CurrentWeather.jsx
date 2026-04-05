// ============================================
// FILE: frontend/src/components/CurrentWeather.jsx
// Hero card displaying current conditions
// ============================================

import { Heart, Wind, Droplets, Eye, Gauge, Thermometer } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert Unix timestamp + timezone offset to a formatted time string */
function formatTime(unix, timezoneOffset) {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toUTCString().slice(17, 22); // "HH:MM"
}

/** Convert wind degrees to compass direction */
function windDirection(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

/** Tiny stat pill */
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
      <Icon size={14} className="text-white/50 shrink-0" />
      <div>
        <p className="text-white/45 text-[10px] uppercase tracking-widest leading-none mb-0.5">{label}</p>
        <p className="text-white text-sm font-medium leading-none">{value}</p>
      </div>
    </div>
  );
}

/**
 * CurrentWeather
 * Props:
 *   data          — transformed current weather object from backend
 *   isFavorite    — boolean
 *   onToggleFav   — () => void
 */
export default function CurrentWeather({ data, isFavorite, onToggleFav }) {
  if (!data) return null;

  const sunrise = formatTime(data.sunrise, data.timezone);
  const sunset  = formatTime(data.sunset,  data.timezone);

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 animate-slide-up relative overflow-hidden">

      {/* Decorative blurred blob */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #90caf9, transparent)" }}
      />

      {/* ── Header: city + favourite ──────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            {data.city}
          </h1>
          <p className="text-white/55 text-sm mt-0.5">
            {data.country} &bull; {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        <button
          onClick={onToggleFav}
          title={isFavorite ? "Remove from favourites" : "Add to favourites"}
          className="
            flex items-center justify-center w-10 h-10
            glass rounded-xl transition-all duration-200
            hover:bg-white/20 active:scale-90
          "
        >
          <Heart
            size={18}
            className={isFavorite ? "fill-rose-400 text-rose-400" : "text-white/50"}
          />
        </button>
      </div>

      {/* ── Main temp + icon ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={data.iconUrl}
          alt={data.description}
          className="w-20 h-20 drop-shadow-lg animate-float"
        />
        <div>
          <div className="flex items-start gap-1">
            <span className="font-display text-7xl font-extrabold text-white leading-none">
              {data.temperature}
            </span>
            <span className="font-display text-3xl font-light text-white/60 mt-2">°C</span>
          </div>
          <p className="text-white/70 text-base capitalize mt-1">{data.description}</p>
          <p className="text-white/45 text-xs mt-0.5">
            Feels like {data.feelsLike}°C &bull; {data.tempMin}° / {data.tempMax}°
          </p>
        </div>
      </div>

      {/* ── Stats grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
        <Stat icon={Droplets}    label="Humidity"    value={`${data.humidity}%`} />
        <Stat icon={Wind}        label="Wind"        value={`${data.windSpeed} m/s ${windDirection(data.windDeg)}`} />
        <Stat icon={Eye}         label="Visibility"  value={`${data.visibility} km`} />
        <Stat icon={Gauge}       label="Pressure"    value={`${data.pressure} hPa`} />
        <Stat icon={Thermometer} label="Feels like"  value={`${data.feelsLike}°C`} />
        <Stat icon={Wind}        label="Wind dir."   value={`${data.windDeg}° ${windDirection(data.windDeg)}`} />
      </div>

      {/* ── Sunrise / Sunset ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 flex-1 justify-center">
          <span className="text-lg">🌅</span>
          <div>
            <p className="text-white/45 text-[10px] uppercase tracking-widest">Sunrise</p>
            <p className="text-white font-mono text-sm font-medium">{sunrise}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 flex-1 justify-center">
          <span className="text-lg">🌇</span>
          <div>
            <p className="text-white/45 text-[10px] uppercase tracking-widest">Sunset</p>
            <p className="text-white font-mono text-sm font-medium">{sunset}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
