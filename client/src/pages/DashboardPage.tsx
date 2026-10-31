import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyRequests } from "../services/requestService";
import SosButton from "../components/SosButton";
import {
  Car,
  ClipboardList,
  LifeBuoy,
  LogOut,
  ShieldCheck,
  Siren,
  Wrench,
} from "lucide-react";

// =====================================================
// TYPES & STATUS HELPERS
// =====================================================

interface RecentRequest {
  id: number;
  status: string;
  problemType: string;
  createdAt: string;
  vehicle?: {
    make: string;
    model: string;
    registrationNumber: string;
  };
}

const activeStatuses = [
  "REQUESTED",
  "ACCEPTED",
  "ON_THE_WAY",
  "ARRIVED",
  "IN_PROGRESS",
];

const statusInfo: Record<string, { label: string; message: string; style: string }> = {
  REQUESTED: {
    label: "Finding a mechanic",
    message: "Your request has been sent to nearby mechanics.",
    style: "bg-blue-50 text-blue-700",
  },
  ACCEPTED: {
    label: "Mechanic assigned",
    message: "A mechanic has accepted your request.",
    style: "bg-purple-50 text-purple-700",
  },
  ON_THE_WAY: {
    label: "On the way",
    message: "Your mechanic is driving to you right now.",
    style: "bg-amber-50 text-amber-700",
  },
  ARRIVED: {
    label: "Arrived",
    message: "Your mechanic has arrived at your location.",
    style: "bg-rescue-50 text-rescue-700",
  },
  IN_PROGRESS: {
    label: "Repair in progress",
    message: "Your vehicle is being fixed.",
    style: "bg-indigo-50 text-indigo-700",
  },
  COMPLETED: {
    label: "Completed",
    message: "",
    style: "bg-green-50 text-green-700",
  },
  CANCELLED: {
    label: "Cancelled",
    message: "",
    style: "bg-slate-100 text-slate-600",
  },
};

