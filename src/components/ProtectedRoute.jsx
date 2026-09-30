import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

// Wraps a page and only renders it if the logged-in user has the right role.
// role: "citizen" | "government"
export default function ProtectedRoute({ role, children }) {
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== role) {
    const loginPath = role === "government" ? "/government-login" : "/user-login";
    return <Navigate to={loginPath} replace />;
  }

  return children;
}
