import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRequests } from "../services/requestService";

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

function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const data = await getMyRequests();

      setRequests(data.requests || []);
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-blue-50 text-blue-700";

      case "ACCEPTED":
        return "bg-purple-50 text-purple-700";

      case "ON_THE_WAY":
        return "bg-amber-50 text-amber-700";

      case "ARRIVED":
        return "bg-orange-50 text-orange-700";

      case "IN_PROGRESS":
        return "bg-indigo-50 text-indigo-700";

      case "COMPLETED":
        return "bg-green-50 text-green-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-50 text-slate-700";
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

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">

          <Link
            to="/dashboard"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="text-sm font-medium text-blue-600">
                ASSISTANCE HISTORY
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                My Requests
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Track your current and previous roadside assistance requests.
              </p>
            </div>

            <Link
              to="/requests/new"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              🆘 New Request
            </Link>

          </div>

        </div>
      </header>


      <main className="mx-auto max-w-6xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {loading ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">
              Loading your requests...
            </p>
          </div>

        ) : requests.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              📋
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No assistance requests
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't created any roadside assistance requests yet.
            </p>

            <Link
              to="/requests/new"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Request Assistance
            </Link>

          </div>

        ) : (

          <div className="space-y-4">

            {requests.map((request) => (

              <div
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                  {/* Left */}
                  <div className="flex gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                      🆘
                    </div>

                    <div>

                      <h2 className="font-bold text-slate-900">
                        {request.problemType.replaceAll(
                          "_",
                          " "
                        )}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {request.vehicle.make}{" "}
                        {request.vehicle.model}
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {request.vehicle.registrationNumber}
                      </p>

                    </div>

                  </div>


                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${getStatusDot(
                          request.status
                        )}`}
                      />

                      {request.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </div>

                </div>


                {/* Details */}
                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Request
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      #{request.id}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {new Date(
                        request.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Service Provider
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {request.mechanic
                        ? request.mechanic.businessName
                        : "Searching..."}
                    </p>
                  </div>

                </div>


                {/* Footer */}
                <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">

                  <Link
                    to={`/requests/${request.id}`}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    View Details →
                  </Link>

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