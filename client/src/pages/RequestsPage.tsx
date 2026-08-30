import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import {
  getMyRequests,
  cancelRequest,
} from "../services/requestService";

interface RequestItem {
  id: number;
  problemType: string;
  description?: string;
  status: string;
  createdAt: string;
  vehicle: {
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
  };
  mechanic?: {
    businessName: string;
    phone: string;
    rating: number;
  } | null;
}

type FilterType =
  | "ALL"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [cancellingId, setCancellingId] = useState<number | null>(
    null
  );

  // =====================================================
  // LOAD REQUESTS
  // =====================================================

  const loadRequests = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data = await getMyRequests();

      setRequests(data.requests || []);
    } catch (error: any) {
      console.error("Load requests error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadRequests();
  }, []);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      loadRequests(false);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-blue-50 text-blue-700 border-blue-100";

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

  const getStatusDot = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-blue-500";

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

  const formatStatus = (status: string) => {
    return status.replaceAll("_", " ");
  };

  // =====================================================
  // FILTER REQUESTS
  // =====================================================

  const activeStatuses = [
    "REQUESTED",
    "ACCEPTED",
    "ON_THE_WAY",
    "ARRIVED",
    "IN_PROGRESS",
  ];

  const filteredRequests = useMemo(() => {
    switch (filter) {
      case "ACTIVE":
        return requests.filter((request) =>
          activeStatuses.includes(request.status)
        );

      case "COMPLETED":
        return requests.filter(
          (request) => request.status === "COMPLETED"
        );

      case "CANCELLED":
        return requests.filter(
          (request) => request.status === "CANCELLED"
        );

      default:
        return requests;
    }
  }, [requests, filter]);

  // =====================================================
  // COUNTS
  // =====================================================

  const activeCount = requests.filter((request) =>
    activeStatuses.includes(request.status)
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === "COMPLETED"
  ).length;

  const cancelledCount = requests.filter(
    (request) => request.status === "CANCELLED"
  ).length;

  // =====================================================
  // CANCEL REQUEST
  // =====================================================

  const handleCancel = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this assistance request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(id);
      setError("");

      await cancelRequest(id);

      await loadRequests(false);
    } catch (error: any) {
      console.error("Cancel request error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to cancel request."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =====================================================
  // CAN CANCEL
  // =====================================================

  const canCancel = (status: string) => {
    return (
      status === "REQUESTED" ||
      status === "ACCEPTED"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your requests...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
              <img
                src="/roadrescue-logo.png"
                alt="RoadRescue Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                RoadRescue
              </h2>

              <p className="text-xs text-slate-500">
                Vehicle Breakdown Assistance
              </p>
            </div>
          </Link>

          <BackButton
            to="/dashboard"
          />

          <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Assistance Center
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                My Requests
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Track and manage all your roadside assistance
                requests in one place.
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => loadRequests(false)}
                disabled={refreshing}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing ? "Refreshing..." : "↻ Refresh"}
              </button>

              <Link
                to="/requests/new"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                🆘 New Request
              </Link>

            </div>

          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>

          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}

          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              filter === "ALL"
                ? "border-blue-300 ring-2 ring-blue-100"
                : "border-slate-200"
            }`}
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                📋
              </div>

              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Total
              </span>

            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {requests.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              All requests
            </p>

          </button>

          {/* Active */}

          <button
            onClick={() => setFilter("ACTIVE")}
            className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              filter === "ACTIVE"
                ? "border-purple-300 ring-2 ring-purple-100"
                : "border-slate-200"
            }`}
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                🚨
              </div>

              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Active
              </span>

            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {activeCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              In progress
            </p>

          </button>

          {/* Completed */}

          <button
            onClick={() => setFilter("COMPLETED")}
            className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              filter === "COMPLETED"
                ? "border-green-300 ring-2 ring-green-100"
                : "border-slate-200"
            }`}
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                ✓
              </div>

              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Completed
              </span>

            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {completedCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Successfully completed
            </p>

          </button>

          {/* Cancelled */}

          <button
            onClick={() => setFilter("CANCELLED")}
            className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              filter === "CANCELLED"
                ? "border-red-300 ring-2 ring-red-100"
                : "border-slate-200"
            }`}
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
                ×
              </div>

              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Cancelled
              </span>

            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {cancelledCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Cancelled requests
            </p>

          </button>

        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {filter === "ALL"
                ? "All Requests"
                : filter === "ACTIVE"
                ? "Active Requests"
                : filter === "COMPLETED"
                ? "Completed Requests"
                : "Cancelled Requests"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredRequests.length}{" "}
              {filteredRequests.length === 1
                ? "request"
                : "requests"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            {(
              [
                "ALL",
                "ACTIVE",
                "COMPLETED",
                "CANCELLED",
              ] as FilterType[]
            ).map((item) => (

              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  filter === item
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {item === "ALL"
                  ? "All"
                  : item === "ACTIVE"
                  ? "Active"
                  : item === "COMPLETED"
                  ? "Completed"
                  : "Cancelled"}
              </button>

            ))}

          </div>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredRequests.length === 0 ? (

          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              {filter === "CANCELLED"
                ? "🗑️"
                : filter === "COMPLETED"
                ? "🎉"
                : "📋"}
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {filter === "ALL"
                ? "No assistance requests yet"
                : filter === "ACTIVE"
                ? "No active requests"
                : filter === "COMPLETED"
                ? "No completed requests"
                : "No cancelled requests"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {filter === "ALL"
                ? "When you request roadside assistance, your requests will appear here."
                : filter === "ACTIVE"
                ? "You don't currently have any active roadside assistance requests."
                : filter === "COMPLETED"
                ? "Your completed assistance requests will appear here."
                : "Your cancelled requests will appear here."}
            </p>

            {filter === "ALL" && (
              <Link
                to="/requests/new"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                🆘 Request Assistance
              </Link>
            )}

          </div>

        ) : (

          /* =================================================
             REQUEST LIST
          ================================================= */

          <div className="mt-5 space-y-4">

            {filteredRequests.map((request) => (

              <div
                key={request.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >

                <div className="p-6">

                  {/* TOP */}

                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                        🆘
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="font-bold text-slate-900">
                            {request.problemType.replaceAll(
                              "_",
                              " "
                            )}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
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

                        <p className="mt-2 text-sm text-slate-500">
                          {request.vehicle.make}{" "}
                          {request.vehicle.model}{" "}
                          ({request.vehicle.year})
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {request.vehicle.registrationNumber}
                        </p>

                      </div>

                    </div>

                    <div className="text-left lg:text-right">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Request
                      </p>

                      <p className="mt-1 font-bold text-slate-700">
                        #{request.id}
                      </p>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Created
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {new Date(
                          request.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Service Provider
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {request.mechanic
                          ? request.mechanic.businessName
                          : "Searching for provider..."}
                      </p>

                      {request.mechanic && (
                        <p className="mt-1 text-xs text-slate-500">
                          ⭐ {request.mechanic.rating}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Vehicle
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {request.vehicle.registrationNumber}
                      </p>
                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  {request.description && (
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Problem Description
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {request.description}
                      </p>

                    </div>
                  )}

                </div>

                {/* FOOTER */}

                <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center">

                  <div className="text-xs text-slate-400">

                    {request.status ===
                      "REQUESTED" &&
                      "Waiting for a service provider to accept your request."}

                    {request.status ===
                      "ACCEPTED" &&
                      "A service provider has accepted your request."}

                    {request.status ===
                      "ON_THE_WAY" &&
                      "Your service provider is on the way."}

                    {request.status ===
                      "ARRIVED" &&
                      "Your service provider has arrived."}

                    {request.status ===
                      "IN_PROGRESS" &&
                      "Your vehicle service is currently in progress."}

                    {request.status ===
                      "COMPLETED" &&
                      "This assistance request has been completed."}

                    {request.status ===
                      "CANCELLED" &&
                      "This request has been cancelled."}

                  </div>

                  <div className="flex gap-2">

                    {canCancel(
                      request.status
                    ) && (

                      <button
                        onClick={() =>
                          handleCancel(
                            request.id
                          )
                        }
                        disabled={
                          cancellingId ===
                          request.id
                        }
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {cancellingId ===
                        request.id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>

                    )}

                    <Link
                      to={`/requests/${request.id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      View Details →
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>
    </div>
  );
}

export default RequestsPage;