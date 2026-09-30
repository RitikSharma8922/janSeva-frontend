import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineAddAPhoto,
  MdOutlineFactCheck,
  MdOutlineTrackChanges,
  MdOutlineGavel,
  MdOutlineVisibility,
} from "react-icons/md";
import Navbar from "../components/Navbar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useApp } from "../context/AppContext.jsx";

const FEATURES = [
  { icon: MdOutlineFactCheck, title: "Easy Complaint Registration", text: "Report a problem in under a minute with a simple guided form." },
  { icon: MdOutlineAddAPhoto, title: "Photo Evidence", text: "Attach a photo so officers can see exactly what needs fixing." },
  { icon: MdOutlineTrackChanges, title: "Complaint Tracking", text: "Follow your complaint from submission through to resolution." },
  { icon: MdOutlineGavel, title: "Government Action", text: "Municipal officers review, assign and act on every complaint." },
  { icon: MdOutlineVisibility, title: "Transparent Status", text: "Every status change is visible to you the moment it happens." },
];

const STEPS = [
  { title: "Report the problem", text: "Choose a category, describe the issue, add a location and photo." },
  { title: "Officer review", text: "A municipal officer receives it and assigns it for action." },
  { title: "Work in progress", text: "You can track the complaint as it moves through each stage." },
  { title: "Problem resolved", text: "The officer marks it resolved and adds remarks you can read." },
];

export default function Landing({ section }) {
  const { complaints } = useApp();

  useEffect(() => {
    if (section) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [section]);

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 w-fit rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-600">
              A civic complaint platform for your city
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Your Problem. <span className="text-brand-600">Our Responsibility.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-slate">
              Report civic problems in your area and help make your city cleaner, safer and better.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/user-login" className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
                Report a Problem
              </Link>
              <Link to="/government-login" className="rounded-lg border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                Government Login
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate">Live snapshot</p>
              <div className="mt-4 space-y-3">
                {complaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl bg-mist px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold">{c.category}</p>
                      <p className="text-xs text-slate">{c.location}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl font-bold text-ink">Built for citizens and officers alike</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <f.icon size={22} />
              </div>
              <h3 className="font-display text-base font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-slate">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-mist py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-display text-2xl font-bold text-ink">About Jan Seva</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate">
            Jan Seva gives every resident a direct line to their local municipal office. Instead of civic problems
            going unreported or getting lost between departments, citizens can log an issue in minutes, attach
            evidence, and watch it move through review, assignment and resolution — all from one place.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl font-bold text-ink">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="font-display text-sm font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-slate">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Public complaints preview */}
      <section id="complaints" className="bg-mist py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-2xl font-bold text-ink">Recently reported problems</h2>
          <p className="mt-2 text-sm text-slate">A glimpse of what fellow citizens have reported across the city.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {complaints.slice(0, 6).map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-600">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-ink">{c.title}</h3>
                <p className="mt-1 text-xs text-slate">
                  {c.category} · {c.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate">
        © 2026 Jan Seva — a civic complaint platform. Frontend demo only.
      </footer>
    </div>
  );
}
