import { Link } from "react-router-dom";
import {
  BatteryLow,
  Car,
  Check,
  Cog,
  Disc3,
  Footprints,
  Fuel,
  KeyRound,
  LifeBuoy,
  MapPin,
  Radio,
  Route,
  Ruler,
  Satellite,
  Smartphone,
  Thermometer,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import SosButton from "../components/SosButton";

// =====================================================
// CONTENT
// =====================================================

const steps = [
  {
    Icon: LifeBuoy,
    title: "Tap for help",
    text: "Pick your vehicle and tell us what's wrong. It takes under a minute.",
  },
  {
    Icon: MapPin,
    title: "Share your location",
    text: "Your GPS position is sent to nearby mechanics so they know exactly where you are.",
  },
  {
    Icon: Wrench,
    title: "Help arrives",
    text: "Track the mechanic from accepted to on the way to fixed, live.",
  },
];

const features = [
  {
    Icon: Satellite,
    title: "Precise GPS location",
    text: "High-accuracy positioning with a draggable pin, so help finds you even on rural roads.",
    tint: "bg-blue-50 text-blue-600",
  },
  {
    Icon: Route,
    title: "Route & arrival time",
    text: "See the road route from the mechanic to you, with distance and estimated travel time.",
    tint: "bg-rescue-50 text-rescue-600",
  },
  {
    Icon: Radio,
    title: "Live status updates",
    text: "Your request refreshes automatically as the mechanic accepts, travels and starts the repair.",
    tint: "bg-green-50 text-green-600",
  },
  {
    Icon: Ruler,
    title: "Nearest mechanic first",
    text: "Mechanics see requests sorted by distance, so the closest help reaches you first.",
    tint: "bg-purple-50 text-purple-600",
  },
];

const problems = [
  { Icon: BatteryLow, label: "Flat battery" },
  { Icon: Disc3, label: "Flat tyre" },
  { Icon: Cog, label: "Engine trouble" },
  { Icon: Fuel, label: "Out of fuel" },
  { Icon: KeyRound, label: "Locked out" },
  { Icon: Thermometer, label: "Overheating" },
];

const safetyTips = [
  { Icon: TriangleAlert, text: "Switch on your hazard lights" },
  { Icon: Footprints, text: "Move away from traffic if safe" },
  { Icon: TriangleAlert, text: "Place a warning triangle behind" },
  { Icon: Smartphone, text: "Keep your phone charged and on" },
];


// =====================================================
// WELCOME PAGE
// =====================================================

function WelcomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* =============================================
          NAVBAR
      ============================================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full bg-white p-0.5">
              <img
                src="/roadrescue-logo.png"
                alt="RoadRescue logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-extrabold text-white">RoadRescue</p>
              <p className="hidden text-xs text-blue-100 sm:block">
                Your Ride, Our Rescue.
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-rescue-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rescue-500/30 transition hover:bg-rescue-600 sm:px-5"
            >
              Get started
            </Link>
          </nav>

        </div>
      </header>


      <main>

        {/* =============================================
            HERO
        ============================================= */}

        <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white">

          <div className="hero-grid absolute inset-0" />
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-rescue-400/25 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-2 lg:pb-32 lg:pt-24">

            {/* Copy */}
            <div className="animate-fade-up">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                </span>
                Mechanics ready to help
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
                Broken down?
                <br />
                <span className="text-amber-300">
                  Stay calm.
                </span>{" "}
                Help is on the way.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-blue-50">
                RoadRescue connects you with the nearest mechanic in seconds.
                Share your location, describe the problem, and watch help
                come to you.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rescue-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-rescue-600/30 transition hover:-translate-y-0.5 hover:bg-rescue-600"
                >
                  <LifeBuoy size={20} />
                  Request roadside help
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white transition hover:bg-white/20"
                >
                  <Wrench size={20} />
                  Join as a mechanic
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-50">
                {["Free to use", "Live GPS tracking", "Nearest help first"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <Check size={16} className="text-amber-300" strokeWidth={3} />
                    {item}
                  </span>
                ))}
              </div>

            </div>


            {/* Live request mock-up */}
            <div className="relative mx-auto w-full max-w-md animate-float">

              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-300/40 to-rescue-400/30 blur-2xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-2xl">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Your request
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xl font-extrabold">
                      <Disc3 size={20} className="text-slate-500" />
                      Flat tyre
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                    ON THE WAY
                  </span>
                </div>

                {/* Mini map */}
                <div className="relative mt-5 h-36 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50">
                  <svg viewBox="0 0 300 140" className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <path d="M-10 110 C 60 100, 90 40, 160 60 S 260 30, 310 20" stroke="#cbd5e1" strokeWidth="14" fill="none" strokeLinecap="round" />
                    <path d="M40 104 C 80 92, 100 48, 160 60 S 230 40, 255 34" stroke="#2563eb" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="10 8" />
                  </svg>
                  <div className="absolute bottom-6 left-8 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ring-4 ring-white">
                    <Wrench size={16} />
                  </div>
                  <div className="absolute right-9 top-4">
                    <span className="absolute inset-0 animate-ping rounded-full bg-rescue-500/50" />
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-rescue-500 text-white shadow-lg ring-4 ring-white">
                      <Car size={16} />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 shadow">
                    4.2 km · 9 min
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <p className="font-bold">City Auto Care</p>
                    <p className="text-xs text-slate-500">Your mechanic is driving to you</p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-blue-600">Help is coming</span>
                    <span className="text-slate-400">Arriving soon</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full animate-progress rounded-full bg-gradient-to-r from-blue-600 to-rescue-500" />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Road */}
          <div className="relative bg-slate-700 py-3">
            <div className="road-line animate-road" />
          </div>

        </section>


        {/* =============================================
            COMMON PROBLEMS
        ============================================= */}

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-8 sm:px-6">
            <span className="mr-2 text-sm font-semibold text-slate-500">
              We help with:
            </span>
            {problems.map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
                <Icon size={16} className="text-blue-600" />
                {label}
              </span>
            ))}
          </div>
        </section>


        {/* =============================================
            HOW IT WORKS
        ============================================= */}

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-rescue-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              From stranded to sorted in 3 steps
            </h2>
            <p className="mt-4 text-slate-500">
              No phone calls, no explaining where you are. Just tap, share, and wait safely.
            </p>
          </div>

          <div className="relative mt-14 grid gap-8 md:grid-cols-3">

            <div className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-slate-200 md:block" />

            {steps.map(({ Icon, ...step }, index) => (
              <div key={step.title} className="relative text-center">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-lg ring-1 ring-slate-100">
                  <Icon size={34} strokeWidth={1.75} />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  {step.text}
                </p>
              </div>
            ))}

          </div>
        </section>


        {/* =============================================
            FEATURES
        ============================================= */}

        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">

            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Built for the roadside
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Everything you need when your vehicle lets you down
              </h2>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ Icon, ...feature }) => (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.tint} transition group-hover:scale-110`}>
                    <Icon size={26} strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-5 font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* =============================================
            SAFETY + CTA
        ============================================= */}

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 to-navy-800 px-6 py-14 text-white sm:px-14">

            <div className="hero-grid absolute inset-0" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-rescue-400/30 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">

              <div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Stuck right now?
                </h2>
                <p className="mt-4 max-w-xl text-blue-50">
                  Create a free account and send your first request in under a
                  minute. While you wait:
                </p>

                <ul className="mt-6 grid gap-3 text-sm text-white sm:grid-cols-2">
                  {safetyTips.map(({ Icon, text }) => (
                    <li key={text} className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                        <Icon size={16} className="text-amber-300" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-center py-6 lg:px-10">
                <SosButton to="/register" label="Get help" />
              </div>

            </div>
          </div>

        </section>

      </main>


      {/* =============================================
          FOOTER
      ============================================= */}

      <footer className="bg-navy-950 text-blue-100">
        <div className="road-line opacity-60" />
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/roadrescue-logo.png" alt="" className="h-8 w-8 rounded-full bg-white p-0.5" />
            <span className="font-semibold text-white">RoadRescue</span>
            <span className="hidden sm:inline">· Your Ride, Our Rescue.</span>
          </div>
          <p>© 2026 RoadRescue. Vehicle Breakdown Assistance.</p>
        </div>
      </footer>

    </div>
  );
}

export default WelcomePage;
