import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import ComplaintTable from "../components/ComplaintTable.jsx";
import { useApp } from "../context/AppContext.jsx";
import { STATUS } from "../data/mockData.js";

export default function GovernmentDashboard() {
  const { complaints, users } = useApp();

  const stats = {
    total: complaints.length,
    newOnes: complaints.filter((c) => c.status === STATUS.PENDING).length,
    progress: complaints.filter((c) => c.status === STATUS.IN_PROGRESS).length,
    resolved: complaints.filter((c) => c.status === STATUS.RESOLVED).length,
    blockedUsers: users.filter((u) => u.status === "blocked").length,
  };

  const CARDS = [
    { label: "Total Complaints", value: stats.total },
    { label: "New Complaints", value: stats.newOnes },
    { label: "In Progress", value: stats.progress },
    { label: "Resolved", value: stats.resolved },
    { label: "Blocked Users", value: stats.blockedUsers },
  ];

  return (
    <div className="flex min-h-screen bg-mist">
      <Sidebar />
      <main className="flex-1 px-5 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink">Municipal Dashboard</h1>
        <p className="mt-1 text-sm text-slate">A city-wide overview of citizen complaints.</p>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {CARDS.map((c) => (
            <div key={c.label} className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-xs font-medium text-slate">{c.label}</p>
              <p className="mt-2 text-3xl font-bold text-ink">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Recent complaints</h2>
          <ComplaintTable complaints={complaints.slice(0, 6)} showCitizen detailsBase="/government/complaint" />
        </div>
      </main>
    </div>
  );
}
