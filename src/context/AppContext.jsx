import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function apiRequest(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error:
          data.error ||
          data.message ||
          `Request failed with status ${response.status}`,
      };
    }

    return {
      ok: true,
      data,
    };
  } catch (error) {
    console.error("API Error:", error);

    return {
      ok: false,
      error: "Unable to connect to server.",
    };
  }
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("janSevaUser")) || null;
    } catch {
      return null;
    }
  });

  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Save logged-in user in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("janSevaUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("janSevaUser");
    }
  }, [currentUser]);

  // Fetch complaints
  async function fetchComplaints() {
    const result = await apiRequest("/complaints");

    if (result.ok) {
      setComplaints(result.data.complaints || result.data || []);
    }

    return result;
  }

  // Fetch notifications
  async function fetchNotifications() {
    if (!currentUser) return;

    let path = `/notifications?role=${encodeURIComponent(
      currentUser.role
    )}`;

    if (currentUser.role === "citizen") {
      path += `&email=${encodeURIComponent(currentUser.email || "")}`;
    }

    const result = await apiRequest(path);

    if (result.ok) {
      setNotifications(result.data.notifications || result.data || []);
    }

    return result;
  }

  // Load data whenever user changes
  useEffect(() => {
    if (!currentUser) {
      setComplaints([]);
      setNotifications([]);
      return;
    }

    fetchComplaints();
    fetchNotifications();
  }, [currentUser]);

  // =========================
  // CITIZEN LOGIN
  // =========================
  async function loginCitizen(emailOrPhone, password) {
    const result = await apiRequest("/auth/citizen/login", {
      method: "POST",
      body: JSON.stringify({
        emailOrPhone,
        password,
      }),
    });

    if (!result.ok) {
      return result;
    }

    const user = result.data.user;

    if (!user) {
      return {
        ok: false,
        error: "User data not received from server.",
      };
    }

    const session = {
      role: "citizen",
      id: user.id,
      name: user.name,
      email: user.email,
    };

    setCurrentUser(session);

    return {
      ok: true,
      user: session,
    };
  }

  // =========================
  // CITIZEN REGISTER
  // =========================
  async function registerCitizen(name, email, phone, password) {
    const result = await apiRequest("/auth/citizen/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
      }),
    });

    if (!result.ok) {
      return result;
    }

    const user = result.data.user;

    if (!user) {
      return {
        ok: false,
        error: "User data not received from server.",
      };
    }

    const session = {
      role: "citizen",
      id: user.id,
      name: user.name,
      email: user.email,
    };

    setCurrentUser(session);

    return {
      ok: true,
      user: session,
    };
  }

  // =========================
  // GOVERNMENT LOGIN
  // =========================
  async function loginGovernment(id, password) {
    const result = await apiRequest("/auth/government/login", {
      method: "POST",
      body: JSON.stringify({
        id,
        password,
      }),
    });

    if (!result.ok) {
      return result;
    }

    const officer = result.data.officer;

    if (!officer) {
      return {
        ok: false,
        error: "Government officer data not received from server.",
      };
    }

    const session = {
      role: "government",
      id: officer.id,
      name: officer.name,
    };

    setCurrentUser(session);

    return {
      ok: true,
      user: session,
    };
  }

  // =========================
  // LOGOUT
  // =========================
  function logout() {
    setCurrentUser(null);
  }

  // =========================
  // CREATE COMPLAINT
  // =========================
  async function createComplaint(complaintData) {
    const result = await apiRequest("/complaints", {
      method: "POST",
      body: JSON.stringify({
        ...complaintData,
        citizenEmail: currentUser?.email,
      }),
    });

    if (result.ok) {
      await fetchComplaints();
    }

    return result;
  }

  // =========================
  // UPDATE COMPLAINT STATUS
  // =========================
  async function updateComplaintStatus(id, statusData) {
    const result = await apiRequest(`/complaints/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(statusData),
    });

    if (result.ok) {
      await fetchComplaints();
      await fetchNotifications();
    }

    return result;
  }

  const value = {
    currentUser,
    setCurrentUser,

    complaints,
    setComplaints,

    notifications,
    setNotifications,

    loginCitizen,
    registerCitizen,
    loginGovernment,

    logout,

    createComplaint,
    updateComplaintStatus,

    fetchComplaints,
    fetchNotifications,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}