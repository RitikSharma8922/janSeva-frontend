import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";
import { useApp } from "../context/AppContext.jsx";

export default function GovernmentLogin() {
  const { loginGovernment } = useApp();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await loginGovernment(id.trim(), password);

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/government-dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-700 px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">

        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white">
            <MdAdminPanelSettings size={24} />
          </span>

          <span className="mb-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700">
            OFFICIAL MUNICIPAL PORTAL
          </span>

          <h1 className="font-display text-xl font-bold text-ink">
            Government Login
          </h1>

          <p className="mt-1 text-sm text-slate">
            Restricted access for municipal officers only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Government / Municipal ID
            </label>

            <input
              type="text"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="GOV-1001"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
              placeholder="••••••"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
            className="w-full rounded-lg bg-brand-700 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Government Login"}
          </button>
        </form>

        <p className="mt-6 rounded-lg bg-mist px-3 py-2 text-center text-xs text-slate">
          Demo login — GOV-1001 / 123456
        </p>

        <p className="mt-3 text-center text-xs text-slate">
          Are you a citizen?{" "}
          <Link
            to="/user-login"
            className="font-semibold text-brand-600 hover:underline"
          >
            Citizen Login
          </Link>
        </p>

      </div>
    </div>
  );
}