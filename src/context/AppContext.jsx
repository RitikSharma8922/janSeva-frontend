import React, { createContext, useContext, useEffect, useState } from "react";
import {
  initialComplaints,
  initialUsers,
  initialNotifications,
  GOV_CREDENTIALS,
  STATUS,
  TIMELINE_STEPS,
} from "../data/mockData.js";

// Keys used in localStorage. Keeping them in one place avoids typos.
const KEYS = {
  complaints: "jan_seva_complaints",
  users: "jan_seva_users",
  notifications: "jan_seva_notifications",
  session: "jan_seva_session",
};

// Read a key from localStorage, falling back to a seed value the first
// time the app ever runs on this browser.
function loadOrSeed(key, seed) {
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return seed;
    }
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [complaints, setComplaints] = useState(() => loadOrSeed(KEYS.complaints, initialComplaints));
  const [users, setUsers] = useState(() => loadOrSeed(KEYS.users, initialUsers));
  const [notifications, setNotifications] = useState(() => loadOrSeed(KEYS.notifications, initialNotifications));
  const [currentUser, setCurrentUser] = useState(() => loadOrSeed(KEYS.session, null));

  // Every time one of these pieces of state changes, mirror it into
  // localStorage so a page refresh doesn't lose the demo data.
  useEffect(() => localStorage.setItem(KEYS.complaints, JSON.stringify(complaints)), [complaints]);
  useEffect(() => localStorage.setItem(KEYS.users, JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem(KEYS.notifications, JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem(KEYS.session, JSON.stringify(currentUser)), [currentUser]);

  function addNotification(entry) {
    setNotifications((prev) => [{ id: Date.now(), read: false, ...entry }, ...prev]);
  }

  // ---------- Auth ----------

  function loginCitizen(emailOrPhone, password) {
    const user = users.find((u) => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password);
    if (!user) return { ok: false, error: "Invalid email/mobile or password." };
    if (user.status === "blocked") return { ok: false, error: "This account has been blocked by the municipal office." };
    setCurrentUser({ role: "citizen", email: user.email, name: user.name, id: user.id });
    return { ok: true };
  }

  function loginGovernment(id, password) {
    if (id === GOV_CREDENTIALS.id && password === GOV_CREDENTIALS.password) {
      setCurrentUser({ role: "government", id, name: "Municipal Officer" });
      return { ok: true };
    }
    return { ok: false, error: "Invalid Government ID or password." };
  }

  function registerCitizen({ name, email, phone, password }) {
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser = { id: `U-${1000 + users.length + 1}`, name, email, phone, password, status: "active" };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser({ role: "citizen", email, name, id: newUser.id });
    return { ok: true };
  }

  function logout() {
    setCurrentUser(null);
  }

  // ---------- Complaints ----------

  function generateComplaintId() {
    const year = new Date().getFullYear();
    const seq = complaints.length + 1;
    return `JS-${year}-${String(seq).padStart(3, "0")}`;
  }

  function addComplaint({ category, title, description, location, lat, lng, photo }) {
    const id = generateComplaintId();
    const today = new Date().toISOString().slice(0, 10);
    const timeline = TIMELINE_STEPS.map((label, i) => ({
      label,
      done: i === 0,
      date: i === 0 ? today : null,
    }));
    const complaint = {
      id,
      category,
      title,
      description,
      location,
      lat: lat ?? null,
      lng: lng ?? null,
      photo: photo ?? null,
      status: STATUS.PENDING,
      citizenName: currentUser?.name || "Citizen",
      citizenEmail: currentUser?.email,
      date: today,
      govRemarks: "",
      resolutionRemarks: "",
      resolutionPhoto: null,
      resolutionDate: null,
      timeline,
    };
    setComplaints((prev) => [complaint, ...prev]);
    addNotification({ role: "citizen", email: currentUser?.email, message: `Complaint ${id} submitted successfully.`, date: today });
    addNotification({ role: "government", message: `New complaint ${id} received.`, date: today });
    return complaint;
  }

  // Advances the timeline up to a given status when an officer updates a complaint.
  function timelineForStatus(status, existingTimeline, today) {
    const doneCount =
      status === STATUS.RESOLVED ? 5 : status === STATUS.IN_PROGRESS ? 3 : status === STATUS.REJECTED ? 2 : 1;
    return TIMELINE_STEPS.map((label, i) => {
      const already = existingTimeline?.[i];
      const done = i < doneCount;
      return { label, done, date: done ? already?.date || today : already?.date || null };
    });
  }

  function updateComplaintStatus(id, status, extra = {}) {
    const today = new Date().toISOString().slice(0, 10);
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          status,
          govRemarks: extra.govRemarks ?? c.govRemarks,
          resolutionRemarks: extra.resolutionRemarks ?? c.resolutionRemarks,
          resolutionPhoto: extra.resolutionPhoto ?? c.resolutionPhoto,
          resolutionDate: status === STATUS.RESOLVED ? today : c.resolutionDate,
          timeline: timelineForStatus(status, c.timeline, today),
        };
      })
    );
    const complaint = complaints.find((c) => c.id === id);
    addNotification({
      role: "citizen",
      email: complaint?.citizenEmail,
      message: `Your complaint ${id} status changed to ${status}.`,
      date: today,
    });
  }

  // ---------- Users (government side) ----------

  function setUserStatus(userId, status) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
  }

  function complaintsCountFor(email) {
    return complaints.filter((c) => c.citizenEmail === email).length;
  }

  function isBlocked(email) {
    const user = users.find((u) => u.email === email);
    return user?.status === "blocked";
  }

  const value = {
    complaints,
    users,
    notifications,
    currentUser,
    loginCitizen,
    loginGovernment,
    registerCitizen,
    logout,
    addComplaint,
    updateComplaintStatus,
    setUserStatus,
    complaintsCountFor,
    isBlocked,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside an AppProvider");
  return ctx;
}
