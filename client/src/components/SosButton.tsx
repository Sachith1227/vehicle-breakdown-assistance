import { Link } from "react-router-dom";

// =====================================================
// PULSING SOS BUTTON
// =====================================================

interface SosButtonProps {
  to: string;
  label?: string;
  size?: "md" | "lg";
}

export default function SosButton({
  to,
  label = "Get Help Now",
  size = "lg",
}: SosButtonProps) {
  const dimensions = size === "lg" ? "h-40 w-40" : "h-32 w-32";

  return (
    <Link
      to={to}
      aria-label={label}
      className="group relative inline-flex items-center justify-center"
    >
      {/* Expanding rings */}
      <span className={`absolute ${dimensions} rounded-full bg-rescue-500 animate-sos-ring`} />
      <span
        className={`absolute ${dimensions} rounded-full bg-rescue-500 animate-sos-ring`}
        style={{ animationDelay: "1s" }}
      />

      <span
        className={`relative flex ${dimensions} flex-col items-center justify-center rounded-full bg-gradient-to-br from-rescue-400 to-rescue-600 text-white shadow-2xl shadow-rescue-500/40 ring-8 ring-white/10 transition duration-300 group-hover:scale-105 group-active:scale-95`}
      >
        <span className="text-4xl font-extrabold tracking-wider">SOS</span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/90">
          {label}
        </span>
      </span>
    </Link>
  );
}
