// ============================================
// FILE: frontend/src/components/Header.jsx
// App header with branding and clock
// ============================================

import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";

export default function Header() {
  const [time, setTime] = useState(new Date());

  // Live clock — updates every second
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour:   "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
  });

  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in">
      {/* Branding */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 glass rounded-xl flex items-center justify-center">
          <Cloud size={18} className="text-sky-300" />
        </div>
        <div>
          <h1 className="font-display text-xl font-extrabold text-white tracking-tight leading-none">
            SkyCast
          </h1>
          <p className="text-white/35 text-[10px] tracking-widest uppercase leading-none mt-0.5">
            Weather Dashboard
          </p>
        </div>
      </div>

      {/* Live clock */}
      <div className="text-right hidden sm:block">
        <p className="font-mono text-white text-base font-medium tracking-wider">
          {timeStr}
        </p>
        <p className="text-white/40 text-xs">{dateStr}</p>
      </div>
    </header>
  );
}
