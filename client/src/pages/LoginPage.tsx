import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import AuthShell from "../components/AuthShell";
import FormAlert from "../components/FormAlert";
import PasswordInput from "../components/PasswordInput";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, isValidEmail } from "../utils/apiError";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    // Validate before calling the server
    const errors: typeof fieldErrors = {};

    if (!email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!isValidEmail(email)) {
      errors.email = "That doesn't look like a valid email address.";
    }

    if (!password) {
      errors.password = "Please enter your password.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);

      const data = await loginUser({
        email: email.trim(),
        password,
      });

      // Save authentication data
      login(data.token, data.user);

      // Redirect according to user role
      if (data.user.role === "SERVICE_PROVIDER") {
        navigate("/mechanic");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      setError(
        error.response?.status === 401
          ? "Incorrect email or password. Please check and try again."
          : getErrorMessage(error, "Login failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>

        {/* Back to Home */}
        <BackButton
          to="/"
        />

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">

          {/* Logo (mobile; large screens show the side panel) */}
          <div className="flex items-center gap-3 lg:hidden">

            <div className="h-12 w-12 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-slate-100">
              <img
                src="/roadrescue-logo.png"
                alt="RoadRescue Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                RoadRescue
              </h1>

              <p className="text-xs text-slate-500">
                Your Ride, Our Rescue.
              </p>
            </div>

          </div>


          {/* Heading */}
          <div className="mt-8 lg:mt-0">

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back 👋
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Log in to request help or check on your mechanic.
            </p>

          </div>


          {/* Error Message */}
          {error && (
            <FormAlert
              type="error"
              message={error}
              onClose={() => setError("")}
            />
          )}


          <form onSubmit={handleLogin} noValidate>

          {/* Email */}
          <div className="mt-6">

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                fieldErrors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-50"
              }`}
            />

            {fieldErrors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {fieldErrors.email}
              </p>
            )}

          </div>


          {/* Password */}
          <div className="mt-5">

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={password}
              autoComplete="current-password"
              error={fieldErrors.password}
              onChange={(value) => {
                setPassword(value);
                setFieldErrors({ ...fieldErrors, password: undefined });
              }}
            />

          </div>


          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          </form>


          {/* Google */}
          <GoogleSignInButton
            text="signin_with"
            onError={setError}
          />


          {/* Register */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="mt-1 inline-block font-bold text-blue-600 transition hover:text-blue-700"
            >
              Create an account
            </Link>

          </div>

        </div>


        {/* Footer (mobile) */}
        <p className="mt-6 text-center text-xs text-slate-400 lg:hidden">
          © 2026 RoadRescue. Vehicle Breakdown Assistance.
        </p>

    </AuthShell>
  );
}

export default LoginPage;