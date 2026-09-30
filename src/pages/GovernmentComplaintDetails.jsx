import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useApp } from "../context/AppContext.jsx";
import { STATUS } from "../data/mockData.js";

export default function GovernmentComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, updateComplaintStatus } = useApp();
  const complaint = complaints.find((c) => c.id === id);

  const [remarks, setRemarks] = useState(complaint?.govRemarks || "");
  const [resolutionRemarks, setResolutionRemarks] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState(null);
  const [showResolveForm, setShowResolveForm] = useState(false);

  if (!complaint) {
    return <p className="p-8 text-sm text-slate">Complaint not found.</p>;
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setResolutionPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function startWork() {
    updateComplaintStatus(complaint.id, STATUS.IN_PROGRESS, { govRemarks: remarks });
  }

  function saveRemarks() {
    updateComplaintStatus(complaint.id, complaint.status, { govRemarks: remarks });
  }

  function reject() {
    updateComplaintStatus(complaint.id, STATUS.REJECTED, { govRemarks: remarks });
  }

  function confirmResolve(e) {
    e.preventDefault();
    updateComplaintStatus(complaint.id, STATUS.RESOLVED, {
      resolutionRemarks,
      resolutionPhoto,
    });
    setShowResolveForm(false);
  }

  return (
    <div className="flex min-h-screen bg-mist">
      <Sidebar />
      <main className="flex-1 px-5 py-8 md:px-8">
        <button onClick={() => navigate(-1)} className="text-xs font-semibold text-brand-600 hover:underline">
          ← Back
        </button>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-brand-600">{complaint.id}</p>
            <h1 className="font-display text-2xl font-bold text-ink">{complaint.title}</h1>
            <p className="mt-1 text-sm text-slate">Reported by {complaint.citizenName} on {complaint.date}</p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="font-display text-sm font-semibold text-ink">Complaint details</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-xs text-slate">Category</dt><dd className="font-medium">{complaint.category}</dd></div>
                <div><dt className="text-xs text-slate">Location</dt><dd className="font-medium">{complaint.location}</dd></div>
              </dl>
              <div className="mt-4">
                <dt className="text-xs text-slate">Description</dt>
                <dd className="mt-1 text-sm text-ink">{complaint.description}</dd>
              </div>
              {complaint.photo ? (
                <div className="mt-4">
                  <dt className="mb-2 text-xs text-slate">Complaint photo</dt>
                  <img src={complaint.photo} alt="Complaint" className="max-h-72 rounded-xl object-cover" />
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate">No photo was attached to this complaint.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="font-display text-sm font-semibold text-ink">Official remarks</h2>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add a note visible to the citizen..."
                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
              <button onClick={saveRemarks} className="mt-3 rounded-lg border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50">
                Save Remarks
              </button>
            </div>

            {showResolveForm && (
              <form onSubmit={confirmResolve} className="rounded-2xl border border-leaf-500/30 bg-leaf-50 p-6">
                <h2 className="font-display text-sm font-semibold text-leaf-600">Mark as Resolved</h2>
                <label className="mb-1 mt-3 block text-xs font-medium text-ink">Resolution Remarks</label>
                <textarea
                  required
                  rows={3}
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  placeholder="Describe how the problem was resolved..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-leaf-500 focus:outline-none"
                />
                <label className="mb-1 mt-3 block text-xs font-medium text-ink">Upload Resolution Photo (optional)</label>
                <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFile} className="text-xs" />
                {resolutionPhoto && <img src={resolutionPhoto} alt="Resolution" className="mt-3 max-h-40 rounded-xl object-cover" />}
                <div className="mt-4 flex gap-3">
                  <button type="submit" className="rounded-lg bg-leaf-500 px-4 py-2 text-xs font-semibold text-white hover:bg-leaf-600">
                    Confirm Resolved
                  </button>
                  <button type="button" onClick={() => setShowResolveForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-ink">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="font-display text-sm font-semibold text-ink">Actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={startWork}
                  disabled={complaint.status !== STATUS.PENDING}
                  className="rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Start Work
                </button>
                <button
                  onClick={() => setShowResolveForm(true)}
                  disabled={complaint.status === STATUS.RESOLVED || complaint.status === STATUS.REJECTED}
                  className="rounded-lg bg-leaf-500 py-2.5 text-sm font-semibold text-white hover:bg-leaf-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={reject}
                  disabled={complaint.status === STATUS.RESOLVED || complaint.status === STATUS.REJECTED}
                  className="rounded-lg border border-rose-500 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Reject Complaint
                </button>
              </div>
            </div>

            {complaint.status === STATUS.RESOLVED && (
              <div className="rounded-2xl border border-leaf-500/30 bg-leaf-50 p-6 text-sm">
                <h2 className="font-display text-sm font-semibold text-leaf-600">Resolution on file</h2>
                <p className="mt-2 text-ink">{complaint.resolutionRemarks}</p>
                <p className="mt-2 text-xs text-slate">Resolved on {complaint.resolutionDate}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
