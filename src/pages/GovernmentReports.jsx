import React, { useMemo } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useApp } from "../context/AppContext.jsx";
import { CATEGORIES, STATUS } from "../data/mockData.js";

function Bar({ label, value, total, tone }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-mist">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function GovernmentReports() {
  const { complaints } = useApp();

  const byCategory = useMemo(
    () => CATEGORIES.map((cat) => ({ label: cat, value: complaints.filter((c) => c.category === cat).length })),
    [complaints]
  );

  const byStatus = useMemo(
    () => [
      { label: STATUS.PENDING, value: complaints.filter((c) => c.status === STATUS.PENDING).length, tone: "bg-amber-500" },
      { label: STATUS.IN_PROGRESS, value: complaints.filter((c) => c.status === STATUS.IN_PROGRESS).length, tone: "bg-brand-500" },
      { label: STATUS.RESOLVED, value: complaints.filter((c) => c.status === STATUS.RESOLVED).length, tone: "bg-leaf-500" },
      { label: STATUS.REJECTED, value: complaints.filter((c) => c.status === STATUS.REJECTED).length, tone: "bg-rose-500" },
    ],
    [complaints]
  );

  const total = complaints.length;
  const resolvedPct = total ? Math.round((byStatus[2].value / total) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-mist">
      <Sidebar />
      <main className="flex-1 px-5 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink">Reports</h1>
        <p className="mt-1 text-sm text-slate">A quick summary of complaint activity across the city.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h2 className="font-display text-sm font-semibold text-ink">Complaints by status</h2>
            <div className="mt-4 space-y-4">
              {byStatus.map((s) => (
                <Bar key={s.label} label={s.label} value={s.value} total={total} tone={s.tone} />
              ))}
            </div>
            <p className="mt-4 text-xs text-slate">{resolvedPct}% of all complaints have been resolved.</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h2 className="font-display text-sm font-semibold text-ink">Complaints by category</h2>
            <div className="mt-4 space-y-4">
              {byCategory.map((c) => (
                <Bar key={c.label} label={c.label} value={c.value} total={total} tone="bg-brand-500" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
