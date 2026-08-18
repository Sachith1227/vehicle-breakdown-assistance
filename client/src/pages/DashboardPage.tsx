import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
              🚗
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                RoadRescue
              </h1>

              <p className="text-xs text-slate-500">
                Vehicle Breakdown Assistance
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                {user?.role}
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>

          </div>
        </div>
      </header>


      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Welcome */}
        <section className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            DRIVER DASHBOARD
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>

          <p className="mt-2 text-slate-500">
            Get roadside assistance quickly whenever you need it.
          </p>
        </section>


        {/* Emergency CTA */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-blue-600 shadow-lg">
          <div className="flex flex-col justify-between gap-8 p-8 md:flex-row md:items-center">

            <div className="max-w-xl text-white">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-300"></span>
                Assistance available
              </div>

              <h3 className="text-3xl font-bold">
                Vehicle trouble?
                <br />
                We can help.
              </h3>

              <p className="mt-3 text-blue-100">
                Tell us what's wrong, share your location, and
                connect with a nearby service provider.
              </p>

            </div>

            <Link
              to="/requests/new"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 font-bold text-blue-600 shadow-md transition hover:bg-blue-50"
            >
              🆘 Request Assistance
            </Link>

          </div>
        </section>


        {/* Quick actions */}
        <section className="mb-8">

          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Quick Actions
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <Link
              to="/vehicles"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                🚗
              </div>

              <h4 className="font-bold text-slate-900">
                My Vehicles
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                Manage your vehicles and registration details.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Manage vehicles →
              </span>
            </Link>


            <Link
              to="/requests"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                📋
              </div>

              <h4 className="font-bold text-slate-900">
                My Requests
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                View your previous and active assistance requests.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                View requests →
              </span>
            </Link>


            <Link
              to="/requests/new"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
                🆘
              </div>

              <h4 className="font-bold text-slate-900">
                Emergency Help
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                Quickly report a breakdown and request assistance.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-red-600">
                Get help now →
              </span>
            </Link>

          </div>
        </section>


        {/* Bottom grid */}
        <section className="grid gap-6 lg:grid-cols-3">

          {/* Recent requests */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">
                  Recent Requests
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest roadside assistance activity
                </p>
              </div>

              <Link
                to="/requests"
                className="text-sm font-semibold text-blue-600"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📋
              </div>

              <h4 className="mt-4 font-semibold text-slate-800">
                No recent requests
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Your assistance requests will appear here.
              </p>

            </div>

          </div>


          {/* Safety card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
              🛡️
            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Stay Safe
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              If your vehicle breaks down, move to a safe location
              whenever possible and turn on your hazard lights.
            </p>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Emergency tip
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                Keep your location shared while waiting for assistance.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DashboardPage;