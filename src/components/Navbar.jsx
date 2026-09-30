import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaLandmark } from "react-icons/fa";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/complaints", label: "Complaints" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-brand-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <FaLandmark size={18} />
          </span>
          Jan Seva
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? "text-brand-600" : "text-slate hover:text-brand-600 transition-colors"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/user-login" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors"
          >
            Register
          </Link>
        </div>

        <button className="md:hidden text-2xl text-brand-700" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-slate">
                {l.label}
              </Link>
            ))}
            <Link to="/user-login" onClick={() => setOpen(false)} className="font-semibold text-brand-600">
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-500 px-4 py-2 text-center font-semibold text-white"
            >
              Register
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
