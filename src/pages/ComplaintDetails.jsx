import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaLandmark } from "react-icons/fa";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { useApp } from "../context/AppContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function ComplaintDetails() {
  const { id } = useParams();
  const { complaints } = useApp();
  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate">
        Complaint not found. <Link to="/user-dashboard" className="ml-2 font-semibold text-brand-600">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link to="/user-dashboard" className="flex items-center gap-2 font-display text-lg font-bold text-brand-700">
            <FaLandmark /> Jan Seva
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-brand-600">{complaint.id}</p>
            <h1 className="font-display text-2xl font-bold text-ink">{complaint.title}</h1>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="font-display text-sm font-semibold text-ink">Complaint details</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-slate">Category</dt>
                  <dd className="font-medium">{complaint.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate">Location</dt>
                  <dd className="font-medium">{complaint.location}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate">Date submitted</dt>
                  <dd className="font-medium">{complaint.date}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate">Status</dt>
                  <dd className="font-medium">{complaint.status}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <dt className="text-xs text-slate">Description</dt>
                <dd className="mt-1 text-sm text-ink">{complaint.description}</dd>
              </div>
              {complaint.photo && (
                <div className="mt-4">
                  <dt className="mb-2 text-xs text-slate">Photo</dt>
                  <img src={complaint.photo} alt="Complaint" className="max-h-64 rounded-xl object-cover" />
                </div>
              )}
            </div>

            {complaint.govRemarks && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <h2 className="font-display text-sm font-semibold text-ink">Government remarks</h2>
                <p className="mt-2 text-sm text-slate">{complaint.govRemarks}</p>
              </div>
            )}

            {complaint.status === "Resolved" && (
              <div className="rounded-2xl border border-leaf-500/30 bg-leaf-50 p-6">
                <h2 className="font-display text-sm font-semibold text-leaf-600">Resolution</h2>
                <p className="mt-2 text-sm text-ink">{complaint.resolutionRemarks}</p>
                {complaint.resolutionPhoto && (
                  <img src={complaint.resolutionPhoto} alt="Resolution" className="mt-3 max-h-56 rounded-xl object-cover" />
                )}
                <p className="mt-3 text-xs text-slate">Resolved on {complaint.resolutionDate}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h2 className="font-display text-sm font-semibold text-ink">Timeline</h2>
            <ol className="mt-4 space-y-5">
              {complaint.timeline.map((step, i) => (
                <li key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {step.done ? (
                      <MdCheckCircle className="text-leaf-500" size={20} />
                    ) : (
                      <MdRadioButtonUnchecked className="text-slate-300" size={20} />
                    )}
                    {i < complaint.timeline.length - 1 && (
                      <span className={`mt-1 h-8 w-0.5 ${step.done ? "bg-leaf-500" : "bg-slate-200"}`} />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${step.done ? "text-ink" : "text-slate"}`}>{step.label}</p>
                    {step.date && <p className="text-xs text-slate">{step.date}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
