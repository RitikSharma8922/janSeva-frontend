import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

// ===============================
// APP PROVIDER
// ===============================

export function AppProvider({ children }) {
  // -------------------------------
  // Current User
  // -------------------------------

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser =
      localStorage.getItem("jan_seva_session");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  // -------------------------------
  // States
  // -------------------------------

  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Save User Session
  // -------------------------------

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "jan_seva_session",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("jan_seva_session");
    }
  }, [currentUser]);

  // ===============================
  // API REQUEST
  // ===============================

  async function apiRequest(endpoint, options = {}) {
    try {
      const response = await fetch(
        API_URL + endpoint,
        {
          ...options,

          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        return {
          ok: false,
          error:
            data.error ||
            data.message ||
            "Something went wrong.",
        };
      }

      return {
        ok: true,
        data: data,
      };
    } catch (error) {
      console.error("API Error:", error);

      return {
        ok: false,
        error:
          "Cannot connect to server. Please check your backend.",
      };
    }
  }

  // ===============================
  // LOAD COMPLAINTS
  // ===============================

  async function loadComplaints() {
    const result =
      await apiRequest("/complaints");

    if (result.ok) {
      if (Array.isArray(result.data)) {
        setComplaints(result.data);
      } else if (
        Array.isArray(result.data.complaints)
      ) {
        setComplaints(result.data.complaints);
      }
    }

    return result;
  }

  // ===============================
  // LOAD USERS
  // ===============================

  async function loadUsers() {
    const result =
      await apiRequest("/users");

    if (result.ok) {
      if (Array.isArray(result.data)) {
        setUsers(result.data);
      } else if (
        Array.isArray(result.data.users)
      ) {
        setUsers(result.data.users);
      }
    }

    return result;
  }

  // ===============================
  // LOAD NOTIFICATIONS
  // ===============================

  async function loadNotifications(user) {
    if (!user) {
      setNotifications([]);
      return;
    }

    let endpoint = "";

    if (user.role === "government") {
      endpoint =
        "/notifications?role=government";
    } else {
      const email = encodeURIComponent(
        user.email || ""
      );

      endpoint =
        "/notifications?role=citizen&email=" +
        email;
    }

    const result =
      await apiRequest(endpoint);

    if (result.ok) {
      if (Array.isArray(result.data)) {
        setNotifications(result.data);
      } else if (
        Array.isArray(
          result.data.notifications
        )
      ) {
        setNotifications(
          result.data.notifications
        );
      }
    }
  }

  // ===============================
  // LOAD DATA WHEN USER CHANGES
  // ===============================

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      await loadComplaints();

      if (currentUser) {
        await loadNotifications(currentUser);

        if (
          currentUser.role === "government"
        ) {
          await loadUsers();
        }
      }

      setLoading(false);
    }

    loadData();
  }, [currentUser]);

  // ===============================
  // CITIZEN LOGIN
  // ===============================

  async function loginCitizen(
    emailOrPhone,
    password
  ) {
    const result = await apiRequest(
      "/auth/citizen/login",
      {
        method: "POST",

        body: JSON.stringify({
          emailOrPhone: emailOrPhone,
          password: password,
        }),
      }
    );

    if (!result.ok) {
      return result;
    }

    const user =
      result.data.user ||
      result.data.data ||
      result.data;

    const session = {
      role: "citizen",
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };

    setCurrentUser(session);

    return {
      ok: true,
      user: session,
    };
  }

  // ===============================
  // GOVERNMENT LOGIN
  // ===============================

  async function loginGovernment(
    id,
    password
  ) {
    const result = await apiRequest(
      "/auth/government/login",
      {
        method: "POST",

        body: JSON.stringify({
          id: id,
          password: password,
        }),
      }
    );

    if (!result.ok) {
      return result;
    }

    const user =
      result.data.user ||
      result.data.data ||
      result.data;

    const session = {
      role: "government",
      id: user.id || id,
      name:
        user.name ||
        "Municipal Officer",
    };

    setCurrentUser(session);

    return {
      ok: true,
      user: session,
    };
  }

  // ===============================
  // CITIZEN REGISTER
  // ===============================

  async function registerCitizen({
    name,
    email,
    phone,
    password,
  }) {
    const result = await apiRequest(
      "/auth/citizen/register",
      {
        method: "POST",

        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          password: password,
        }),
      }
    );

    if (!result.ok) {
      return result;
    }

    const user =
      result.data.user ||
      result.data.data ||
      result.data;

    const session = {
      role: "citizen",
      id: user.id,
      email: user.email || email,
      name: user.name || name,
      phone: user.phone || phone,
    };

    setCurrentUser(session);

    return {
      ok: true,
      user: session,
    };
  }

  // ===============================
  // LOGOUT
  // ===============================

  function logout() {
    setCurrentUser(null);
    setComplaints([]);
    setUsers([]);
    setNotifications([]);
  }

  // ===============================
  // ADD COMPLAINT
  // ===============================

  async function addComplaint(data) {
    const result = await apiRequest(
      "/complaints",
      {
        method: "POST",

        body: JSON.stringify({
          ...data,

          citizenEmail: currentUser
            ? currentUser.email
            : null,
        }),
      }
    );

    if (!result.ok) {
      return result;
    }

    const complaint =
      result.data.complaint ||
      result.data.data ||
      result.data;

    setComplaints((prev) => [
      complaint,
      ...prev,
    ]);

    await loadNotifications(currentUser);

    return {
      ok: true,
      complaint: complaint,
    };
  }

  // ===============================
  // UPDATE COMPLAINT STATUS
  // ===============================

  async function updateComplaintStatus(
    id,
    status,
    extra = {}
  ) {
    const result = await apiRequest(
      "/complaints/" + id + "/status",
      {
        method: "PATCH",

        body: JSON.stringify({
          status: status,

          govRemarks:
            extra.govRemarks,

          resolutionRemarks:
            extra.resolutionRemarks,

          resolutionPhoto:
            extra.resolutionPhoto,
        }),
      }
    );

    if (!result.ok) {
      return result;
    }

    const updatedComplaint =
      result.data.complaint ||
      result.data.data ||
      result.data;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          return {
            ...complaint,
            ...updatedComplaint,
          };
        }

        return complaint;
      })
    );

    await loadNotifications(currentUser);

    return {
      ok: true,
      complaint: updatedComplaint,
    };
  }

  // ===============================
  // CHANGE USER STATUS
  // ===============================

  async function setUserStatus(
    userId,
    status
  ) {
    const result = await apiRequest(
      "/users/" + userId + "/status",
      {
        method: "PATCH",

        body: JSON.stringify({
          status: status,
        }),
      }
    );

    if (!result.ok) {
      return result;
    }

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            status: status,
          };
        }

        return user;
      })
    );

    return {
      ok: true,
    };
  }

  // ===============================
  // COMPLAINT COUNT
  // ===============================

  function complaintsCountFor(email) {
    return complaints.filter(
      (complaint) =>
        complaint.citizenEmail === email
    ).length;
  }

  // ===============================
  // CHECK BLOCKED USER
  // ===============================

  function isBlocked(email) {
    const user = users.find(
      (item) => item.email === email
    );

    return user?.status === "blocked";
  }

  // ===============================
  // CONTEXT VALUE
  // ===============================

  const value = {
    complaints,
    users,
    notifications,
    currentUser,
    loading,

    loginCitizen,
    loginGovernment,
    registerCitizen,
    logout,

    addComplaint,
    updateComplaintStatus,
    setUserStatus,

    complaintsCountFor,
    isBlocked,

    loadComplaints,
    loadUsers,
    loadNotifications,
  };

  // ===============================
  // PROVIDER
  // ===============================

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ===============================
// useApp HOOK
// ===============================

export function useApp() {
  return useContext(AppContext);
}