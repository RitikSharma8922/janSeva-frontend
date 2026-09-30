import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import ComplaintTable from "../components/ComplaintTable.jsx";
import { useApp } from "../context/AppContext.jsx";
import { CATEGORIES } from "../data/mockData.js";

export default function GovernmentComplaints() {
  const { complaints } = useApp();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "All");
  const [category, setCategory] = useState("All");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        !search ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || c.status === status;
      const matchesCategory = category === "All" || c.category === category;
      const matchesDate = !date || c.date === date;
      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [complaints, search, status, category, date]);

  return (
    <div className="flex min-h-screen bg-mist">
      <Sidebar />
      <main className="flex-1 px-5 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink">All Complaints</h1>
        <p className="mt-1 text-sm text-slate">Search and filter every complaint reported across the city.</p>

        <div className="mt-6 grid gap-3 rounded-2xl border border-slate-100 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Search by ID, citizen, category, location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <p className="mt-4 text-xs text-slate">{filtered.length} complaint(s) found</p>
        <div className="mt-2">
          <ComplaintTable complaints={filtered} showCitizen detailsBase="/government/complaint" />
        </div>
      </main>
    </div>
  );
}
