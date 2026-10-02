import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLandmark } from "react-icons/fa";
import { useApp } from "../context/AppContext.jsx";

export default function UserLogin() {
  const { loginCitizen } = useApp();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginCitizen(
        emailOrPhone.trim(),
        password
      );

      if (!result.ok) {
        setError(result.error || "Login failed");
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/user-dashboard");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
            <FaLandmark size={22} />
          </span>

          <h1 className="font-display text-xl font-bold text-ink">
            Citizen Login
          </h1>

          <p className="mt-1 text-sm text-slate">
            Report and track civic problems in your area.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Mobile Number / Email
            </label>

            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="citizen@test.com"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="mt-5 flex items-center justify-between text-xs">

          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:underline"
          >
            Create Account
          </Link>

          <button
            type="button"
            className="text-slate hover:underline"
            onClick={() =>
              alert("Password reset is not available in this frontend demo.")
            }
          >
            Forgot Password
          </button>

        </div>

        <p className="mt-6 rounded-lg bg-brand-50 px-3 py-2 text-center text-xs text-brand-700">
          Demo login - citizen@test.com / 123456
        </p>

        <p className="mt-3 text-center text-xs text-slate">
          Municipal officer?{" "}
          <Link
            to="/government-login"
            className="font-semibold text-brand-600 hover:underline"
          >
            Government Login
          </Link>
        </p>

      </div>
    </div>
  );
}