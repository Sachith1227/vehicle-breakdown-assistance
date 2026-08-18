import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-xl text-white shadow-sm">
              🔧
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


          {/* Navigation */}

          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Register
            </Link>

          </div>

        </div>

      </header>


      {/* Hero */}

      <main>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">

          <div className="grid items-center gap-12 lg:grid-cols-2">


            {/* Left */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">

                <span className="h-2 w-2 rounded-full bg-green-500" />

                Roadside assistance when you need it

              </div>


              <h2 className="mt-6 max-w-2xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">

                Help is only{" "}

                <span className="text-blue-600">
                  one request
                </span>{" "}

                away.

              </h2>


              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">

                RoadRescue connects drivers with nearby
                service providers when their vehicle
                breaks down.

              </p>


              {/* Buttons */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-7 py-3.5 text-center font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
                >
                  Get Started →
                </Link>

                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-center font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  I already have an account
                </Link>

              </div>

            </div>


            {/* Right */}

            <div className="relative">

              <div className="rounded-3xl bg-slate-900 p-6 shadow-2xl">

                {/* Fake request card */}

                <div className="rounded-2xl bg-white p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Assistance Request
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-slate-900">
                        Engine Problem
                      </h3>

                    </div>

                    <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                      ON THE WAY
                    </span>

                  </div>


                  {/* Vehicle */}

                  <div className="mt-6 rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Vehicle
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      Toyota Prius
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      WP-CAB-1234
                    </p>

                  </div>


                  {/* Mechanic */}

                  <div className="mt-4 flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
                      🔧
                    </div>

                    <div>

                      <p className="font-bold text-slate-900">
                        ABC Auto Care
                      </p>

                      <p className="text-sm text-slate-500">
                        Service Provider
                      </p>

                    </div>

                    <div className="ml-auto text-sm font-bold text-green-600">
                      ★ 4.8
                    </div>

                  </div>


                  {/* Progress */}

                  <div className="mt-6">

                    <div className="flex items-center justify-between text-xs font-semibold">

                      <span className="text-blue-600">
                        Request accepted
                      </span>

                      <span className="text-slate-400">
                        5 min ago
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                      <div className="h-full w-2/3 rounded-full bg-blue-600" />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Features */}

        <section className="border-t border-slate-200 bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="grid gap-8 md:grid-cols-3">


              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  📍
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Find Assistance
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Share your location and request help
                  when your vehicle breaks down.
                </p>

              </div>


              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
                  🔧
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Connect with Mechanics
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Nearby service providers can accept
                  and handle your assistance request.
                </p>

              </div>


              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  📱
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Track Your Request
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Follow the progress from request
                  acceptance to completed service.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* Footer */}

      <footer className="border-t border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-400">

          © 2026 RoadRescue. Vehicle Breakdown Assistance.

        </div>

      </footer>

    </div>
  );
}

export default WelcomePage;