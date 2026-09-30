import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLandmark } from "react-icons/fa";
import { MdOutlineNotifications, MdLogout, MdAdd } from "react-icons/md";
import { useApp } from "../context/AppContext.jsx";
import { STATUS } from "../data/mockData.js";
import ComplaintTable from "../components/ComplaintTable.jsx";

export default function UserDashboard() {
  const { currentUser, complaints, notifications, logout } = useApp();
  const navigate = useNavigate();

  const mine = complaints.filter((c) => c.citizenEmail === currentUser.email);
  const counts = {
    total: mine.length,
    pending: mine.filter((c) => c.status === STATUS.PENDING).length,
    progress: mine.filter((c) => c.status === STATUS.IN_PROGRESS).length,
    resolved: mine.filter((c) => c.status === STATUS.RESOLVED).length,
  };
  const myNotifications = notifications.filter((n) => n.role === "citizen" && n.email === currentUser.email).slice(0, 4);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const CARDS = [
    { label: "Total Complaints", value: counts.total, tone: "bg-brand-50 text-brand-700" },
    { label: "Pending", value: counts.pending, tone: "badge-pending" },
    { label: "In Progress", value: counts.progress, tone: "badge-progress" },
    { label: "Resolved", value: counts.resolved, tone: "badge-resolved" },
  ];

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-brand-700">
            <FaLandmark /> Jan Seva
          </Link>
          <div className="flex items-center gap-4">
            <button className="relative text-slate hover:text-brand-600" title="Notifications">
              <MdOutlineNotifications size={22} />
              {myNotifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
                  {myNotifications.length}
                </span>
              )}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-slate hover:text-rose-500">
              <MdLogout /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Welcome, {currentUser.name}</h1>
            <p className="mt-1 text-sm text-slate">Here's an overview of the problems you've reported.</p>
          </div>
          <Link
            to="/report-problem"
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
          >
            <MdAdd size={18} /> Report New Problem
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div key={c.label} className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-xs font-medium text-slate">{c.label}</p>
              <p className="mt-2 text-3xl font-bold text-ink">{c.value}</p>
            </div>
          ))}
        </div>

        {myNotifications.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">
            <h2 className="font-display text-sm font-semibold text-ink">Recent notifications</h2>
            <ul className="mt-3 space-y-2">
              {myNotifications.map((n) => (
                <li key={n.id} className="flex items-center justify-between text-sm text-slate">
                  <span>{n.message}</span>
                  <span className="text-xs text-slate">{n.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Your complaints</h2>
          <ComplaintTable complaints={mine} detailsBase="/complaint" />
        </div>
      </main>
    </div>
  );
}
