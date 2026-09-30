import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import GovernmentLogin from "./pages/GovernmentLogin.jsx";
import Register from "./pages/Register.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ReportProblem from "./pages/ReportProblem.jsx";
import ComplaintDetails from "./pages/ComplaintDetails.jsx";
import GovernmentDashboard from "./pages/GovernmentDashboard.jsx";
import GovernmentComplaints from "./pages/GovernmentComplaints.jsx";
import GovernmentComplaintDetails from "./pages/GovernmentComplaintDetails.jsx";
import GovernmentUsers from "./pages/GovernmentUsers.jsx";
import GovernmentReports from "./pages/GovernmentReports.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<Landing section="about" />} />
      <Route path="/how-it-works" element={<Landing section="how" />} />
      <Route path="/complaints" element={<Landing section="complaints" />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/government-login" element={<GovernmentLogin />} />
      <Route path="/register" element={<Register />} />

      {/* Citizen (protected) */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute role="citizen">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-problem"
        element={
          <ProtectedRoute role="citizen">
            <ReportProblem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaint/:id"
        element={
          <ProtectedRoute role="citizen">
            <ComplaintDetails />
          </ProtectedRoute>
        }
      />

      {/* Government (protected) */}
      <Route
        path="/government-dashboard"
        element={
          <ProtectedRoute role="government">
            <GovernmentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/government/complaints"
        element={
          <ProtectedRoute role="government">
            <GovernmentComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/government/complaint/:id"
        element={
          <ProtectedRoute role="government">
            <GovernmentComplaintDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/government/users"
        element={
          <ProtectedRoute role="government">
            <GovernmentUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/government/reports"
        element={
          <ProtectedRoute role="government">
            <GovernmentReports />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
