# Jan Seva — Civic Complaint Platform (Frontend Prototype)

Jan Seva lets citizens report local civic problems (garbage, broken roads, street
lights, water leakage, drainage, electricity, public toilets, etc.) and lets
municipal officers review, act on, and resolve those complaints.

**This is a frontend-only prototype.** There is no real backend, database, or
authentication server — everything is powered by React state and the
browser's `localStorage`, so data resets only if you clear your browser storage.

---

## 1. Project structure

```
frontend/
├── src/
│   ├── components/        Reusable UI: Navbar, Sidebar, StatusBadge, ComplaintTable, ProtectedRoute
│   ├── pages/              One file per route/screen
│   ├── context/
│   │   └── AppContext.jsx  All shared state (auth, complaints, users, notifications) + localStorage sync
│   ├── data/
│   │   └── mockData.js     Seed/demo data used the first time the app runs
│   ├── App.jsx              All React Router routes
│   ├── main.jsx             App entry point
│   └── style.css            Tailwind import + civic color theme
├── index.html
├── package.json
└── vite.config.js
```

## 2. Tech used

- React 18 + Vite
- React Router v6 (client-side routing)
- Tailwind CSS v4 (utility-first styling, civic blue/green theme)
- React Icons

## 3. Installation & running

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a production bundle: `npm run build` (outputs to `dist/`).

## 4. Demo login credentials

**Citizen**
- Email: `citizen@test.com`
- Password: `123456`

(or register a brand-new account from the "Register" page)

**Government / Municipal Officer**
- Government ID: `admin`
- Password: `admin123`

> ⚠️ This is ONLY frontend/demo authentication. Passwords are stored in plain
> text in `localStorage` for demo purposes and are **not secure**. Do not
> reuse real passwords, and do not treat this as production-ready auth.

## 5. How localStorage is used

`src/context/AppContext.jsx` is the single source of truth for the app. On
first load it "seeds" four localStorage keys from `src/data/mockData.js`:

- `jan_seva_complaints` — the list of all complaints
- `jan_seva_users` — registered citizen accounts
- `jan_seva_notifications` — notification feed for both roles
- `jan_seva_session` — the currently logged-in user (citizen or officer)

Every time complaints, users, notifications, or the session change, a
`useEffect` writes the updated value back to `localStorage`, so a page
refresh doesn't lose your demo data. Everything is exposed to components
through the `useApp()` hook.

## 6. How complaint submission works

1. A logged-in citizen fills the form on `/report-problem` (category, title,
   description, location, optional photo).
2. Photos are read with the browser's `FileReader` API and stored as a
   base64 data URL directly on the complaint object — no file is uploaded
   anywhere.
3. "Use My Location" calls the browser's Geolocation API and fills the
   location field with coordinates; this only happens if the citizen taps
   the button.
4. On submit, `addComplaint()` in `AppContext` generates a mock ID like
   `JS-2026-004` (year + running sequence), creates a 5-step timeline
   starting at "Complaint Submitted", and saves it to `localStorage`.
5. The citizen sees a confirmation screen with the new complaint ID and can
   jump straight to its tracking page.

## 7. How government officers update complaint status

On `/government/complaint/:id`, an officer can:

- **Start Work** → moves the complaint to `In Progress`
- **Mark as Resolved** → opens a small form asking for resolution remarks
  (required) and an optional resolution photo, then sets the status to
  `Resolved` and records a resolution date
- **Reject Complaint** → sets the status to `Rejected`
- Save free-text **official remarks** at any time, which the citizen can see
  on their own tracking page

All of this goes through `updateComplaintStatus()` in `AppContext`, which
also advances the complaint's timeline and pushes a notification to the
citizen who filed it.

## 8. How user blocking works

On `/government/users`, an officer can block or unblock a citizen account.
Clicking the action opens a confirmation modal ("Are you sure you want to
block this user?") before anything changes. Once confirmed,
`setUserStatus()` updates that user's status in `localStorage`. A blocked
citizen sees a clear message on the "Report a Problem" page and cannot
submit new complaints until unblocked — existing complaints and their
history are untouched.

## 9. Security disclaimer

This project uses frontend-only demo authentication and `localStorage`.
Production deployment requires a secure backend, database, server-side
authentication, authorization, secure file storage, validation and audit
logging. None of that is included here on purpose — this repo is meant as a
UI/UX starting point that a real API can be wired into later.
