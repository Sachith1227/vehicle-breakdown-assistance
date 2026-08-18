import { useEffect, useState } from "react";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "../services/vehicleService";

import type { Vehicle } from "../services/vehicleService";

function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editingVehicle, setEditingVehicle] =
    useState<Vehicle | null>(null);

  const [registrationNumber, setRegistrationNumber] =
    useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const data = await getVehicles();

      setVehicles(data.vehicles || data);
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const resetForm = () => {
    setRegistrationNumber("");
    setMake("");
    setModel("");
    setYear("");
    setEditingVehicle(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess("");

      if (
        !registrationNumber ||
        !make ||
        !model ||
        !year
      ) {
        setError("Please fill in all fields.");
        return;
      }

      const vehicleData = {
        registrationNumber,
        make,
        model,
        year: Number(year),
      };

      if (editingVehicle) {
        await updateVehicle(
          editingVehicle.id,
          vehicleData
        );

        setSuccess("Vehicle updated successfully.");
      } else {
        await createVehicle(vehicleData);

        setSuccess("Vehicle added successfully.");
      }

      resetForm();
      await loadVehicles();
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong."
      );
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);

    setRegistrationNumber(
      vehicle.registrationNumber
    );
    setMake(vehicle.make);
    setModel(vehicle.model);
    setYear(String(vehicle.year));

    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteVehicle(id);

      setSuccess("Vehicle deleted successfully.");

      await loadVehicles();
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete vehicle."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-sm font-medium text-blue-600">
              VEHICLE MANAGEMENT
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              My Vehicles 🚗
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage the vehicles you use for roadside assistance.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingVehicle(null);
              setRegistrationNumber("");
              setMake("");
              setModel("");
              setYear("");
              setShowForm(true);
            }}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Vehicle
          </button>

        </div>
      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}


        {/* Add/Edit form */}
        {showForm && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingVehicle
                  ? "Edit Vehicle"
                  : "Add New Vehicle"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your vehicle information below.
              </p>
            </div>


            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Registration Number
                </label>

                <input
                  value={registrationNumber}
                  onChange={(e) =>
                    setRegistrationNumber(
                      e.target.value
                    )
                  }
                  placeholder="WP-CAB-1234"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Make
                </label>

                <input
                  value={make}
                  onChange={(e) =>
                    setMake(e.target.value)
                  }
                  placeholder="Toyota"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Model
                </label>

                <input
                  value={model}
                  onChange={(e) =>
                    setModel(e.target.value)
                  }
                  placeholder="Prius"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Year
                </label>

                <input
                  type="number"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value)
                  }
                  placeholder="2020"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>


            <div className="mt-6 flex gap-3">

              <button
                onClick={handleSubmit}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {editingVehicle
                  ? "Update Vehicle"
                  : "Save Vehicle"}
              </button>

              <button
                onClick={resetForm}
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

            </div>

          </section>
        )}


        {/* Vehicles */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-500">
              Loading your vehicles...
            </p>
          </div>
        ) : vehicles.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              🚗
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No vehicles yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Add your vehicle so you can quickly request
              roadside assistance when you need it.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Add Your First Vehicle
            </button>

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {vehicles.map((vehicle) => (

              <div
                key={vehicle.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                    🚗
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>

                </div>


                <div className="mt-5">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Registration
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    {vehicle.registrationNumber}
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {vehicle.make} {vehicle.model}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Year: {vehicle.year}
                  </p>

                </div>


                <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">

                  <button
                    onClick={() =>
                      handleEdit(vehicle)
                    }
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(vehicle.id)
                    }
                    className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default VehiclesPage;