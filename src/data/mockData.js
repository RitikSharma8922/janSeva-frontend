// Initial demo data. This only gets written to localStorage the FIRST time
// the app runs on a browser (see AppContext.jsx), so a user's own actions
// afterwards are never overwritten.

export const CATEGORIES = [
  "Garbage",
  "Road Damage",
  "Street Light",
  "Water Leakage",
  "Drainage",
  "Electricity",
  "Public Toilet",
  "Other",
];

export const STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

// The fixed set of steps shown on the complaint timeline.
export const TIMELINE_STEPS = [
  "Complaint Submitted",
  "Complaint Received",
  "Officer Assigned",
  "Work In Progress",
  "Problem Resolved",
];

function timelineFor(status) {
  const steps = TIMELINE_STEPS.map((label) => ({ label, done: false, date: null }));
  const doneCount =
    status === STATUS.RESOLVED ? 5 : status === STATUS.IN_PROGRESS ? 3 : status === STATUS.REJECTED ? 2 : 1;
  return steps.map((s, i) => (i < doneCount ? { ...s, done: true, date: "2026-09-20" } : s));
}

export const initialComplaints = [
  {
    id: "JS-2026-001",
    category: "Garbage",
    title: "Garbage has not been collected for 5 days",
    description:
      "The garbage bin near the market entrance has not been emptied in almost a week. It is overflowing and causing a bad smell in the whole street.",
    location: "Kanpur",
    lat: null,
    lng: null,
    photo: null,
    status: STATUS.PENDING,
    citizenName: "Citizen Demo",
    citizenEmail: "citizen@test.com",
    date: "2026-09-20",
    govRemarks: "",
    resolutionRemarks: "",
    resolutionPhoto: null,
    resolutionDate: null,
    timeline: timelineFor(STATUS.PENDING),
  },
  {
    id: "JS-2026-002",
    category: "Street Light",
    title: "Broken street light near park",
    description: "The street light opposite the children's park has been broken for two weeks, making the area unsafe at night.",
    location: "Farrukhabad",
    lat: null,
    lng: null,
    photo: null,
    status: STATUS.IN_PROGRESS,
    citizenName: "Citizen Demo",
    citizenEmail: "citizen@test.com",
    date: "2026-09-15",
    govRemarks: "Electrician assigned, repair scheduled this week.",
    resolutionRemarks: "",
    resolutionPhoto: null,
    resolutionDate: null,
    timeline: timelineFor(STATUS.IN_PROGRESS),
  },
  {
    id: "JS-2026-003",
    category: "Road Damage",
    title: "Large pothole causing accidents",
    description: "A deep pothole has formed on the main road near the bus stop. Two-wheelers have skidded here already.",
    location: "Kanpur",
    lat: null,
    lng: null,
    photo: null,
    status: STATUS.RESOLVED,
    citizenName: "Citizen Demo",
    citizenEmail: "citizen@test.com",
    date: "2026-09-05",
    govRemarks: "Road repair team dispatched.",
    resolutionRemarks: "Pothole filled and road resurfaced.",
    resolutionPhoto: null,
    resolutionDate: "2026-09-12",
    timeline: timelineFor(STATUS.RESOLVED),
  },
];

export const initialUsers = [
  {
    id: "U-1001",
    name: "Citizen Demo",
    email: "citizen@test.com",
    phone: "9999900000",
    password: "123456",
    status: "active",
  },
  {
    id: "U-1002",
    name: "Ravi Kumar",
    email: "ravi.kumar@test.com",
    phone: "9876500001",
    password: "123456",
    status: "active",
  },
  {
    id: "U-1003",
    name: "Sunita Devi",
    email: "sunita.devi@test.com",
    phone: "9876500002",
    password: "123456",
    status: "blocked",
  },
];

export const GOV_CREDENTIALS = { id: "admin", password: "admin123" };

export const initialNotifications = [
  { id: 1, role: "citizen", email: "citizen@test.com", message: "Your complaint JS-2026-002 is now In Progress.", date: "2026-09-16", read: false },
  { id: 2, role: "citizen", email: "citizen@test.com", message: "Your complaint JS-2026-003 has been Resolved.", date: "2026-09-12", read: false },
  { id: 3, role: "government", message: "New complaint JS-2026-001 received.", date: "2026-09-20", read: false },
];
