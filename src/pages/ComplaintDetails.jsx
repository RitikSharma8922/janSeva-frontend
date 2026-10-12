import React from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function ComplaintDetails() {
  const { id } = useParams();
  const { complaints } = useApp();

  const complaint = complaints.find((item) => String(item.id) === String(id));

  if (!complaint) {
    return (
      <div className="min-h-screen bg-mist px-5 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-xl font-bold text-ink">
            Complaint not found
          </h1>

          <p className="mt-2 text-sm text-slate">
            The complaint you are looking for could not be found.
          </p>

          <Link
            to="/user-dashboard"
            className="mt-5 inline-block rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist px-5 py-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/user-dashboard"
          className="mb-5 inline-block text-sm font-semibold text-brand-700 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate">
                Complaint ID
              </p>

              <h1 className="mt-1 text-2xl font-bold text-ink">
                {complaint.id}
              </h1>
            </div>

            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {complaint.status}
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate">
                Category
              </p>

              <p className="mt-1 text-sm text-ink">
                {complaint.category || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate">
                Date
              </p>

              <p className="mt-1 text-sm text-ink">
                {complaint.created_at
                  ? new Date(complaint.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate">
                Title
              </p>

              <p className="mt-1 text-base font-semibold text-ink">
                {complaint.title || "—"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate">
                Description
              </p>

              <p className="mt-1 text-sm leading-6 text-slate">
                {complaint.description || "—"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate">
                Location
              </p>

              <p className="mt-1 text-sm text-ink">
                {complaint.location || "—"}
              </p>
            </div>
          </div>

          {complaint.photo_url && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold text-slate">
                Complaint Photo
              </p>

              <img
                src={complaint.photo_url}
                alt="Complaint"
                className="max-h-80 w-full rounded-xl object-cover"
              />
            </div>
          )}

          {complaint.gov_remarks && (
            <div className="mt-6 rounded-xl bg-mist p-4">
              <p className="text-xs font-semibold text-slate">
                Government Remarks
              </p>

              <p className="mt-1 text-sm text-ink">
                {complaint.gov_remarks}
              </p>
            </div>
          )}

          {complaint.resolution_remarks && (
            <div className="mt-4 rounded-xl bg-green-50 p-4">
              <p className="text-xs font-semibold text-green-700">
                Resolution Remarks
              </p>

              <p className="mt-1 text-sm text-ink">
                {complaint.resolution_remarks}
              </p>
            </div>
          )}

          {complaint.resolution_photo_url && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold text-slate">
                Resolution Photo
              </p>

              <img
                src={complaint.resolution_photo_url}
                alt="Resolution"
                className="max-h-80 w-full rounded-xl object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}