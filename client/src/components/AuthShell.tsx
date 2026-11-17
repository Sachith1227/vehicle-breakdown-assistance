import type { ReactNode } from "react";
import { MapPin, Navigation, Wrench } from "lucide-react";
import BackButton from "./BackButton";

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
  { Icon: MapPin, text: "Share your exact location in one tap" },
  { Icon: Wrench, text: "The nearest mechanic is notified first" },
  { Icon: Navigation, text: "Watch help travel to you, live" },
];

export default function AuthShell({ children, wide = false }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

      {/* =============================================
          RESCUE PANEL
      ============================================= */}

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start lg:flex-col">

        <div className="hero-grid absolute inset-0" />
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-rescue-400/30 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col gap-6 p-8 xl:p-10">



          <div>
            <img
              src="/roadrescue-logo.png"
              alt=""
              className="mb-6 h-[clamp(5rem,17dvh,10rem)] w-[clamp(5rem,17dvh,10rem)] rounded-full bg-white p-1.5 shadow-2xl shadow-blue-900/40"
            />

            <h2 className="text-[clamp(1.75rem,4.5dvh,2.5rem)] font-extrabold leading-tight tracking-tight">
              Wherever you break down,
              <br />
              <span className="text-amber-300">we've got your back.</span>
            </h2>

            <ul className="mt-6 space-y-3">
              {promises.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-white">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                    <Icon size={18} strokeWidth={2.25} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-auto text-xs text-blue-100/80">
            © 2026 RoadRescue. Vehicle Breakdown Assistance.
          </p>

        </div>

        <div className="relative bg-slate-700 py-2">
          <div className="road-line animate-road" />
        </div>
      </aside>


      {/* =============================================
          FORM
      ============================================= */}

      <main className="flex min-h-screen min-w-0 flex-col px-4 py-6 sm:px-8 lg:px-10 xl:px-14">

        <div className="mx-auto w-full max-w-2xl">
          <BackButton to="/" label="Back to home" />
        </div>

        <div className="flex flex-1 items-start justify-center py-6 lg:items-center">
          <div className={`w-full animate-fade-up ${wide ? "max-w-2xl" : "max-w-xl"}`}>
            {children}
          </div>
        </div>

      </main>

    </div>
  );
}
