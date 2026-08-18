import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  acceptRequest,
  getPendingRequests,
  getMyAssignedRequests,
} from "../services/mechanicService";

import { useAuth } from "../context/AuthContext";

interface BreakdownRequest {
  id: number;
  problemType: string;
  description?: string;
  status: string;
  createdAt: string;
  latitude: number;
  longitude: number;

  vehicle: {
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
  };

  user: {
    id: number;
    name: string;
    email: string;
  };
}

function MechanicDashboardPage() {
  const { user, logout } = useAuth();

  // Available requests waiting for a mechanic
  const [pendingRequests, setPendingRequests] =
    useState<BreakdownRequest[]>([]);

  // Requests accepted by this mechanic
  const [assignedRequests, setAssignedRequests] =
    useState<BreakdownRequest[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [acceptingId, setAcceptingId] =
    useState<number | null>(null);

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [pendingData, assignedData] =
        await Promise.all([
          getPendingRequests(),
          getMyAssignedRequests(),
        ]);

      setPendingRequests(
        pendingData.requests || []
      );

      setAssignedRequests(
        assignedData.requests || []
      );
    } catch (error: any) {
      console.error(
        "Load mechanic dashboard error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ACCEPT REQUEST
  // ==========================================

  const handleAccept = async (id: number) => {
    try {
      setAcceptingId(id);
      setError("");

      const data = await acceptRequest(id);

      // Remove from available requests
      setPendingRequests((current) =>
        current.filter(
          (request) => request.id !== id
        )
      );

      // Add to my active requests
      if (data.request) {
        setAssignedRequests((current) => [
          data.request,
          ...current,
        ]);
      }
    } catch (error: any) {
      console.error(
        "Accept request error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to accept request."
      );
    } finally {
      setAcceptingId(null);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "ON_THE_WAY":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "ARRIVED":
        return "bg-orange-50 text-orange-700 border-orange-100";

      case "IN_PROGRESS":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";

      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-100";

      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-100";

      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  // ==========================================
  // STATUS DOT
  // ==========================================

  const getStatusDot = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-purple-500";

      case "ON_THE_WAY":
        return "bg-amber-500";

      case "ARRIVED":
        return "bg-orange-500";

      case "IN_PROGRESS":
        return "bg-indigo-500";

      case "COMPLETED":
        return "bg-green-500";

      case "CANCELLED":
        return "bg-red-500";

      default:
        return "bg-slate-400";
    }
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus = (status: string) => {
    return status.replaceAll("_", " ");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================
          NAVBAR
      ======================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}

          <Link
            to="/mechanic"
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
                Service Provider Portal
              </p>

            </div>

          </Link>


          {/* User */}

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-slate-900">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                Service Provider
              </p>

            </div>


            <button
              onClick={logout}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* ======================================
          MAIN
      ======================================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">


        {/* ====================================
            WELCOME
        ===================================== */}

        <section className="mb-8">

          <p className="text-sm font-semibold tracking-wide text-blue-600">
            SERVICE PROVIDER
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Good day,{" "}
            {user?.name?.split(" ")[0] || "Mechanic"} 🔧
          </h2>

          <p className="mt-2 max-w-2xl text-slate-500">
            Manage roadside assistance requests
            and help drivers get back on the road.
          </p>

        </section>


        {/* ====================================
            ERROR
        ===================================== */}

        {error && (

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <span className="text-lg">
              ⚠️
            </span>

            <p>{error}</p>

          </div>

        )}


        {/* ====================================
            STAT CARDS
        ===================================== */}

        <section className="mb-10 grid gap-4 md:grid-cols-3">


          {/* Available */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Available Requests
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {pendingRequests.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Waiting for a mechanic
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
                🆘
              </div>

            </div>

          </div>


          {/* Active */}

          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  My Active Requests
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {assignedRequests.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Requests assigned to you
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🔧
              </div>

            </div>

          </div>


          {/* Availability */}

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Availability
                </p>

                <div className="mt-3 flex items-center gap-2">

                  <span className="h-3 w-3 rounded-full bg-green-500" />

                  <span className="font-semibold text-green-700">
                    Available
                  </span>

                </div>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
                ✓
              </div>

            </div>

          </div>

        </section>


        {/* ====================================
            MY ACTIVE REQUESTS
        ===================================== */}

        <section className="mb-12">


          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <div className="flex items-center gap-2">

                <span className="text-xl">
                  🔧
                </span>

                <h3 className="text-xl font-bold text-slate-900">
                  My Active Requests
                </h3>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Requests you have accepted and are currently handling.
              </p>

            </div>

            <button
              onClick={loadDashboard}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              ↻ Refresh
            </button>

          </div>


          {loading ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading your requests...
              </p>

            </div>

          ) : assignedRequests.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                🔧
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No active requests
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                When you accept a roadside assistance request,
                it will appear here.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 lg:grid-cols-2">

              {assignedRequests.map(
                (request) => (

                  <div
                    key={request.id}
                    className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* Card top */}

                    <div className="p-6">

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                            🔧
                          </div>

                          <div>

                            <h3 className="font-bold capitalize text-slate-900">
                              {formatStatus(
                                request.problemType
                              )}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Request #{request.id}
                            </p>

                          </div>

                        </div>


                        {/* Status */}

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                            request.status
                          )}`}
                        >

                          <span
                            className={`h-2 w-2 rounded-full ${getStatusDot(
                              request.status
                            )}`}
                          />

                          {formatStatus(
                            request.status
                          )}

                        </span>

                      </div>


                      {/* Vehicle */}

                      <div className="mt-6 rounded-xl bg-slate-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Vehicle
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {request.vehicle.make}{" "}
                          {request.vehicle.model}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {request.vehicle.registrationNumber}
                          {" • "}
                          {request.vehicle.year}
                        </p>

                      </div>


                      {/* Driver */}

                      <div className="mt-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Driver
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {request.user.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {request.user.email}
                        </p>

                      </div>


                      {/* Location */}

                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                          Breakdown Location
                        </p>

                        <p className="mt-1 text-sm font-medium text-blue-900">
                          📍{" "}
                          {request.latitude.toFixed(
                            5
                          )}
                          ,{" "}
                          {request.longitude.toFixed(
                            5
                          )}
                        </p>

                      </div>

                    </div>


                    {/* Card action */}

                    <div className="border-t border-slate-100 bg-slate-50 p-4">

                      <Link
                        to={`/requests/${request.id}`}
                        className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        👁️ View & Manage Request
                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ====================================
            AVAILABLE REQUESTS
        ===================================== */}

        <section>


          <div className="mb-5">

            <div className="flex items-center gap-2">

              <span className="text-xl">
                📥
              </span>

              <h3 className="text-xl font-bold text-slate-900">
                Available Assistance Requests
              </h3>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              New roadside assistance requests waiting for a service provider.
            </p>

          </div>


          {loading ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading available requests...
              </p>

            </div>

          ) : pendingRequests.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                ✓
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No pending requests
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                New roadside assistance requests will appear here when drivers need help.
              </p>

              <button
                onClick={loadDashboard}
                className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                ↻ Check Again
              </button>

            </div>

          ) : (

            <div className="grid gap-5 lg:grid-cols-2">

              {pendingRequests.map(
                (request) => (

                  <div
                    key={request.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    <div className="p-6">

                      {/* Header */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                            🆘
                          </div>

                          <div>

                            <h3 className="font-bold capitalize text-slate-900">
                              {formatStatus(
                                request.problemType
                              )}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Request #{request.id}
                            </p>

                          </div>

                        </div>


                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">

                          <span className="h-2 w-2 rounded-full bg-blue-500" />

                          REQUESTED

                        </span>

                      </div>


                      {/* Vehicle */}

                      <div className="mt-6 rounded-xl bg-slate-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Vehicle
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {request.vehicle.make}{" "}
                          {request.vehicle.model}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {request.vehicle.registrationNumber}
                          {" • "}
                          {request.vehicle.year}
                        </p>

                      </div>


                      {/* Driver */}

                      <div className="mt-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Driver
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {request.user.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {request.user.email}
                        </p>

                      </div>


                      {/* Problem description */}

                      {request.description && (

                        <div className="mt-4">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Description
                          </p>

                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                            {request.description}
                          </p>

                        </div>

                      )}


                      {/* Location */}

                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                          Breakdown Location
                        </p>

                        <p className="mt-1 text-sm font-medium text-blue-900">
                          📍{" "}
                          {request.latitude.toFixed(
                            5
                          )}
                          ,{" "}
                          {request.longitude.toFixed(
                            5
                          )}
                        </p>

                      </div>

                    </div>


                    {/* Accept button */}

                    <div className="border-t border-slate-100 bg-slate-50 p-4">

                      <button
                        onClick={() =>
                          handleAccept(
                            request.id
                          )
                        }
                        disabled={
                          acceptingId ===
                          request.id
                        }
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        {acceptingId ===
                        request.id
                          ? "Accepting Request..."
                          : "🔧 Accept Request"}

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default MechanicDashboardPage;