import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import ComplaintTable from "../components/ComplaintTable.jsx";
import { useApp } from "../context/AppContext.jsx";
import { STATUS } from "../data/mockData.js";

export default function GovernmentDashboard() {
  const { complaints = [], users = [] } = useApp();

  const stats = {
    total: complaints.length,
    newOnes: complaints.filter(
      (c) => c.status === STATUS.PENDING
    ).length,
    progress: complaints.filter(
      (c) => c.status === STATUS.IN_PROGRESS
    ).length,
    resolved: complaints.filter(
      (c) => c.status === STATUS.RESOLVED
    ).length,
    blockedUsers: users.filter(
      (u) => u.status === "blocked"
    ).length,
    highPriority: complaints.filter(
      (c) => String(c.priority || "").toLowerCase() === "high"
    ).length,
  };

  const CARDS = [
    { label: "Total Complaints", value: stats.total },
    { label: "New Complaints", value: stats.newOnes },
    { label: "In Progress", value: stats.progress },
    { label: "Resolved", value: stats.resolved },
    { label: "Blocked Users", value: stats.blockedUsers },
    { label: "High Priority", value: stats.highPriority },
  ];

  return (
    <div className="flex min-h-screen bg-mist">
      <Sidebar />

      <main className="flex-1 px-5 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink">
          Municipal Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate">
          A city-wide overview of citizen complaints and AI priorities.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {CARDS.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-100 bg-white p-5"
            >
              <p className="text-xs font-medium text-slate">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-ink">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">
            All complaints by AI priority
          </h2>

          <ComplaintTable
            complaints={complaints}
            showCitizen
            detailsBase="/government/complaint"
          />
        </div>
      </main>
    </div>
  );
}