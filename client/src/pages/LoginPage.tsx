import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const data = await loginUser({
        email,
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
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      {/* Main Card */}
      <div className="w-full max-w-md">

        {/* Back to Home */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          ← Back to Home
        </Link>


        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-2xl text-white shadow-sm">
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


          {/* Heading */}
          <div className="mt-8">

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Login to your RoadRescue account to continue.
            </p>

          </div>


          {/* Error Message */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

              <span className="text-lg">
                ⚠️
              </span>

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>
          )}


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
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>


          {/* Password */}
          <div className="mt-5">

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>


          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="mt-7 w-full rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 active:scale-[0.99]"
          >
            Login
          </button>


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


        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 RoadRescue. Vehicle Breakdown Assistance.
        </p>

      </div>

    </div>
  );
}

export default LoginPage;