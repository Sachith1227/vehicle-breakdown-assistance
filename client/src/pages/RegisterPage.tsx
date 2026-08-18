import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

type UserRole = "DRIVER" | "SERVICE_PROVIDER";

function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] =
    useState<UserRole>("DRIVER");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // Mechanic fields
  const [businessName, setBusinessName] =
    useState("");
  const [address, setAddress] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    try {
      setError("");
      setSuccess("");

      // Validation
      if (
        !name ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        setError(
          "Please fill in all required fields."
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (password.length < 6) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }

      if (
        role === "SERVICE_PROVIDER" &&
        (!phone || !businessName || !address)
      ) {
        setError(
          "Please complete all service provider details."
        );
        return;
      }

      setLoading(true);

      const data = await registerUser({
        name,
        email,
        password,
        role,

        ...(role === "SERVICE_PROVIDER" && {
          phone,
          businessName,
          address,
        }),
      });

      setSuccess(
        data.message ||
          "Account created successfully."
      );

      // Redirect according to role
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error: any) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto w-full max-w-2xl">

        {/* Back */}

        <Link
          to="/"
          className="mb-6 inline-flex text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          ← Back to Home
        </Link>


        {/* Card */}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

          {/* Header */}

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-2xl text-white">
              🔧
            </div>

            <div>

              <h1 className="text-xl font-bold text-slate-900">
                RoadRescue
              </h1>

              <p className="text-xs text-slate-500">
                Vehicle Breakdown Assistance
              </p>

            </div>

          </div>


          <div className="mt-8">

            <h2 className="text-3xl font-bold text-slate-900">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose how you want to use RoadRescue.
            </p>

          </div>


          {/* Error */}

          {error && (

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              ⚠️ {error}
            </div>

          )}


          {/* Success */}

          {success && (

            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              ✓ {success}
            </div>

          )}


          {/* ROLE SELECTION */}

          <div className="mt-8">

            <label className="text-sm font-semibold text-slate-700">
              I want to register as
            </label>


            <div className="mt-3 grid gap-4 sm:grid-cols-2">

              {/* DRIVER */}

              <button
                type="button"
                onClick={() =>
                  setRole("DRIVER")
                }
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  role === "DRIVER"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                    🚗
                  </div>

                  {role === "DRIVER" && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      ✓
                    </span>
                  )}

                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Driver
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Request roadside assistance when your vehicle breaks down.
                </p>

              </button>


              {/* SERVICE PROVIDER */}

              <button
                type="button"
                onClick={() =>
                  setRole(
                    "SERVICE_PROVIDER"
                  )
                }
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  role === "SERVICE_PROVIDER"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                    🔧
                  </div>

                  {role === "SERVICE_PROVIDER" && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      ✓
                    </span>
                  )}

                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Service Provider
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Provide roadside repair and assistance services to drivers.
                </p>

              </button>

            </div>

          </div>


          {/* BASIC INFORMATION */}

          <div className="mt-8">

            <h3 className="text-lg font-bold text-slate-900">
              Personal Information
            </h3>


            {/* Name */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name *
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>


            {/* Email */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address *
              </label>

              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>


            {/* Service Provider Phone */}

            {role === "SERVICE_PROVIDER" && (

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  placeholder="07X XXX XXXX"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

            )}

          </div>


          {/* SERVICE PROVIDER INFORMATION */}

          {role === "SERVICE_PROVIDER" && (

            <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/50 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  🔧
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Service Provider Details
                  </h3>

                  <p className="text-xs text-slate-500">
                    Information drivers can use to identify your service.
                  </p>

                </div>

              </div>


              {/* Business */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Garage / Business Name *
                </label>

                <input
                  type="text"
                  placeholder="e.g. ABC Auto Care"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>


              {/* Address */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Business Address *
                </label>

                <textarea
                  placeholder="Enter your garage or service area"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

            </div>

          )}


          {/* PASSWORD */}

          <div className="mt-8">

            <h3 className="text-lg font-bold text-slate-900">
              Security
            </h3>


            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              {/* Password */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password *
                </label>

                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>


              {/* Confirm */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password *
                </label>

                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

            </div>

          </div>


          {/* REGISTER BUTTON */}

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading
              ? "Creating Account..."
              : role === "DRIVER"
              ? "Create Driver Account"
              : "Create Service Provider Account"}

          </button>


          {/* LOGIN LINK */}

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-1 inline-block font-bold text-blue-600 hover:text-blue-700"
            >
              Login to your account
            </Link>

          </div>

        </div>


        {/* Footer */}

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 RoadRescue. Vehicle Breakdown Assistance.
        </p>

      </div>

    </div>
  );
}

export default RegisterPage;