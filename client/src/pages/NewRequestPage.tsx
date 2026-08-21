import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { getVehicles } from "../services/vehicleService";
import { createBreakdownRequest } from "../services/requestService";
import type { Vehicle } from "../services/vehicleService";


// =====================================================
// FIX LEAFLET DEFAULT MARKER ICON
// =====================================================

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


// =====================================================
// PROBLEM TYPES
// =====================================================

const problemTypes = [
  {
    value: "BATTERY",
    label: "Battery Problem",
    icon: "🔋",
    description:
      "Vehicle won't start or battery is dead",
  },
  {
    value: "FLAT_TIRE",
    label: "Flat Tire",
    icon: "🛞",
    description:
      "Flat, punctured or damaged tire",
  },
  {
    value: "ENGINE",
    label: "Engine Problem",
    icon: "⚙️",
    description:
      "Engine warning or mechanical problem",
  },
  {
    value: "FUEL",
    label: "Out of Fuel",
    icon: "⛽",
    description:
      "Vehicle has run out of fuel",
  },
  {
    value: "ACCIDENT",
    label: "Accident",
    icon: "🚨",
    description:
      "Vehicle involved in an accident",
  },
  {
    value: "OTHER",
    label: "Other",
    icon: "🔧",
    description:
      "Another type of vehicle problem",
  },
];


// =====================================================
// MAP CENTER COMPONENT
// =====================================================

function MapCenter({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [latitude, longitude],
      16,
      {
        animate: true,
      }
    );
  }, [latitude, longitude, map]);

  return null;
}


// =====================================================
// NEW REQUEST PAGE
// =====================================================

