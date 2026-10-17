import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_SETTINGS,
  INITIAL_APPOINTMENTS,
  INITIAL_WALKINS,
  INITIAL_CLIENTS,
  INITIAL_BLOCKED_SLOTS
} from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load from localStorage or use initial mock data
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("skk_services");
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [barbers, setBarbers] = useState(() => {
    const saved = localStorage.getItem("skk_barbers");
    return saved ? JSON.parse(saved) : INITIAL_BARBERS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("skk_settings");
    const parsed = saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    return {
      ...INITIAL_SETTINGS,
      ...parsed,
      isPaused: parsed?.isPaused ?? false
    };
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("skk_appointments");
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [walkins, setWalkins] = useState(() => {
    const saved = localStorage.getItem("skk_walkins");
    return saved ? JSON.parse(saved) : INITIAL_WALKINS;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("skk_clients");
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [blockedSlots, setBlockedSlots] = useState(() => {
    const saved = localStorage.getItem("skk_blocked");
    return saved ? JSON.parse(saved) : INITIAL_BLOCKED_SLOTS;
  });

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem("skk_admin_auth") === "true";
  });

  // Admin theme (light vs dark mode exclusively in admin)
  const [adminTheme, setAdminTheme] = useState(() => {
    return localStorage.getItem("skk_admin_theme") || "dark";
  });

  // Active view: 'home' | 'services' | 'gallery' | 'booking' | 'manage' | 'admin'
  const [currentView, setCurrentView] = useState("home");

  // Pre-selected service or barber when jumping to booking
  const [preselectedService, setPreselectedService] = useState(null);
  const [preselectedBarber, setPreselectedBarber] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("skk_services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("skk_barbers", JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem("skk_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("skk_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("skk_walkins", JSON.stringify(walkins));
  }, [walkins]);

  useEffect(() => {
    localStorage.setItem("skk_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("skk_blocked", JSON.stringify(blockedSlots));
  }, [blockedSlots]);

  useEffect(() => {
    localStorage.setItem("skk_admin_auth", isAdminAuthenticated ? "true" : "false");
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem("skk_admin_theme", adminTheme);
  }, [adminTheme]);

  // Appointment creation helper
  const addAppointment = (newAppt) => {
    const refCode = "SKK-" + Math.floor(1000 + Math.random() * 9000);
    const appt = {
      id: "apt_" + Date.now(),
      reference: refCode,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      depositPaid: settings.depositAmount || 300,
      ...newAppt
    };

    setAppointments((prev) => [appt, ...prev]);

    // Update or add client record
    setClients((prev) => {
      const existing = prev.find((c) => c.phone === appt.clientPhone);
      if (existing) {
        return prev.map((c) =>
          c.phone === appt.clientPhone
            ? { ...c, visits: (c.visits || 0) + 1, lastVisit: appt.date, name: appt.clientName }
            : c
        );
      } else {
        return [
          {
            id: "cli_" + Date.now(),
            name: appt.clientName,
            phone: appt.clientPhone,
            visits: 1,
            lastVisit: appt.date,
            noShowCount: 0,
            notes: "Online booking client"
          },
          ...prev
        ];
      }
    });

    return appt;
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    if (newStatus === "no_show") {
      const appt = appointments.find((a) => a.id === id);
      if (appt) {
        setClients((prev) =>
          prev.map((c) =>
            c.phone === appt.clientPhone
              ? { ...c, noShowCount: (c.noShowCount || 0) + 1 }
              : c
          )
        );
      }
    }
  };

  const cancelAppointment = (id) => {
    updateAppointmentStatus(id, "cancelled");
  };

  const rescheduleAppointment = (id, newDate, newTime) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, date: newDate, startTime: newTime, status: "confirmed" }
          : a
      )
    );
  };

  // Walk-in helpers
  const addWalkin = (walkin) => {
    const newWk = {
      id: "wk_" + Date.now(),
      status: "waiting",
      estimatedWaitMin: Math.max(10, walkins.filter((w) => w.status === "waiting").length * 25 + 10),
      ...walkin
    };
    setWalkins((prev) => [...prev, newWk]);
  };

  const updateWalkinStatus = (id, status) => {
    setWalkins((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status } : w))
    );
  };

  // Services CRUD
  const saveService = (srv) => {
    if (srv.id) {
      setServices((prev) => prev.map((s) => (s.id === srv.id ? srv : s)));
    } else {
      const newSrv = {
        ...srv,
        id: "srv_" + Date.now(),
        isBookableOnline: true
      };
      setServices((prev) => [...prev, newSrv]);
    }
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Barbers CRUD
  const saveBarber = (barb) => {
    if (barb.id) {
      setBarbers((prev) => prev.map((b) => (b.id === barb.id ? barb : b)));
    } else {
      const newBarb = {
        ...barb,
        id: "barb_" + Date.now(),
        rating: 5.0,
        reviews: 0,
        active: true
      };
      setBarbers((prev) => [...prev, newBarb]);
    }
  };

  // Block time off
  const blockTime = (barberId, date, time, reason) => {
    const newBlock = {
      id: "blk_" + Date.now(),
      barberId,
      date,
      time,
      reason
    };
    setBlockedSlots((prev) => [...prev, newBlock]);
  };

  const removeBlockedTime = (id) => {
    setBlockedSlots((prev) => prev.filter((b) => b.id !== id));
  };

  // Quick navigation helpers
  const navigateToBookingWithService = (service) => {
    setPreselectedService(service);
    setCurrentView("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToBookingWithBarber = (barber) => {
    setPreselectedBarber(barber);
    setCurrentView("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetPreselected = () => {
    setPreselectedService(null);
    setPreselectedBarber(null);
  };

  // Toggle booking pause
  const toggleBookingPause = () => {
    setSettings((prev) => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  return (
    <AppContext.Provider
      value={{
        services,
        setServices,
        barbers,
        setBarbers,
        settings,
        setSettings,
        toggleBookingPause,
        appointments,
        setAppointments,
        walkins,
        setWalkins,
        clients,
        setClients,
        blockedSlots,
        setBlockedSlots,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        adminTheme,
        setAdminTheme,
        currentView,
        setCurrentView,
        preselectedService,
        preselectedBarber,
        navigateToBookingWithService,
        navigateToBookingWithBarber,
        resetPreselected,
        addAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        rescheduleAppointment,
        addWalkin,
        updateWalkinStatus,
        saveService,
        deleteService,
        saveBarber,
        blockTime,
        removeBlockedTime
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
