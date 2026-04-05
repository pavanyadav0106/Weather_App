// ============================================
// FILE: frontend/src/components/TemperatureChart.jsx
// 24-hour / multi-day temperature chart using Recharts
// ============================================

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/** Custom tooltip rendered inside the chart */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass rounded-xl px-3 py-2.5 text-xs">
      <p className="text-white/60 mb-1 font-mono">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-semibold">
          {entry.name}: {entry.value}°C
        </p>
      ))}
    </div>
  );
}

/**
 * Flatten forecast days into hourly data points for the chart.
 * Takes up to 8 slots (24 h) from the first day's hourly array,
 * then fills remaining days with daily max/min.
 */
function buildChartData(forecast) {
  if (!forecast?.days?.length) return [];

  const points = [];

  forecast.days.forEach((day) => {
    // Use hourly slots if available (first day usually has them)
    if (day.hourly?.length) {
      day.hourly.forEach((h) => {
        const label = new Date(h.dt * 1000).toLocaleTimeString("en-US", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        points.push({
          time: label,
          Temp:    h.temperature,
          "Feels like": h.feelsLike,
        });
      });
    } else {
      const label = new Date(day.date + "T12:00:00Z").toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      });
      points.push({
        time: label,
        Temp:    day.tempMax,
        "Feels like": day.tempMin,
      });
    }
  });

  // Limit to 40 points for readability
  return points.slice(0, 40);
}

/**
 * TemperatureChart
 * Props:
 *   forecast — forecast object from backend
 */
export default function TemperatureChart({ forecast }) {
  const data = buildChartData(forecast);
  if (!data.length) return null;

  return (
    <div className="glass-strong rounded-3xl p-5 md:p-6 animate-slide-up">
      <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">
        Temperature Chart
      </h2>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            {/* Gradient fills for areas */}
            <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="gradFeels" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10, fontFamily: "DM Mono" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10, fontFamily: "DM Mono" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}°`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 11,
              fontFamily: "DM Sans",
            }}
          />

          <Area
            type="monotone"
            dataKey="Temp"
            stroke="#60a5fa"
            strokeWidth={2.5}
            fill="url(#gradTemp)"
            dot={false}
            activeDot={{ r: 4, fill: "#93c5fd" }}
          />

          <Area
            type="monotone"
            dataKey="Feels like"
            stroke="#a78bfa"
            strokeWidth={2}
            fill="url(#gradFeels)"
            dot={false}
            activeDot={{ r: 4, fill: "#c4b5fd" }}
            strokeDasharray="4 2"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
