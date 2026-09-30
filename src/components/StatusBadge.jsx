import React from "react";

const CLASS_BY_STATUS = {
  Pending: "badge-pending",
  "In Progress": "badge-progress",
  Resolved: "badge-resolved",
  Rejected: "badge-rejected",
};

// Small pill used everywhere a complaint status is shown.
export default function StatusBadge({ status }) {
  const cls = CLASS_BY_STATUS[status] || "badge-pending";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
