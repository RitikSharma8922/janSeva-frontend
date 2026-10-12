import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

const getPriority = (priority) => {
  const value = String(priority || "Medium").toLowerCase();

  if (value === "high") return "High";
  if (value === "low") return "Low";

  return "Medium";
};

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

export default function ComplaintTable({
  complaints = [],
  showCitizen = false,
  detailsBase = "/complaint",
}) {
  const navigate = useNavigate();

  // High priority complaints first, then Medium, then Low.
  const sortedComplaints = [...complaints].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };

    return (
      order[getPriority(a.priority)] -
      order[getPriority(b.priority)]
    );
  });

  if (sortedComplaints.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-mist px-6 py-12 text-center text-sm text-slate">
        No complaints to show here yet.
      </div>
    );
  }

  return (
    <div className="table-scroll overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-mist text-xs uppercase tracking-wide text-slate">
          <tr>
            <th className="px-4 py-3">Complaint ID</th>

            {showCitizen && (
              <th className="px-4 py-3">Citizen</th>
            )}

            <th className="px-4 py-3">Problem</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {sortedComplaints.map((c) => {
            const priority = getPriority(c.priority);

            return (
              <tr key={c.id} className="hover:bg-mist/60">
                <td className="px-4 py-3 font-semibold text-brand-700">
                  {c.id}
                </td>

                {showCitizen && (
                  <td className="px-4 py-3">
                    {c.citizenName || "Citizen"}
                  </td>
                )}

                <td className="px-4 py-3">
                  <div className="font-medium">{c.category}</div>

                  <div className="max-w-[220px] truncate text-xs text-slate">
                    {c.title}
                  </div>

                  {c.summary && (
                    <div className="mt-1 max-w-[240px] text-xs text-slate">
                      AI summary: {c.summary}
                    </div>
                  )}

                  {c.priorityReason && (
                    <div className="mt-1 max-w-[240px] text-xs text-slate">
                      Priority reason: {c.priorityReason}
                    </div>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[priority]}`}
                  >
                    {priority}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {c.location || "Not provided"}
                </td>

                <td className="px-4 py-3">
                  {c.date || "—"}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      navigate(`${detailsBase}/${c.id}`)
                    }
                    className="rounded-lg border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}