const formatProblem = (problem: string) =>
  problem.replaceAll("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

const timeAgo = (date: string) => {
  const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} h ago`;

  return new Date(date).toLocaleDateString();
};


// =====================================================
// DRIVER DASHBOARD
// =====================================================

function DashboardPage() {
  const { user, logout } = useAuth();

  const [requests, setRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRequests()
      .then((data) => setRequests(data.requests || []))
      .catch((error) => console.error("Load requests error:", error))
      .finally(() => setLoading(false));
  }, []);

  const activeRequest = requests.find((request) =>
    activeStatuses.includes(request.status)
  );

  const recent = requests.slice(0, 4);
  const completedCount = requests.filter((r) => r.status === "COMPLETED").length;

  const firstName = user?.name?.split(" ")[0];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =============================================
          HEADER + HERO
      ============================================= */}

      <div className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 pb-24 text-white">

        <div className="hero-grid absolute inset-0" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-rescue-400/25 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />

        <header className="relative border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full bg-white p-0.5">
                <img src="/roadrescue-logo.png" alt="RoadRescue Logo" className="h-full w-full object-contain" />
              </div>
              <div className="leading-tight">
                <p className="text-lg font-extrabold">RoadRescue</p>
                <p className="hidden text-xs text-blue-100 sm:block">Your Ride, Our Rescue.</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 sm:flex">
                <div className="text-right">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-blue-100">Driver</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-blue-700">
                  {firstName?.[0]?.toUpperCase()}
                </div>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>

          </div>
        </header>


        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-[1fr_auto]">

          <div className="animate-fade-up">
            <p className="text-sm font-semibold text-blue-100">
              {greeting}, {firstName}
            </p>

            {activeRequest ? (
              <>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
                  Hang tight. <span className="text-amber-300">Help is coming.</span>
                </h1>
                <p className="mt-4 max-w-xl text-blue-50">
                  {statusInfo[activeRequest.status]?.message} Stay with your
                  vehicle in a safe place with your hazard lights on.
                </p>
              </>
            ) : (
              <>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
                  Vehicle trouble? <span className="text-amber-300">We're here.</span>
                </h1>
                <p className="mt-4 max-w-xl text-blue-50">
                  Press SOS, share your location and the nearest mechanic will
                  be on the way. You're never stuck alone.
                </p>
              </>
            )}
          </div>

          <div className="flex justify-center py-6 lg:px-12">
            {activeRequest ? (
              <Link
                to={`/requests/${activeRequest.id}`}
                className="group w-full max-w-sm rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-2xl transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${statusInfo[activeRequest.status]?.style}`}>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                    {statusInfo[activeRequest.status]?.label}
                  </span>
                  <span className="text-xs text-slate-400">#{activeRequest.id}</span>
                </div>
                <p className="mt-4 text-xl font-extrabold">{formatProblem(activeRequest.problemType)}</p>
                {activeRequest.vehicle && (
                  <p className="mt-1 text-sm text-slate-500">
                    {activeRequest.vehicle.make} {activeRequest.vehicle.model} · {activeRequest.vehicle.registrationNumber}
                  </p>
                )}
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-rescue-500 transition-all"
                    style={{
                      width: `${((activeStatuses.indexOf(activeRequest.status) + 1) / (activeStatuses.length + 1)) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-4 text-sm font-bold text-blue-600 group-hover:underline">
                  Track your mechanic →
                </p>
              </Link>
            ) : (
              <SosButton to="/requests/new" label="Request help" />
            )}
          </div>

        </div>
      </div>


      {/* =============================================
          MAIN
      ============================================= */}

      <main className="relative mx-auto -mt-14 max-w-7xl px-4 pb-12 sm:px-6">

        {/* Quick actions */}
        <section className="grid gap-4 sm:grid-cols-3">

          <Link
            to="/requests/new"
            className="group rounded-3xl border border-rescue-100 bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rescue-50 text-rescue-600 transition group-hover:scale-110"><LifeBuoy size={24} /></div>
            <h3 className="mt-4 font-bold text-slate-900">Request help</h3>
            <p className="mt-1 text-sm text-slate-500">Report a breakdown in under a minute.</p>
            <span className="mt-4 inline-block text-sm font-bold text-rescue-600">Get help now →</span>
          </Link>

          <Link
            to="/vehicles"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:scale-110"><Car size={24} /></div>
            <h3 className="mt-4 font-bold text-slate-900">My vehicles</h3>
            <p className="mt-1 text-sm text-slate-500">Save your vehicles so help knows what to expect.</p>
            <span className="mt-4 inline-block text-sm font-bold text-blue-600">Manage vehicles →</span>
          </Link>

          <Link
            to="/requests"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition group-hover:scale-110"><ClipboardList size={24} /></div>
            <h3 className="mt-4 font-bold text-slate-900">My requests</h3>
            <p className="mt-1 text-sm text-slate-500">
              {completedCount > 0
                ? `${completedCount} rescue${completedCount === 1 ? "" : "s"} completed so far.`
                : "See all your past and active requests."}
            </p>
            <span className="mt-4 inline-block text-sm font-bold text-blue-600">View requests →</span>
          </Link>

        </section>


        <section className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Recent requests */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent requests</h3>
                <p className="mt-1 text-sm text-slate-500">Your latest roadside assistance activity</p>
              </div>
              <Link to="/requests" className="text-sm font-bold text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"><ShieldCheck size={30} /></div>
                <h4 className="mt-4 font-bold text-slate-800">Smooth roads so far!</h4>
                <p className="mt-1 text-sm text-slate-500">
                  No breakdowns yet. If you ever need help, it's one tap away.
                </p>
              </div>
            ) : (
              <ul className="mt-6 divide-y divide-slate-100">
                {recent.map((request) => (
                  <li key={request.id}>
                    <Link
                      to={`/requests/${request.id}`}
                      className="-mx-3 flex items-center gap-4 rounded-2xl px-3 py-4 transition hover:bg-slate-50"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Wrench size={20} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">{formatProblem(request.problemType)}</p>
                        <p className="truncate text-sm text-slate-500">
                          {request.vehicle
                            ? `${request.vehicle.make} ${request.vehicle.model} · `
                            : ""}
                          {timeAgo(request.createdAt)}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusInfo[request.status]?.style ?? "bg-slate-100 text-slate-600"}`}>
                        {statusInfo[request.status]?.label ?? request.status}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

          </div>


          {/* Safety checklist */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-rescue-50 p-6 ring-1 ring-amber-100">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rescue-600 shadow-sm"><ShieldCheck size={24} /></div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">If you break down</h3>
            <p className="mt-1 text-sm text-slate-600">Your safety comes first. While you wait:</p>

            <ol className="mt-5 space-y-3 text-sm text-slate-700">
              {[
                "Pull over as far left as safely possible",
                "Switch on your hazard lights",
                "Place a warning triangle behind your vehicle",
                "Wait away from traffic, not inside the car on a busy road",
                "Keep your phone charged and location on",
              ].map((tip, index) => (
                <li key={tip} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-rescue-600 shadow-sm">
                    {index + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-2xl bg-white/80 p-4 text-sm">
              <p className="flex items-center gap-2 font-bold text-slate-900"><Siren size={18} className="text-red-600" /> In a medical emergency</p>
              <p className="mt-1 text-slate-600">
                Call <a href="tel:1990" className="font-bold text-rescue-600">1990</a> (Suwa Seriya ambulance)
                or <a href="tel:119" className="font-bold text-rescue-600">119</a> (police).
              </p>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default DashboardPage;
