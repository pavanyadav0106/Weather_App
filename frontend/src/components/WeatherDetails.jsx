// ============================================
// FILE: frontend/src/components/WeatherDetails.jsx
// Extra weather details: UV, humidity bar, wind compass
// ============================================

import { Droplets, Wind, Navigation } from "lucide-react";

/** Circular compass showing wind direction */
function WindCompass({ deg }) {
  return (
    <div className="relative w-16 h-16 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-white/15" />
      {/* Cardinal labels */}
      {[
        { label: "N", x: "50%", y: "6%"  },
        { label: "S", x: "50%", y: "88%" },
        { label: "E", x: "82%", y: "50%" },
        { label: "W", x: "10%", y: "50%" },
      ].map(({ label, x, y }) => (
        <span
          key={label}
          className="absolute text-[8px] text-white/30 font-mono -translate-x-1/2 -translate-y-1/2"
          style={{ left: x, top: y }}
        >
          {label}
        </span>
      ))}
      {/* Arrow */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `rotate(${deg}deg)` }}
      >
        <Navigation size={16} className="text-sky-300 fill-sky-300/40" />
      </div>
    </div>
  );
}

/** Horizontal progress bar */
function Bar({ value, max = 100, color = "bg-sky-400" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * WeatherDetails
 * Props:
 *   data — current weather object
 */
export default function WeatherDetails({ data }) {
  if (!data) return null;

  return (
    <div className="glass-strong rounded-3xl p-5 md:p-6 animate-slide-up">
      <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">
        Details
      </h2>

      <div className="grid grid-cols-1 gap-4">

        {/* ── Humidity ──────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets size={14} className="text-sky-300" />
              <span className="text-white/60 text-xs uppercase tracking-wider">Humidity</span>
            </div>
            <span className="font-display font-bold text-white text-sm">{data.humidity}%</span>
          </div>
          <Bar value={data.humidity} color="bg-sky-400" />
          <p className="text-white/30 text-[10px] mt-1.5">
            {data.humidity < 30 ? "Dry" : data.humidity < 60 ? "Comfortable" : "Humid"}
          </p>
        </div>

        {/* ── Wind ──────────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-4 flex items-center gap-4">
          <WindCompass deg={data.windDeg} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Wind size={14} className="text-violet-300" />
              <span className="text-white/60 text-xs uppercase tracking-wider">Wind</span>
            </div>
            <p className="font-display font-bold text-white text-xl">
              {data.windSpeed} <span className="text-sm font-normal text-white/50">m/s</span>
            </p>
            <p className="text-white/40 text-xs mt-0.5">
              {data.windDeg}° &bull; {
                data.windSpeed < 0.5 ? "Calm"
                : data.windSpeed < 5  ? "Light breeze"
                : data.windSpeed < 10 ? "Moderate wind"
                : "Strong wind"
              }
            </p>
          </div>
        </div>

        {/* ── Visibility ────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs uppercase tracking-wider">Visibility</span>
            <span className="font-display font-bold text-white text-sm">{data.visibility} km</span>
          </div>
          <Bar value={data.visibility} max={10} color="bg-emerald-400" />
          <p className="text-white/30 text-[10px] mt-1.5">
            {data.visibility >= 10 ? "Excellent" : data.visibility >= 5 ? "Good" : "Poor"}
          </p>
        </div>

        {/* ── Pressure ──────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/60 text-xs uppercase tracking-wider">Pressure</span>
            <span className="font-display font-bold text-white text-sm">{data.pressure} hPa</span>
          </div>
          <p className="text-white/30 text-[10px]">
            {data.pressure > 1013 ? "High pressure – likely clear" : "Low pressure – possible clouds"}
          </p>
        </div>

      </div>
    </div>
  );
}
