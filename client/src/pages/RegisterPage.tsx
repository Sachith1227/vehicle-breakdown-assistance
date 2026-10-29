import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import BackButton from "../components/BackButton";

import FormAlert from "../components/FormAlert";
import PasswordInput from "../components/PasswordInput";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { registerUser } from "../services/authService";
import { getBestPosition } from "../utils/geolocation";
import { getErrorMessage, isValidEmail } from "../utils/apiError";


type FieldName =
  | "name"
  | "email"
  | "phone"
  | "businessName"
  | "address"
  | "location"
  | "password"
  | "confirmPassword";


// =====================================================
// USER ROLE
// =====================================================

type UserRole =
  | "DRIVER"
  | "SERVICE_PROVIDER";


// =====================================================
// REGISTER PAGE
// =====================================================

function RegisterPage() {

  const navigate =
    useNavigate();


  // ===================================================
  // ROLE
  // ===================================================

  const [role, setRole] =
    useState<UserRole>(
      "DRIVER"
    );


  // ===================================================
  // BASIC INFORMATION
  // ===================================================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // ===================================================
  // SERVICE PROVIDER INFORMATION
  // ===================================================

  const [businessName, setBusinessName] =
    useState("");

  const [address, setAddress] =
    useState("");


  // ===================================================
  // LOCATION
  // ===================================================

  const [latitude, setLatitude] =
    useState<number | null>(
      null
    );

  const [longitude, setLongitude] =
    useState<number | null>(
      null
    );

  const [locationLoading, setLocationLoading] =
    useState(false);


  // ===================================================
  // GENERAL STATE
  // ===================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [fieldErrors, setFieldErrors] =
    useState<Partial<Record<FieldName, string>>>({});


  // ===================================================
  // FIELD ERROR HELPERS
  // ===================================================

  const clearFieldError = (field: FieldName) =>
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

  const inputClass = (field: FieldName) =>
    `w-full rounded-xl border bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-50"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-50"
    }`;

  const renderFieldError = (field: FieldName) =>
    fieldErrors[field] && (
      <p className="mt-1.5 text-xs font-medium text-red-600">
        {fieldErrors[field]}
      </p>
    );


  // ===================================================
  // GET CURRENT LOCATION
  // ===================================================

  const getCurrentLocation = () => {

    if (
      !navigator.geolocation
    ) {

      setError(
        "Location services are not supported by this browser."
      );

      return;
    }


    setError("");

    setLocationLoading(
      true
    );


    getBestPosition(

      // ===============================================
      // SUCCESS
      // ===============================================

      (position) => {

        const currentLatitude =
          position.coords.latitude;

        const currentLongitude =
          position.coords.longitude;


        setLatitude(
          currentLatitude
        );

        setLongitude(
          currentLongitude
        );


        setLocationLoading(
          false
        );

      },


      // ===============================================
      // ERROR
      // ===============================================

      (locationError) => {

        console.error(
          "Location error:",
          locationError
        );


        setLocationLoading(
          false
        );


        if (
          locationError.code ===
          locationError.PERMISSION_DENIED
        ) {

          setError(
            "Location permission was denied. Please allow location access in your browser."
          );

        } else if (
          locationError.code ===
          locationError.POSITION_UNAVAILABLE
        ) {

          setError(
            "Your current location is unavailable. Please try again."
          );

        } else if (
          locationError.code ===
          locationError.TIMEOUT
        ) {

          setError(
            "Getting your location took too long. Please try again."
          );

        } else {

          setError(
            "Unable to get your current location."
          );

        }

      }

    );

  };


  // ===================================================
  // HANDLE REGISTER
  // ===================================================

  const handleRegister =
    async () => {

      try {

        setError("");

        setSuccess("");


        // =============================================
        // VALIDATION (shown under each field)
        // =============================================

        const errors: Partial<Record<FieldName, string>> = {};

        if (!name.trim()) {
          errors.name = "Please enter your full name.";
        }

        if (!email.trim()) {
          errors.email = "Please enter your email address.";
        } else if (!isValidEmail(email)) {
          errors.email = "That doesn't look like a valid email address.";
        }

        if (!password) {
          errors.password = "Please create a password.";
        } else if (password.length < 6) {
          errors.password = "Password must be at least 6 characters.";
        }

        if (!confirmPassword) {
          errors.confirmPassword = "Please confirm your password.";
        } else if (password !== confirmPassword) {
          errors.confirmPassword = "Passwords do not match.";
        }

        if (role === "SERVICE_PROVIDER") {

          if (!phone.trim()) {
            errors.phone = "Please enter your phone number.";
          }

          if (!businessName.trim()) {
            errors.businessName = "Please enter your garage or business name.";
          }

          if (!address.trim()) {
            errors.address = "Please enter your business address.";
          }

          if (latitude === null || longitude === null) {
            errors.location = "Please share your location so drivers can find you.";
          }

        }

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {

          setError(
            "Please fix the highlighted fields below."
          );

          window.scrollTo({ top: 0, behavior: "smooth" });

          return;
        }


        // =============================================
        // START LOADING
        // =============================================

        setLoading(true);


        // =============================================
        // REGISTER
        // =============================================

        const data =
          await registerUser({

            name: name.trim(),

            email: email.trim(),

            password,

            role,


            // =========================================
            // SERVICE PROVIDER DATA
            // =========================================

            ...(role ===
              "SERVICE_PROVIDER" && {

              phone,

              businessName,

              address,

              latitude:
                latitude!,

              longitude:
                longitude!,

            }),

          });


        // =============================================
        // SUCCESS
        // =============================================

        setSuccess(

          data.message ||
            "Account created successfully."

        );


        // =============================================
        // GO TO LOGIN
        // =============================================

        setTimeout(() => {

          navigate(
            "/login"
          );

        }, 1200);

      } catch (
        error: any
      ) {

        console.error(
          "Registration error:",
          error
        );


        setError(
          getErrorMessage(
            error,
            "Registration failed. Please try again."
          )
        );

        window.scrollTo({ top: 0, behavior: "smooth" });

      } finally {

        setLoading(
          false
        );

      }

    };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto w-full max-w-2xl">


        {/* =============================================
            BACK
        ============================================= */}

        <BackButton
          to="/"
        />

        {/* =============================================
            MAIN CARD
        ============================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl mt-6">


          {/* ===========================================
              LOGO
          =========================================== */}

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white">

              <img
                src="/roadrescue-logo.png"
                alt="RoadRescue Logo"
                className="h-full w-full object-contain"
              />

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


          {/* ===========================================
              TITLE
          =========================================== */}

          <div className="mt-8">

            <h2 className="text-3xl font-bold text-slate-900">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose how you want to use RoadRescue.
            </p>

          </div>


          {/* ===========================================
              ERROR
          =========================================== */}

          {error && (

            <FormAlert
              type="error"
              message={error}
              onClose={() => setError("")}
            />

          )}


          {/* ===========================================
              SUCCESS
          =========================================== */}

          {success && (

            <FormAlert
              type="success"
              message={`${success} Redirecting to login...`}
            />

          )}


          {/* ===========================================
              ROLE SELECTION
          =========================================== */}

          <div className="mt-8">

            <label className="text-sm font-semibold text-slate-700">

              I want to register as

            </label>


            <div className="mt-3 grid gap-4 sm:grid-cols-2">


              {/* =======================================
                  DRIVER
              ======================================= */}

              <button
                type="button"
                onClick={() => {

                  setRole(
                    "DRIVER"
                  );

                  // Clear mechanic location
                  setLatitude(
                    null
                  );

                  setLongitude(
                    null
                  );

                }}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  role ===
                  "DRIVER"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">

                    🚗

                  </div>


                  {role ===
                    "DRIVER" && (

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


              {/* =======================================
                  SERVICE PROVIDER
              ======================================= */}

              <button
                type="button"
                onClick={() =>
                  setRole(
                    "SERVICE_PROVIDER"
                  )
                }
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  role ===
                  "SERVICE_PROVIDER"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">

                    🔧

                  </div>


                  {role ===
                    "SERVICE_PROVIDER" && (

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


          {/* ===========================================
              PERSONAL INFORMATION
          =========================================== */}

          <div className="mt-8">

            <h3 className="text-lg font-bold text-slate-900">

              Personal Information

            </h3>


            {/* NAME */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Full Name *

              </label>


              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                autoComplete="name"
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError("name");
                }}
                className={inputClass("name")}
              />

              {renderFieldError("name")}

            </div>


            {/* EMAIL */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Email Address *

              </label>


              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                className={inputClass("email")}
              />

              {renderFieldError("email")}

            </div>


            {/* PHONE */}

            {role ===
              "SERVICE_PROVIDER" && (

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Phone Number *

                </label>


                <input
                  type="tel"
                  placeholder="07X XXX XXXX"
                  value={phone}
                  autoComplete="tel"
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearFieldError("phone");
                  }}
                  className={inputClass("phone")}
                />

                {renderFieldError("phone")}

              </div>

            )}

          </div>


          {/* ===========================================
              SERVICE PROVIDER INFORMATION
          =========================================== */}

          {role ===
            "SERVICE_PROVIDER" && (

            <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/50 p-5">


              {/* HEADER */}

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


              {/* BUSINESS NAME */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Garage / Business Name *

                </label>


                <input
                  type="text"
                  placeholder="e.g. ABC Auto Care"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    clearFieldError("businessName");
                  }}
                  className={inputClass("businessName")}
                />

                {renderFieldError("businessName")}

              </div>


              {/* ADDRESS */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Business Address *

                </label>


                <textarea
                  placeholder="Enter your garage or service area"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    clearFieldError("address");
                  }}
                  rows={3}
                  className={`resize-none ${inputClass("address")}`}
                />

                {renderFieldError("address")}

              </div>


              {/* =======================================
                  LOCATION
              ======================================= */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Service Location *

                </label>


                <p className="mb-3 text-xs leading-5 text-slate-500">

                  Your current location will be used to help drivers find nearby service providers.

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
                  className="w-full rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {locationLoading

                    ? "📍 Getting your location..."

                    : "📍 Use My Current Location"}

                </button>


                {/* LOCATION SUCCESS */}

                {latitude !==
                  null &&
                  longitude !==
                    null && (

                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">

                    <div className="flex items-center gap-2">

                      <span className="text-lg">
                        ✅
                      </span>


                      <div>

                        <p className="text-sm font-semibold text-green-800">

                          Location captured successfully

                        </p>

                        <p className="text-xs text-green-700">

                          Your location is ready to be saved.

                        </p>

                      </div>

                    </div>


                    <div className="mt-3 grid gap-2 rounded-lg bg-white/60 p-3 text-xs text-green-700 sm:grid-cols-2">

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

                )}


                {/* LOCATION NOT SELECTED */}

                {latitude ===
                  null &&
                  longitude ===
                    null && (

                  <div className={`mt-4 rounded-xl border border-dashed bg-white p-5 text-center ${
                    fieldErrors.location
                      ? "border-red-400"
                      : "border-slate-300"
                  }`}>

                    <div className="text-2xl">
                      📍
                    </div>


                    <p className="mt-2 text-sm font-semibold text-slate-700">

                      Location not selected

                    </p>


                    <p className="mt-1 text-xs text-slate-500">

                      You must share your location before registering as a service provider.

                    </p>

                  </div>

                )}

                {renderFieldError("location")}

              </div>

            </div>

          )}


          {/* ===========================================
              PASSWORD
          =========================================== */}

          <div className="mt-8">

            <h3 className="text-lg font-bold text-slate-900">

              Security

            </h3>


            <div className="mt-5 grid gap-5 sm:grid-cols-2">


              {/* PASSWORD */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Password *

                </label>


                <PasswordInput
                  id="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  autoComplete="new-password"
                  error={fieldErrors.password}
                  onChange={(value) => {
                    setPassword(value);
                    clearFieldError("password");
                  }}
                />

              </div>


              {/* CONFIRM */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Confirm Password *

                </label>


                <PasswordInput
                  id="confirmPassword"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  error={fieldErrors.confirmPassword}
                  onChange={(value) => {
                    setConfirmPassword(value);
                    clearFieldError("confirmPassword");
                  }}
                />

              </div>

            </div>

          </div>


          {/* ===========================================
              REGISTER BUTTON
          =========================================== */}

          <button
            type="button"
            onClick={
              handleRegister
            }
            disabled={
              loading
            }
            className="mt-8 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading

              ? "Creating Account..."

              : role ===
                "DRIVER"

              ? "Create Driver Account"

              : "Create Service Provider Account"}

          </button>


          {/* ===========================================
              GOOGLE (drivers only: providers need garage details)
          =========================================== */}

          {role === "DRIVER" && (
            <GoogleSignInButton
              text="signup_with"
              onError={setError}
            />
          )}


          {/* ===========================================
              LOGIN LINK
          =========================================== */}

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


        {/* =============================================
            FOOTER
        ============================================= */}

        <p className="mt-6 text-center text-xs text-slate-400">

          © 2026 RoadRescue. Vehicle Breakdown Assistance.

        </p>

      </div>

    </div>

  );
}


export default RegisterPage;