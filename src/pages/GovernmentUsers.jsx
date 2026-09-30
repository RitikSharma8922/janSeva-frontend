import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function GovernmentUsers() {
  const { users, complaintsCountFor, setUserStatus } = useApp();
  const [pendingAction, setPendingAction] = useState(null); // { userId, name, nextStatus }

  function confirmAction() {
    if (!pendingAction) return;
    setUserStatus(pendingAction.userId, pendingAction.nextStatus);
    setPendingAction(null);
  }

  return (
    <div className="flex min-h-screen bg-mist">
      <Sidebar />
      <main className="flex-1 px-5 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink">Users</h1>
        <p className="mt-1 text-sm text-slate">Manage citizen accounts registered on Jan Seva.</p>

        <div className="mt-6 table-scroll overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email / Mobile</th>
                <th className="px-4 py-3">Complaints</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-mist/60">
                  <td className="px-4 py-3 font-semibold text-brand-700">{u.id}</td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-slate">{u.email} · {u.phone}</td>
                  <td className="px-4 py-3">{complaintsCountFor(u.email)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.status === "blocked" ? "badge-rejected" : "badge-resolved"}`}>
                      {u.status === "blocked" ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.status === "blocked" ? (
                      <button
                        onClick={() => setPendingAction({ userId: u.id, name: u.name, nextStatus: "active", verb: "unblock" })}
                        className="rounded-lg border border-leaf-500 px-3 py-1.5 text-xs font-semibold text-leaf-600 hover:bg-leaf-50"
                      >
                        Unblock User
                      </button>
                    ) : (
                      <button
                        onClick={() => setPendingAction({ userId: u.id, name: u.name, nextStatus: "blocked", verb: "block" })}
                        className="rounded-lg border border-rose-500 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                      >
                        Block User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-display text-base font-semibold text-ink">
              Are you sure you want to {pendingAction.verb} {pendingAction.name}?
            </h2>
            <p className="mt-2 text-sm text-slate">
              {pendingAction.verb === "block"
                ? "A blocked user will not be able to submit new complaints."
                : "This user will regain access to submit new complaints."}
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={confirmAction} className="flex-1 rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
                Yes, {pendingAction.verb === "block" ? "block" : "unblock"}
              </button>
              <button onClick={() => setPendingAction(null)} className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-ink hover:bg-mist">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
