// ============================================
// FILE: frontend/src/components/ErrorMessage.jsx
// Dismissible error banner
// ============================================

import { AlertTriangle, X } from "lucide-react";

/**
 * ErrorMessage
 * Props:
 *   message   — string to display
 *   onDismiss — () => void
 */
export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className="
        flex items-start gap-3
        glass rounded-2xl px-4 py-3.5
        border border-rose-400/30
        bg-rose-500/10
        animate-slide-up
      "
      role="alert"
    >
      <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />

      <p className="text-rose-200 text-sm flex-1 leading-snug">{message}</p>

      <button
        onClick={onDismiss}
        className="text-rose-400/60 hover:text-rose-300 transition-colors shrink-0"
        aria-label="Dismiss error"
      >
        <X size={16} />
      </button>
    </div>
  );
}
