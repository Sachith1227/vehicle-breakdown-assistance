import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  cancelRequest,
  getRequestById,
} from "../services/requestService";

import {
  updateRequestStatus,
} from "../services/mechanicService";

import { useAuth } from "../context/AuthContext";

function RequestDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [request, setRequest] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // Used to show that the page is checking for updates
  const [checkingUpdates, setCheckingUpdates] =
    useState(false);


  // =====================================================
  // LOAD REQUEST
  // =====================================================

  const loadRequest = async (
    showLoading = true
  ) => {
    try {

      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const data =
        await getRequestById(
          Number(id)
        );

      setRequest(data.request);

    } catch (error: any) {

      console.error(
        "Load request error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load request."
      );

    } finally {

      if (showLoading) {
        setLoading(false);
      }

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    if (!id) {
      return;
    }

    loadRequest(true);

  }, [id]);


  // =====================================================
  // AUTOMATIC STATUS CHECK
  // =====================================================

  useEffect(() => {

    if (!id) {
      return;
    }

    /*
     * Check the request every 5 seconds.
     *
     * We don't show the full loading screen during
     * automatic refresh because that would make the
     * page flicker every 5 seconds.
     */

    const interval = setInterval(
      async () => {

        try {

          setCheckingUpdates(true);

          const data =
            await getRequestById(
              Number(id)
            );

          setRequest(
            data.request
          );

        } catch (error) {

          console.error(
            "Automatic request update error:",
            error
          );

          /*
           * We don't display an error here because
           * a temporary network problem should not
           * destroy the current page.
           */

        } finally {

          setCheckingUpdates(false);

        }

      },
      5000
    );


    return () => {
      clearInterval(interval);
    };

  }, [id]);


  // =====================================================
  // CANCEL REQUEST - DRIVER
  // =====================================================

  const handleCancel = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this request?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      await cancelRequest(
        Number(id)
      );

      await loadRequest(false);

    } catch (error: any) {

      console.error(
        "Cancel request error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to cancel request."
      );

    }

  };


  // =====================================================
  // UPDATE STATUS - MECHANIC
  // =====================================================

  const handleStatusUpdate = async (
    status: string
  ) => {

    try {

      setError("");

      setUpdatingStatus(true);

      await updateRequestStatus(
        Number(id),
        status
      );

      await loadRequest(false);

    } catch (error: any) {

      console.error(
        "Update status error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update request status."
      );

    } finally {

      setUpdatingStatus(false);

    }

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
            Loading request...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // REQUEST NOT FOUND
  // =====================================================

  if (!request) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="text-4xl">
            😕
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Request not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "We couldn't find this breakdown request."}
          </p>

          <Link
            to={
              user?.role ===
              "SERVICE_PROVIDER"
                ? "/mechanic"
                : "/requests"
            }
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back
          </Link>

        </div>

      </div>

    );

  }


  // =====================================================
  // STATUS INFORMATION
  // =====================================================

  const statuses = [
    "REQUESTED",
    "ACCEPTED",
    "ON_THE_WAY",
    "ARRIVED",
    "IN_PROGRESS",
    "COMPLETED",
  ];


  const currentStatusIndex =
    statuses.indexOf(
      request.status
    );


  // =====================================================
  // DRIVER CANCELLATION
  // =====================================================

  const canCancel =
    user?.role === "DRIVER" &&
    (
      request.status ===
        "REQUESTED" ||
      request.status ===
        "ACCEPTED"
    );


  // =====================================================
  // MECHANIC ACTION
  // =====================================================

  const renderMechanicAction = () => {

    if (
      user?.role !==
      "SERVICE_PROVIDER"
    ) {
      return null;
    }


    switch (
      request.status
    ) {

      case "ACCEPTED":

        return (

          <button
            disabled={
              updatingStatus
            }
            onClick={() =>
              handleStatusUpdate(
                "ON_THE_WAY"
              )
            }
            className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {updatingStatus
              ? "Updating..."
              : "🚗 Start Journey"}

          </button>

        );


      case "ON_THE_WAY":

        return (

          <button
            disabled={
              updatingStatus
            }
            onClick={() =>
              handleStatusUpdate(
                "ARRIVED"
              )
            }
            className="w-full rounded-xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {updatingStatus
              ? "Updating..."
              : "📍 Mark as Arrived"}

          </button>

        );


      case "ARRIVED":

        return (

          <button
            disabled={
              updatingStatus
            }
            onClick={() =>
              handleStatusUpdate(
                "IN_PROGRESS"
              )
            }
            className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {updatingStatus
              ? "Updating..."
              : "🔧 Start Service"}

          </button>

        );


      case "IN_PROGRESS":

        return (

          <button
            disabled={
              updatingStatus
            }
            onClick={() =>
              handleStatusUpdate(
                "COMPLETED"
              )
            }
            className="w-full rounded-xl bg-green-600 px-6 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {updatingStatus
              ? "Updating..."
              : "✅ Complete Request"}

          </button>

        );


      default:
        return null;

    }

  };


  const mechanicAction =
    renderMechanicAction();


  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusColor = () => {

    switch (
      request.status
    ) {

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


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-4xl px-6 py-5">

          <Link
            to={
              user?.role ===
              "SERVICE_PROVIDER"
                ? "/mechanic"
                : "/requests"
            }
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >

            ←{" "}

            {user?.role ===
            "SERVICE_PROVIDER"
              ? "Mechanic Dashboard"
              : "My Requests"}

          </Link>


          <div className="mt-5">

            <p className="text-sm font-medium text-blue-600">
              BREAKDOWN REQUEST
            </p>

            <div className="flex items-center justify-between gap-4">

              <div>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                  Assistance Request
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Request #{request.id}
                </p>

              </div>


              {/* Auto update indicator */}

              <div className="hidden items-center gap-2 sm:flex">

                <span
                  className={`h-2 w-2 rounded-full ${
                    checkingUpdates
                      ? "animate-pulse bg-blue-500"
                      : "bg-green-500"
                  }`}
                />

                <span className="text-xs text-slate-400">

                  {checkingUpdates
                    ? "Updating..."
                    : "Live updates"}

                </span>

              </div>

            </div>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-4xl px-6 py-8">


        {/* Error */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            {error}

          </div>

        )}


        {/* =================================================
            CURRENT STATUS
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Status
              </p>

              <div className="mt-3 flex items-center gap-3">

                <span
                  className={`h-3 w-3 rounded-full ${
                    request.status ===
                    "COMPLETED"
                      ? "bg-green-500"
                      : request.status ===
                        "CANCELLED"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                />

                <h2 className="text-2xl font-bold text-slate-900">
                  {request.status.replaceAll(
                    "_",
                    " "
                  )}
                </h2>

              </div>

            </div>


            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusColor()}`}
            >
              {request.status.replaceAll(
                "_",
                " "
              )}
            </span>

          </div>

        </section>


        {/* =================================================
            PROGRESS TIMELINE
        ================================================= */}

        {request.status !==
          "CANCELLED" && (

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Request Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track the progress of your roadside assistance.
            </p>


            <div className="mt-7">

              {statuses.map(
                (
                  status,
                  index
                ) => {

                  const completed =
                    index <=
                    currentStatusIndex;

                  const isCurrent =
                    status ===
                    request.status;


                  return (

                    <div
                      key={status}
                      className="relative flex gap-4"
                    >

                      {/* Connecting line */}

                      {index <
                        statuses.length -
                          1 && (

                        <div
                          className={`absolute left-4 top-9 h-8 w-0.5 ${
                            index <
                            currentStatusIndex
                              ? "bg-blue-600"
                              : "bg-slate-200"
                          }`}
                        />

                      )}


                      {/* Circle */}

                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          completed
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >

                        {completed
                          ? "✓"
                          : index + 1}

                      </div>


                      {/* Label */}

                      <div className="pb-7">

                        <p
                          className={`text-sm font-semibold ${
                            isCurrent
                              ? "text-blue-600"
                              : completed
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >

                          {status.replaceAll(
                            "_",
                            " "
                          )}

                        </p>


                        {isCurrent && (

                          <p className="mt-1 text-xs text-slate-500">
                            Current stage
                          </p>

                        )}

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          </section>

        )}


        {/* =================================================
            MECHANIC ACTION
        ================================================= */}

        {user?.role ===
          "SERVICE_PROVIDER" &&
          mechanicAction && (

          <section className="mt-6 rounded-2xl bg-slate-900 p-6 shadow-lg">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
                🔧
              </div>

              <div className="flex-1">

                <h2 className="text-lg font-bold text-white">
                  Next Action
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Update the request when you complete the next stage.
                </p>

              </div>

            </div>


            <div className="mt-5">
              {mechanicAction}
            </div>

          </section>

        )}


        {/* =================================================
            VEHICLE
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-bold text-slate-900">
            Vehicle
          </h2>


          <div className="mt-4 flex items-center gap-4 rounded-xl bg-slate-50 p-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              🚗
            </div>

            <div>

              <p className="font-bold text-slate-900">
                {request.vehicle.registrationNumber}
              </p>

              <p className="mt-1 text-sm text-slate-500">

                {request.vehicle.make}{" "}
                {request.vehicle.model}{" "}

                ({request.vehicle.year})

              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            PROBLEM
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-bold text-slate-900">
            Problem
          </h2>


          <div className="mt-4 rounded-xl bg-slate-50 p-4">

            <p className="font-semibold capitalize text-slate-900">

              {request.problemType.replaceAll(
                "_",
                " "
              )}

            </p>


            {request.description && (

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {request.description}
              </p>

            )}

          </div>

        </section>


        {/* =================================================
            LOCATION
        ================================================= */}

        {request.latitude !==
          undefined &&
          request.longitude !==
            undefined && (

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Location
            </h2>


            <div className="mt-4 rounded-xl bg-blue-50 p-4">

              <p className="text-sm font-semibold text-blue-900">
                📍 Driver Location
              </p>


              <p className="mt-2 text-sm text-blue-700">
                Latitude:{" "}
                {Number(
                  request.latitude
                ).toFixed(6)}
              </p>


              <p className="text-sm text-blue-700">
                Longitude:{" "}
                {Number(
                  request.longitude
                ).toFixed(6)}
              </p>

            </div>

          </section>

        )}


        {/* =================================================
            SERVICE PROVIDER
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-bold text-slate-900">
            Service Provider
          </h2>


          {request.mechanic ? (

            <div className="mt-4 flex items-center gap-4 rounded-xl bg-green-50 p-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
                🔧
              </div>


              <div>

                <p className="font-bold text-green-900">
                  {request.mechanic.businessName}
                </p>

                <p className="mt-1 text-sm text-green-700">
                  📞{" "}
                  {request.mechanic.phone}
                </p>

                <p className="mt-1 text-sm text-green-700">
                  ⭐{" "}
                  {request.mechanic.rating}
                </p>

              </div>

            </div>

          ) : (

            <div className="mt-4 rounded-xl bg-slate-50 p-4">

              <p className="text-sm font-medium text-slate-700">
                🔎 Looking for an available service provider...
              </p>

              <p className="mt-1 text-xs text-slate-500">
                You will see the provider details here once someone accepts your request.
              </p>

            </div>

          )}

        </section>


        {/* =================================================
            CANCEL - DRIVER
        ================================================= */}

        {canCancel && (

          <section className="mt-6 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Cancel Request
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              You can cancel this request before the service provider starts travelling.
            </p>


            <button
              onClick={handleCancel}
              className="mt-4 rounded-xl border border-red-200 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              Cancel Request
            </button>

          </section>

        )}


        {/* =================================================
            COMPLETED
        ================================================= */}

        {request.status ===
          "COMPLETED" && (

          <section className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
                ✓
              </div>


              <div>

                <h2 className="font-bold text-green-900">
                  Assistance Completed
                </h2>

                <p className="mt-1 text-sm text-green-700">
                  This breakdown request has been successfully completed.
                </p>

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            CANCELLED
        ================================================= */}

        {request.status ===
          "CANCELLED" && (

          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                ×
              </div>


              <div>

                <h2 className="font-bold text-red-900">
                  Request Cancelled
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  This breakdown request has been cancelled.
                </p>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default RequestDetailsPage;