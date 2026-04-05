// ============================================
// FILE: frontend/src/components/LoadingSpinner.jsx
// Full-screen animated loading overlay
// ============================================

export default function LoadingSpinner({ message = "Fetching weather data…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 animate-fade-in">
      {/* Concentric spinning rings */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/10 border-t-sky-400 spinner-ring"
          style={{ animationDuration: "1s" }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-white/10 border-t-blue-400 spinner-ring"
          style={{ animationDuration: "0.75s", animationDirection: "reverse" }}
        />
        {/* Inner dot */}
        <div className="absolute inset-5 rounded-full bg-sky-400/30 animate-pulse-slow" />
      </div>

      <div className="text-center">
        <p className="text-white/70 text-sm font-medium">{message}</p>
        <p className="text-white/35 text-xs mt-1">This may take a moment</p>
      </div>
    </div>
  );
}
