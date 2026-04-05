// ============================================
// FILE: frontend/src/components/ForecastCard.jsx
// 5-day forecast strip
// ============================================

import { Droplets } from "lucide-react";

/** Format "2024-12-25" → "Wed 25" */
function formatDay(dateStr) {
  const date = new Date(dateStr + "T12:00:00Z");
  const today = new Date().toISOString().slice(0, 10);
  if (dateStr === today) return "Today";
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
}

/**
 * ForecastCard
 * Props:
 *   forecast — { days: [] } object from backend
 */
export default function ForecastCard({ forecast }) {
  if (!forecast?.days?.length) return null;

  return (
    <div className="glass-strong rounded-3xl p-5 md:p-6 animate-slide-up">
      <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
        5-Day Forecast
      </h2>

      <div className="flex flex-col gap-2">
        {forecast.days.map((day, idx) => (
          <div
            key={day.date}
            className="
              glass glass-hover rounded-2xl
              flex items-center justify-between
              px-4 py-3 gap-3
            "
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Day label */}
            <span className="font-display text-sm font-semibold text-white/80 w-20 shrink-0">
              {formatDay(day.date)}
            </span>

            {/* Icon + description */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img src={day.iconUrl} alt={day.description} className="w-9 h-9 shrink-0" />
              <span className="text-white/55 text-xs capitalize truncate hidden sm:block">
                {day.description}
              </span>
            </div>

            {/* Precipitation */}
            <div className="flex items-center gap-1 text-sky-300 w-12 shrink-0">
              <Droplets size={12} />
              <span className="font-mono text-xs">{day.pop}%</span>
            </div>

            {/* Temp range */}
            <div className="text-right shrink-0">
              <span className="font-display text-base font-bold text-white">{day.tempMax}°</span>
              <span className="text-white/40 text-sm"> / {day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