function NewRequestPage() {
  const navigate = useNavigate();


  // ===================================================
  // VEHICLES
  // ===================================================

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [vehicleId, setVehicleId] =
    useState("");


  // ===================================================
  // PROBLEM
  // ===================================================

  const [problemType, setProblemType] =
    useState("");

  const [description, setDescription] =
    useState("");


  // ===================================================
  // LOCATION
  // ===================================================

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [locationLoading, setLocationLoading] =
    useState(false);


  // ===================================================
  // GENERAL STATE
  // ===================================================

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  // ===================================================
  // LOAD VEHICLES
  // ===================================================

  useEffect(() => {
    loadVehicles();
  }, []);


  const loadVehicles = async () => {
    try {

      setLoading(true);

      const data =
        await getVehicles();

      const vehicleList =
        data.vehicles || data;

      setVehicles(vehicleList);


      if (vehicleList.length > 0) {

        setVehicleId(
          String(
            vehicleList[0].id
          )
        );

      }

    } catch (error: any) {

      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load vehicles."
      );

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // GET CURRENT LOCATION
  // ===================================================

  const getCurrentLocation = () => {

    if (!navigator.geolocation) {

      setError(
        "Location services are not supported by this browser."
      );

      return;
    }


    setLocationLoading(true);

    setError("");


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const newLatitude =
          position.coords.latitude;

        const newLongitude =
          position.coords.longitude;


        setLatitude(
          newLatitude
        );

        setLongitude(
          newLongitude
        );


        setLocationLoading(false);

      },


      (error) => {

        console.error(
          "Location error:",
          error
        );

        setLocationLoading(false);


        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {

          setError(
            "Location permission was denied. Please allow location access in your browser."
          );

        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          setError(
            "Your current location is unavailable. Please try again."
          );

        } else if (
          error.code ===
          error.TIMEOUT
        ) {

          setError(
            "Getting your location took too long. Please try again."
          );

        } else {

          setError(
            "Unable to get your current location."
          );

        }

      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }

    );

  };


  // ===================================================
  // SUBMIT REQUEST
  // ===================================================

  const handleSubmit = async () => {

    try {

      setError("");


      // -----------------------------------------------
      // VEHICLE
      // -----------------------------------------------

      if (!vehicleId) {

        setError(
          "Please select a vehicle."
        );

        return;
      }


      // -----------------------------------------------
      // PROBLEM
      // -----------------------------------------------

      if (!problemType) {

        setError(
          "Please select the problem type."
        );

        return;
      }


      // -----------------------------------------------
      // LOCATION
      // -----------------------------------------------

      if (
        latitude === null ||
        longitude === null
      ) {

        setError(
          "Please share your current location."
        );

        return;
      }


      // -----------------------------------------------
      // SUBMIT
      // -----------------------------------------------

      setSubmitting(true);


      const data =
        await createBreakdownRequest({

          vehicleId:
            Number(vehicleId),

          problemType,

          description,

          latitude,

          longitude,

        });


      navigate(
        `/requests/${data.request.id}`
      );


    } catch (error: any) {

      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create breakdown request."
      );

    } finally {

      setSubmitting(false);

    }

  };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your vehicles...
          </p>

        </div>

      </div>

    );

  }


  // ===================================================
  // MAIN UI
  // ===================================================

  return (

    <div className="min-h-screen bg-slate-50">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-4xl px-6 py-5">

          <Link
            to="/dashboard"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>


          <div className="mt-5">

            <p className="text-sm font-medium text-red-600">
              ROADSIDE ASSISTANCE
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Request Assistance 🆘
            </h1>

            <p className="mt-2 text-slate-500">
              Tell us what's wrong and we'll help connect you
              with a service provider.
            </p>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-4xl px-6 py-8">


        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            {error}

          </div>

        )}


        {/* =================================================
            STEP 1 — VEHICLE
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              1
            </div>


            <div className="flex-1">

              <h2 className="text-lg font-bold text-slate-900">
                Select your vehicle
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Which vehicle needs assistance?
              </p>


              {vehicles.length === 0 ? (

                <div className="mt-5 rounded-xl bg-amber-50 p-4">

                  <p className="text-sm text-amber-800">
                    You don't have any vehicles yet.
                  </p>

                  <Link
                    to="/vehicles"
                    className="mt-2 inline-block text-sm font-semibold text-amber-900 underline"
                  >
                    Add a vehicle first →
                  </Link>

                </div>

              ) : (

                <select
                  value={vehicleId}
                  onChange={(e) =>
                    setVehicleId(
                      e.target.value
                    )
                  }
                  className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  {vehicles.map(
                    (vehicle) => (

                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >

                        {vehicle.registrationNumber}
                        {" — "}
                        {vehicle.make}{" "}
                        {vehicle.model}

                      </option>

                    )
                  )}

                </select>

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            STEP 2 — PROBLEM
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              2
            </div>


            <div className="flex-1">

              <h2 className="text-lg font-bold text-slate-900">
                What's the problem?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the issue that best describes your situation.
              </p>


              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                {problemTypes.map(
                  (problem) => (

                    <button
                      key={
                        problem.value
                      }
                      type="button"
                      onClick={() =>
                        setProblemType(
                          problem.value
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        problemType ===
                        problem.value
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        <span className="text-2xl">
                          {problem.icon}
                        </span>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {problem.label}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {problem.description}
                          </p>

                        </div>

                      </div>

                    </button>

                  )
                )}

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            STEP 3 — DESCRIPTION
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              3
            </div>


            <div className="flex-1">

              <h2 className="text-lg font-bold text-slate-900">
                Describe the problem
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Give the mechanic some additional information.
              </p>


              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Example: The engine suddenly stopped and the car won't start again..."
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </section>


        {/* =================================================
            STEP 4 — LOCATION
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              4
            </div>


            <div className="flex-1">

              <h2 className="text-lg font-bold text-slate-900">
                Share your location
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your location helps nearby mechanics find you.
              </p>


              {/* LOCATION BUTTON */}

              <button
                type="button"
                onClick={
                  getCurrentLocation
                }
                disabled={
                  locationLoading
                }
                className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {locationLoading
                  ? "Getting location..."
                  : "📍 Use My Current Location"}

              </button>


              {/* =================================================
                  MAP
              ================================================= */}

              {latitude !== null &&
                longitude !== null && (

                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">

                    {/* Map Header */}

                    <div className="flex items-center justify-between bg-slate-900 px-4 py-3">

                      <div>

                        <p className="text-sm font-bold text-white">
                          📍 Your Breakdown Location
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          This is the location shared with the mechanic.
                        </p>

                      </div>


                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        Location Ready
                      </span>

                    </div>


                    {/* Map */}

                    <MapContainer
                      center={[
                        latitude,
                        longitude,
                      ]}
                      zoom={16}
                      scrollWheelZoom={true}
                      className="h-[320px] w-full"
                    >

                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />


                      <Marker
                        position={[
                          latitude,
                          longitude,
                        ]}
                        icon={markerIcon}
                      >

                        <Popup>

                          <div className="text-center">

                            <strong>
                              📍 Your Location
                            </strong>

                            <br />

                            <span className="text-xs">
                              Breakdown location
                            </span>

                          </div>

                        </Popup>

                      </Marker>


                      <MapCenter
                        latitude={
                          latitude
                        }
                        longitude={
                          longitude
                        }
                      />

                    </MapContainer>


                    {/* Coordinates */}

                    <div className="bg-green-50 p-4">

                      <div className="flex items-center gap-2">

                        <span>
                          ✅
                        </span>

                        <p className="text-sm font-semibold text-green-800">
                          Location captured successfully
                        </p>

                      </div>


                      <div className="mt-2 grid gap-2 text-xs text-green-700 sm:grid-cols-2">

                        <p>
                          <span className="font-semibold">
                            Latitude:
                          </span>{" "}
                          {latitude.toFixed(
                            6
                          )}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Longitude:
                          </span>{" "}
                          {longitude.toFixed(
                            6
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                )}


              {/* No location yet */}

              {latitude === null &&
                longitude === null && (

                  <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

                    <div className="text-3xl">
                      📍
                    </div>

                    <p className="mt-2 font-semibold text-slate-700">
                      Location not selected
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Click "Use My Current Location" to continue.
                    </p>

                  </div>

                )}

            </div>

          </div>

        </section>


        {/* =================================================
            SUBMIT
        ================================================= */}

        <section className="mt-6 rounded-2xl bg-blue-600 p-6 shadow-lg">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div className="text-white">

              <h2 className="text-lg font-bold">
                Ready to request assistance?
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                We'll create your request and start looking for assistance.
              </p>

            </div>


            <button
              onClick={
                handleSubmit
              }
              disabled={
                submitting ||
                vehicles.length ===
                  0
              }
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {submitting
                ? "Sending Request..."
                : "🆘 Request Assistance"}

            </button>

          </div>

        </section>

      </main>

    </div>

  );
}


export default NewRequestPage;