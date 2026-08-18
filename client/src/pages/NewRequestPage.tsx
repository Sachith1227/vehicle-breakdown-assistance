import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getVehicles } from "../services/vehicleService";
import { createBreakdownRequest } from "../services/requestService";
import type { Vehicle } from "../services/vehicleService";
const problemTypes = [
  {
    value: "BATTERY",
    label: "Battery Problem",
    icon: "🔋",
    description: "Vehicle won't start or battery is dead",
  },
  {
    value: "FLAT_TIRE",
    label: "Flat Tire",
    icon: "🛞",
    description: "Flat, punctured or damaged tire",
  },
  {
    value: "ENGINE",
    label: "Engine Problem",
    icon: "⚙️",
    description: "Engine warning or mechanical problem",
  },
  {
    value: "FUEL",
    label: "Out of Fuel",
    icon: "⛽",
    description: "Vehicle has run out of fuel",
  },
  {
    value: "ACCIDENT",
    label: "Accident",
    icon: "🚨",
    description: "Vehicle involved in an accident",
  },
  {
    value: "OTHER",
    label: "Other",
    icon: "🔧",
    description: "Another type of vehicle problem",
  },
];

function NewRequestPage() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState("");

  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");

  const [latitude, setLatitude] = useState<number | null>(
    null
  );
  const [longitude, setLongitude] = useState<number | null>(
    null
  );

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await getVehicles();

      const vehicleList = data.vehicles || data;

      setVehicles(vehicleList);

      if (vehicleList.length > 0) {
        setVehicleId(String(vehicleList[0].id));
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
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);

        setError(
          "Unable to get your location. Please allow location access."
        );
      }
    );
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (!vehicleId) {
        setError("Please select a vehicle.");
        return;
      }

      if (!problemType) {
        setError("Please select the problem type.");
        return;
      }

      if (latitude === null || longitude === null) {
        setError("Please share your current location.");
        return;
      }

      setSubmitting(true);

      const data = await createBreakdownRequest({
        vehicleId: Number(vehicleId),
        problemType,
        description,
        latitude,
        longitude,
      });

      navigate(`/requests/${data.request.id}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">
          Loading your vehicles...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
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


      <main className="mx-auto max-w-4xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* Step 1 */}
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
                    setVehicleId(e.target.value)
                  }
                  className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >
                      {vehicle.registrationNumber} —{" "}
                      {vehicle.make} {vehicle.model}
                    </option>
                  ))}
                </select>
              )}
            </div>

          </div>

        </section>


        {/* Step 2 */}
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

                {problemTypes.map((problem) => (
                  <button
                    key={problem.value}
                    type="button"
                    onClick={() =>
                      setProblemType(problem.value)
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      problemType === problem.value
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
                ))}

              </div>

            </div>

          </div>

        </section>


        {/* Step 3 */}
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
                  setDescription(e.target.value)
                }
                rows={4}
                placeholder="Example: The engine suddenly stopped and the car won't start again..."
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </section>


        {/* Step 4 */}
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

              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {locationLoading
                  ? "Getting location..."
                  : "📍 Use My Current Location"}
              </button>


              {latitude !== null &&
                longitude !== null && (
                  <div className="mt-4 rounded-xl bg-green-50 p-4">

                    <div className="flex items-center gap-2">
                      <span>✅</span>

                      <p className="text-sm font-semibold text-green-800">
                        Location captured
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-green-700">
                      Latitude: {latitude.toFixed(6)}
                      <br />
                      Longitude: {longitude.toFixed(6)}
                    </p>

                  </div>
                )}

            </div>

          </div>

        </section>


        {/* Submit */}
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
              onClick={handleSubmit}
              disabled={
                submitting ||
                vehicles.length === 0
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