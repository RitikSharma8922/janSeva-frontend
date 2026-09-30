import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import {
  MdDashboard,
  MdOutlineListAlt,
  MdOutlineHourglassEmpty,
  MdOutlineEngineering,
  MdOutlineCheckCircle,
  MdOutlinePeople,
  MdOutlineBarChart,
  MdLogout,
} from "react-icons/md";
import { FaLandmark } from "react-icons/fa";
import { useApp } from "../context/AppContext.jsx";

const ITEMS = [
  { to: "/government-dashboard", label: "Dashboard", icon: MdDashboard, end: true },
  { to: "/government/complaints", label: "All Complaints", icon: MdOutlineListAlt },
  { to: "/government/complaints?status=Pending", label: "Pending", icon: MdOutlineHourglassEmpty },
  { to: "/government/complaints?status=In Progress", label: "In Progress", icon: MdOutlineEngineering },
  { to: "/government/complaints?status=Resolved", label: "Resolved", icon: MdOutlineCheckCircle },
  { to: "/government/users", label: "Users", icon: MdOutlinePeople },
  { to: "/government/reports", label: "Reports", icon: MdOutlineBarChart },
];

function SidebarLinks({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {ITEMS.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-brand-50 text-brand-700" : "text-slate-200 hover:bg-brand-600/40 hover:text-white"
            }`
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/government-login");
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-brand-700 px-4 py-3 text-white lg:hidden">
        <span className="flex items-center gap-2 font-display font-bold">
          <FaLandmark /> Jan Seva · Govt
        </span>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <HiMenu size={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-brand-700 py-4 text-white">
            <div className="flex items-center justify-between px-4 pb-4">
              <span className="flex items-center gap-2 font-display font-bold">
                <FaLandmark /> Jan Seva
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <HiX size={22} />
              </button>
            </div>
            <SidebarLinks onNavigate={() => setOpen(false)} />
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 px-6 py-2.5 text-sm font-medium text-slate-200 hover:text-white"
            >
              <MdLogout size={18} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col bg-brand-700 py-5 text-white lg:flex">
        <div className="flex items-center gap-2 px-5 pb-6 font-display text-lg font-bold">
          <FaLandmark /> Jan Seva
        </div>
        <SidebarLinks />
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-slate-200 hover:text-white"
        >
          <MdLogout size={18} /> Logout
        </button>
      </aside>
    </>
  );
}
