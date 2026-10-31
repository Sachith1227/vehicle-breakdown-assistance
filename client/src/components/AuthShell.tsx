import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// =====================================================
// AUTH PAGE LAYOUT
// =====================================================
// Rescue-themed panel on the left (large screens),
// form content on the right.

interface AuthShellProps {
  children: ReactNode;
  wide?: boolean;
}

const promises = [
  { icon: "📍", text: "Share your exact location in one tap" },
  { icon: "🔧", text: "The nearest mechanic is notified first" },
  { icon: "🧭", text: "Watch help travel to you, live" },
];

export default function AuthShell({ children, wide = false }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">

      {/* =============================================
          RESCUE PANEL
      ============================================= */}

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white lg:flex lg:flex-col">

        <div className="hero-grid absolute inset-0" />
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-rescue-500/25 blur-3xl" />

        <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">

          <Link to="/" className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-white p-0.5">
              <img src="/roadrescue-logo.png" alt="RoadRescue logo" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <p className="text-xl font-extrabold">RoadRescue</p>
              <p className="text-xs text-blue-200/80">Your Ride, Our Rescue.</p>
            </div>
          </Link>

          <div>
            <img
              src="/roadrescue-logo.png"
              alt=""
              className="mb-8 h-40 w-40 animate-float rounded-full bg-white p-1.5 shadow-2xl shadow-blue-900/50"
            />

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
              Wherever you break down,
              <br />
              <span className="bg-gradient-to-r from-rescue-400 to-amber-300 bg-clip-text text-transparent">
                we've got your back.
              </span>
            </h2>

            <ul className="mt-8 space-y-4">
              {promises.map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-blue-50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-blue-100/50">
            © 2026 RoadRescue. Vehicle Breakdown Assistance.
          </p>

        </div>

        <div className="relative bg-slate-800 py-2">
          <div className="road-line animate-road" />
        </div>
      </aside>


      {/* =============================================
          FORM
      ============================================= */}

      <main className="flex min-h-screen items-start justify-center px-4 py-8 sm:py-12 lg:items-center">
        <div className={`w-full animate-fade-up ${wide ? "max-w-2xl" : "max-w-md"}`}>
          {children}
        </div>
      </main>

    </div>
  );
}
