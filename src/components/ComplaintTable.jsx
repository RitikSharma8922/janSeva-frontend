import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

// showCitizen: adds a "Citizen" column (used on the government side).
// detailsBase: the route prefix to link each row to, e.g. "/complaint" or "/government/complaint".
export default function ComplaintTable({ complaints, showCitizen = false, detailsBase = "/complaint" }) {
  const navigate = useNavigate();

  if (complaints.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-mist px-6 py-12 text-center text-sm text-slate">
        No complaints to show here yet.
      </div>
    );
  }

  return (
    <div className="table-scroll overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-mist text-xs uppercase tracking-wide text-slate">
          <tr>
            <th className="px-4 py-3">Complaint ID</th>
            {showCitizen && <th className="px-4 py-3">Citizen</th>}
            <th className="px-4 py-3">Problem</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {complaints.map((c) => (
            <tr key={c.id} className="hover:bg-mist/60">
              <td className="px-4 py-3 font-semibold text-brand-700">{c.id}</td>
              {showCitizen && <td className="px-4 py-3">{c.citizenName}</td>}
              <td className="px-4 py-3">
                <div className="font-medium">{c.category}</div>
                <div className="max-w-[220px] truncate text-xs text-slate">{c.title}</div>
              </td>
              <td className="px-4 py-3">{c.location}</td>
              <td className="px-4 py-3">{c.date}</td>
              <td className="px-4 py-3">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => navigate(`${detailsBase}/${c.id}`)}
                  className="rounded-lg border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
