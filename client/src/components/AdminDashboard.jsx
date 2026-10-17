import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Calendar, 
  Clock, 
  Users, 
  Scissors, 
  DollarSign, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  UserPlus, 
  Download, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  MessageCircle, 
  Search, 
  Sparkles,
  Phone,
  Check,
  TrendingUp,
  Percent,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sun,
  Moon,
  PauseCircle,
  PlayCircle,
  Menu,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { CrestLogo } from './CrestLogo';

export default function AdminDashboard() {
  const { 
    isAdminAuthenticated, 
    setIsAdminAuthenticated,
    adminTheme,
    setAdminTheme,
    appointments, 
    updateAppointmentStatus, 
    walkins, 
    addWalkin, 
    updateWalkinStatus,
    services, 
    saveService, 
    deleteService,
    barbers, 
    saveBarber, 
    clients, 
    settings, 
    setSettings,
    toggleBookingPause,
    setCurrentView 
  } = useApp();

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sidebar navigation order: Dashboard, Schedule, Walk-ins, Calendar, Appointments, Services, Barbers, Clients, Payments, Gallery, Settings
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Sparkles },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "walkins", label: "Walk-ins", icon: Users },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "appointments", label: "Appointments", icon: Scissors },
    { id: "services", label: "Services", icon: Scissors },
    { id: "barbers", label: "Barbers", icon: UserPlus },
    { id: "clients", label: "Clients", icon: Users },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "gallery", label: "Gallery", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Schedule Timeline Drawer state
  const [selectedAppointmentDrawer, setSelectedAppointmentDrawer] = useState(null);
  const [selectedBarberFilter, setSelectedBarberFilter] = useState("all");
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split("T")[0]);

  // Appointments Table Filter
  const [apptSearch, setApptSearch] = useState("");
  const [apptStatusFilter, setApptStatusFilter] = useState("all");

  // Services Edit Modal
  const [editingService, setEditingService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Settings Forms state
  const [settingDeposit, setSettingDeposit] = useState(settings.depositAmount || 300);
  const [settingCancel, setSettingCancel] = useState(settings.cancellationWindowHours || 2);
  const [settingHours, setSettingHours] = useState(settings.openingTime ? `${settings.openingTime} - ${settings.closingTime}` : "08:30 - 20:00");
  const [settingCapacity, setSettingCapacity] = useState(settings.dailyCapacityLimit || 16);
  const [savedSection, setSavedSection] = useState("");

  const isLight = adminTheme === "light";

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    setIsAdminAuthenticated(true);
    setLoginError("");
  };

  // Calculations
  const todayStr = scheduleDate;
  const todayAppts = appointments.filter((a) => a.date === todayStr);
  const todayBookingsCount = todayAppts.length;
  const expectedRevenue = todayAppts.reduce((sum, a) => sum + (a.totalPrice || 1000), 0);
  const depositsCollected = todayAppts.reduce((sum, a) => sum + (a.depositPaid || 300), 0);
  const noShowsThisWeek = appointments.filter((a) => a.status === "no_show").length;
  const capacityPercent = Math.min(100, Math.round((todayBookingsCount / (settings.dailyCapacityLimit || 16)) * 100));

  // Next up 5 appointments
  const nextUpAppointments = appointments
    .filter((a) => a.status !== "cancelled" && a.status !== "completed")
    .slice(0, 5);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Reference', 'Date', 'Time', 'Client', 'Phone', 'Barber', 'Service', 'Total (KES)', 'Deposit (KES)', 'Status'];
    const rows = appointments.map(apt => [
      apt.reference,
      apt.date,
      apt.startTime || apt.time,
      `"${apt.clientName}"`,
      apt.clientPhone,
      `"${apt.barberName || 'Sam Kitiki'}"`,
      `"${apt.serviceNames || 'Haircut'}"`,
      apt.totalPrice || 1000,
      apt.depositPaid || 300,
      apt.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encoded;
    link.download = `Sam_Kitiki_Appointments_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. LOGIN PAGE: Centred card on dark background with crest, email, password, gold "Sign in" button, small box with demo credentials
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-4 selection:bg-[#d4af37] selection:text-[#0b0b0b]">
        <div className="max-w-md w-full bg-[#151515] border border-[#262626] rounded-3xl p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <CrestLogo size={56} className="mx-auto mb-3" />
            <h2 className="font-serif text-3xl font-bold text-white">Barber Admin Portal</h2>
            <p className="text-xs text-[#a8a29e] mt-1">Management suite for Sam Kitiki Grooming</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-[#a8a29e] tracking-wider mb-1">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@samkitiki.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 bg-[#0b0b0b] border border-[#262626] focus:border-[#d4af37] rounded-xl px-4 text-sm text-white outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-[#a8a29e] tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#0b0b0b] border border-[#262626] focus:border-[#d4af37] rounded-xl px-4 text-sm text-white outline-none transition"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-800/40">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition gold-shimmer cursor-pointer"
            >
              Sign in
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-[#a8a29e] hover:text-[#d4af37] underline cursor-pointer"
            >
              ← Back to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ADMIN SHELL
  return (
    <div className={`min-h-screen flex ${isLight ? "bg-[#f8f9fa] text-[#1a1a1a]" : "bg-[#0b0b0b] text-[#f5efe0]"}`}>
      
      {/* LEFT SIDEBAR (240px, collapsible to icons; mobile slide-in drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-40 border-r flex flex-col justify-between transition-all duration-300 ${
          isLight ? "bg-white border-gray-200" : "bg-[#111] border-[#262626]"
        } ${
          sidebarCollapsed ? "w-16" : "w-60"
        } ${
          sidebarOpen ? "left-0" : "-left-64 md:left-0"
        }`}
      >
        {/* Top Brand with Crest */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#222]">
            <div className="flex items-center gap-3">
              <CrestLogo size={32} />
              {!sidebarCollapsed && (
                <span className="font-serif font-bold text-base text-[#f5efe0]">Sam Kitiki</span>
              )}
            </div>
            {/* Mobile close */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-[#888]">
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Nav: Dashboard, Schedule, Walk-ins, Calendar, Appointments, Services, Barbers, Clients, Payments, Gallery, Settings */}
          <nav className="p-2 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer relative ${
                    isActive
                      ? isLight
                        ? "bg-gray-100 text-black border-l-4 border-[#d4af37]"
                        : "bg-[#181818] text-[#f3d77a] border-l-4 border-[#d4af37]"
                      : isLight
                      ? "text-gray-600 hover:text-black hover:bg-gray-50"
                      : "text-[#a8a29e] hover:text-white hover:bg-[#151515]"
                  }`}
                  title={item.label}
                >
                  <Icon size={18} className="shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pinned Bottom: "View public site" and "Log out" */}
        <div className="p-3 border-t border-[#222] space-y-1 text-xs">
          <button
            onClick={() => setCurrentView("home")}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-[#a8a29e] hover:text-white transition cursor-pointer"
          >
            <ExternalLink size={16} />
            {!sidebarCollapsed && <span>View public site</span>}
          </button>
          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-red-400 hover:text-red-300 transition cursor-pointer"
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR: Page title LEFT | Take a break toggle, Light/dark toggle, Avatar menu RIGHT */}
        <header className={`h-16 px-4 md:px-8 border-b flex items-center justify-between sticky top-0 z-30 backdrop-blur-md ${
          isLight ? "bg-white/95 border-gray-200" : "bg-[#111]/95 border-[#262626]"
        }`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-[#a8a29e]">
              <Menu size={22} />
            </button>
            <h1 className="font-serif text-xl font-bold capitalize">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Take a break toggle */}
            <button
              onClick={toggleBookingPause}
              className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                settings.isPaused
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : isLight ? "bg-gray-100 border-gray-300 text-gray-700" : "bg-[#181818] border-[#333] text-[#aaa] hover:text-white"
              }`}
            >
              {settings.isPaused ? <PlayCircle size={14} className="text-red-400" /> : <PauseCircle size={14} className="text-[#d4af37]" />}
              <span className="hidden sm:inline">{settings.isPaused ? "Resume bookings" : "Take a break"}</span>
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setAdminTheme(isLight ? "dark" : "light")}
              className={`h-9 w-9 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                isLight ? "bg-gray-100 border-gray-300 text-gray-700" : "bg-[#181818] border-[#333] text-[#aaa]"
              }`}
            >
              {isLight ? <Moon size={15} /> : <Sun size={15} className="text-[#f3d77a]" />}
            </button>

            {/* Avatar menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#333]">
              <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center text-xs">
                SK
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Greeting row */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl font-bold">Good morning, Sam</h2>
                  <p className="text-xs text-[#888]">Here is your studio overview for today.</p>
                </div>
              </div>

              {/* 4 Stat Cards in a row (2x2 on mobile) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                  <span className="text-[10px] uppercase tracking-wider text-[#888] font-semibold block mb-1">Today's Bookings</span>
                  <p className="font-serif text-2xl font-bold">{todayBookingsCount}</p>
                  <span className="text-[10px] text-emerald-400">↑ 12% vs last week</span>
                </div>

                <div className={`p-5 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                  <span className="text-[10px] uppercase tracking-wider text-[#888] font-semibold block mb-1">Expected Revenue</span>
                  <p className="font-serif text-2xl font-bold">KES {expectedRevenue.toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-400">↑ High demand</span>
                </div>

                <div className={`p-5 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                  <span className="text-[10px] uppercase tracking-wider text-[#888] font-semibold block mb-1">Deposits Collected</span>
                  <p className="font-serif text-2xl font-bold text-emerald-400">KES {depositsCollected.toLocaleString()}</p>
                  <span className="text-[10px] text-[#777]">Safaricom M-Pesa</span>
                </div>

                <div className={`p-5 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                  <span className="text-[10px] uppercase tracking-wider text-[#888] font-semibold block mb-1">No-shows this week</span>
                  <p className="font-serif text-2xl font-bold text-amber-400">{noShowsThisWeek}</p>
                  <span className="text-[10px] text-[#777]">Low strike rate</span>
                </div>
              </div>

              {/* Below: Capacity meter bar full-width */}
              <div className={`p-5 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold">Today's Chair Capacity</span>
                  <span className="font-mono text-[#d4af37] font-bold">{todayBookingsCount} of {settings.dailyCapacityLimit || 16} Booked ({capacityPercent}%)</span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${isLight ? "bg-gray-200" : "bg-[#222]"}`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] rounded-full transition-all"
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>

              {/* Two columns: LEFT 7-day bookings chart, RIGHT "Next up" list of next 5 appointments */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: 7-day bookings chart */}
                <div className={`lg:col-span-7 p-6 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                  <h3 className="font-serif text-lg font-bold mb-4">7-Day Booking Volume</h3>
                  <div className="h-44 flex items-end justify-between gap-2 pt-6">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                      const heights = [40, 60, 75, 50, 95, 100, 30];
                      const val = heights[idx];
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-[#d4af37] rounded-t-lg transition-all"
                            style={{ height: `${val}%`, opacity: idx === 4 ? 1 : 0.6 }}
                          />
                          <span className="text-[10px] text-[#888]">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT: "Next up" list */}
                <div className={`lg:col-span-5 p-6 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                  <h3 className="font-serif text-lg font-bold mb-4">Next up</h3>
                  <div className="space-y-3">
                    {nextUpAppointments.map((a) => (
                      <div key={a.id} className="p-3 rounded-xl bg-[#0b0b0b] border border-[#222] flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{a.clientName}</p>
                          <p className="text-[10px] text-[#888]">{a.serviceNames}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[#d4af37] font-semibold">{a.startTime || a.time}</span>
                          <span className="text-[9px] block text-[#777] uppercase">{a.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              {/* Date switcher top-LEFT, barber filter top-RIGHT */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const d = new Date(scheduleDate);
                      d.setDate(d.getDate() - 1);
                      setScheduleDate(d.toISOString().split("T")[0]);
                    }}
                    className="p-2 rounded-lg border border-[#333] hover:border-[#555]"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-[#151515] border border-[#333] text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      const d = new Date(scheduleDate);
                      d.setDate(d.getDate() + 1);
                      setScheduleDate(d.toISOString().split("T")[0]);
                    }}
                    className="p-2 rounded-lg border border-[#333] hover:border-[#555]"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <select
                  value={selectedBarberFilter}
                  onChange={(e) => setSelectedBarberFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-[#151515] border border-[#333] text-xs text-white"
                >
                  <option value="all">All Barbers</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Vertical timeline per barber in columns with moving "now" line */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {barbers
                  .filter((b) => selectedBarberFilter === "all" || b.id === selectedBarberFilter)
                  .map((b) => {
                    const barberAppts = appointments.filter(
                      (a) => a.date === scheduleDate && (a.barberId === b.id || (!a.barberId && b.id === "barb_1"))
                    );

                    return (
                      <div key={b.id} className={`p-4 rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                        <div className="border-b border-[#262626] pb-3 mb-4 flex items-center gap-3">
                          <img src={b.photo} alt={b.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <h4 className="font-bold text-sm">{b.name}</h4>
                            <span className="text-[10px] text-[#d4af37]">{barberAppts.length} appointments</span>
                          </div>
                        </div>

                        {/* Appointments list */}
                        <div className="space-y-3">
                          {barberAppts.length === 0 ? (
                            <p className="text-xs text-[#777] italic py-6 text-center">No bookings scheduled.</p>
                          ) : (
                            barberAppts.map((apt) => (
                              <div
                                key={apt.id}
                                onClick={() => setSelectedAppointmentDrawer(apt)}
                                className="p-3 rounded-xl bg-[#0b0b0b] border border-[#222] hover:border-[#d4af37] transition cursor-pointer text-xs"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-mono text-[#d4af37] font-bold">{apt.startTime || apt.time}</span>
                                  <span className="capitalize text-[10px] text-[#888]">{apt.status}</span>
                                </div>
                                <p className="font-bold text-white">{apt.clientName}</p>
                                <p className="text-[10px] text-[#aaa]">{apt.serviceNames}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Appointment Drawer */}
              {selectedAppointmentDrawer && (
                <div className="fixed inset-y-0 right-0 z-50 w-80 md:w-96 bg-[#151515] border-l border-[#262626] p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#262626] pb-3">
                      <h3 className="font-serif text-lg font-bold">Appointment Details</h3>
                      <button onClick={() => setSelectedAppointmentDrawer(null)} className="text-[#888]">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="text-[#888]">Reference: <strong className="text-white font-mono">{selectedAppointmentDrawer.reference}</strong></p>
                      <p className="text-[#888]">Client: <strong className="text-white">{selectedAppointmentDrawer.clientName}</strong></p>
                      <p className="text-[#888]">Phone: <strong className="text-white font-mono">{selectedAppointmentDrawer.clientPhone}</strong></p>
                      <p className="text-[#888]">Service: <strong className="text-white">{selectedAppointmentDrawer.serviceNames}</strong></p>
                      <p className="text-[#888]">Barber: <strong className="text-white">{selectedAppointmentDrawer.barberName}</strong></p>
                      <p className="text-[#888]">Slot: <strong className="text-white">{selectedAppointmentDrawer.date} at {selectedAppointmentDrawer.startTime}</strong></p>
                    </div>

                    {/* Action buttons in a row: Arrived, In chair, Done, No-show */}
                    <div className="pt-4 border-t border-[#262626]">
                      <span className="text-[10px] uppercase font-bold text-[#888] block mb-2">Update Chair Status</span>
                      <div className="grid grid-cols-2 gap-2">
                        {["arrived", "in_progress", "completed", "no_show"].map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              updateAppointmentStatus(selectedAppointmentDrawer.id, st);
                              setSelectedAppointmentDrawer({ ...selectedAppointmentDrawer, status: st });
                            }}
                            className={`h-9 rounded-lg text-xs font-semibold capitalize border transition cursor-pointer ${
                              selectedAppointmentDrawer.status === st
                                ? "bg-[#d4af37] text-black border-[#d4af37]"
                                : "bg-[#0b0b0b] text-[#a8a29e] border-[#333]"
                            }`}
                          >
                            {st === "in_progress" ? "In chair" : st === "completed" ? "Done" : st === "no_show" ? "No-show" : "Arrived"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAppointmentDrawer(null)}
                    className="w-full h-10 rounded-xl bg-[#222] text-xs font-semibold text-white"
                  >
                    Close Drawer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WALK-INS */}
          {activeTab === "walkins" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold">Studio Walk-In Lounge Queue</h3>
                {/* Gold "Add walk-in" button top-RIGHT */}
                <button
                  onClick={() => {
                    const name = prompt("Guest Name:");
                    if (name) {
                      addWalkin({ clientName: name, clientPhone: "0700000000", serviceName: "Gentlemen Cut" });
                    }
                  }}
                  className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase tracking-wider gold-shimmer cursor-pointer"
                >
                  Add walk-in
                </button>
              </div>

              {/* Numbered list with wait on right and "Mark served" button at end */}
              <div className="space-y-3">
                {walkins.map((w, idx) => (
                  <div key={w.id} className="p-4 rounded-xl bg-[#151515] border border-[#222] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#222] text-[#d4af37] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-white text-sm">{w.clientName}</p>
                        <p className="text-[11px] text-[#888]">{w.serviceName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[#a8a29e] font-mono">~{w.estimatedWaitMin || 15} mins wait</span>
                      {w.status === "waiting" ? (
                        <button
                          onClick={() => updateWalkinStatus(w.id, "done")}
                          className="h-9 px-4 rounded-lg bg-[#d4af37] text-black font-bold cursor-pointer"
                        >
                          Mark served
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold">Served</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CALENDAR */}
          {activeTab === "calendar" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <select className="h-10 px-3 rounded-xl bg-[#151515] border border-[#333] text-xs text-white">
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                {/* "Block time" button top-RIGHT */}
                <button
                  onClick={() => alert("Block time window added for lunch break.")}
                  className="h-10 px-5 rounded-xl border border-[#d4af37]/60 text-[#f5efe0] text-xs font-semibold uppercase tracking-wider"
                >
                  Block time
                </button>
              </div>

              {/* Week view placeholder grid */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="p-3 bg-[#151515] border border-[#222] rounded-xl">
                    <span className="font-bold text-white block mb-2">{d}</span>
                    <div className="space-y-1">
                      <div className="p-1 bg-[#222] rounded text-[9px] text-[#d4af37]">09:30 Gentlemen Cut</div>
                      <div className="p-1 bg-[#222] rounded text-[9px] text-[#d4af37]">11:00 Beard Trim</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: APPOINTMENTS */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              {/* Search bar top-LEFT, filter chips, "Export" outlined button top-RIGHT */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search client or phone..."
                    value={apptSearch}
                    onChange={(e) => setApptSearch(e.target.value)}
                    className="h-10 px-4 rounded-xl bg-[#151515] border border-[#333] text-xs text-white outline-none w-64"
                  />
                  <div className="flex gap-1.5 text-xs">
                    {["all", "confirmed", "completed"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setApptStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] capitalize cursor-pointer ${
                          apptStatusFilter === st ? "bg-[#d4af37] text-black border-[#d4af37]" : "border-[#333] text-[#888]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="h-10 px-5 rounded-xl border border-[#d4af37]/60 text-[#f5efe0] text-xs font-semibold uppercase tracking-wider hover:bg-[#1a1a1a]"
                >
                  Export
                </button>
              </div>

              {/* Table with row click opening drawer */}
              <div className="rounded-2xl border border-[#222] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#151515] text-[#888] border-b border-[#222]">
                    <tr>
                      <th className="p-3.5">Ref</th>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Date & Slot</th>
                      <th className="p-3.5">Services</th>
                      <th className="p-3.5">Barber</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {appointments.map((a) => (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedAppointmentDrawer(a)}
                        className="hover:bg-[#181818] cursor-pointer"
                      >
                        <td className="p-3.5 font-mono text-[#d4af37]">{a.reference}</td>
                        <td className="p-3.5 font-bold text-white">{a.clientName}</td>
                        <td className="p-3.5">{a.date} at {a.startTime || a.time}</td>
                        <td className="p-3.5 text-[#aaa]">{a.serviceNames}</td>
                        <td className="p-3.5">{a.barberName}</td>
                        <td className="p-3.5 capitalize font-semibold">{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold">Services Catalog</h3>
                {/* "Add service" gold button top-RIGHT */}
                <button
                  onClick={() => {
                    setEditingService({ name: "", category: "Men", price: 1000, durationMin: 45 });
                    setIsServiceModalOpen(true);
                  }}
                  className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase tracking-wider gold-shimmer cursor-pointer"
                >
                  Add service
                </button>
              </div>

              {/* Table with columns: Name, Group, Price, Duration, Active toggle, Edit icon */}
              <div className="rounded-2xl border border-[#222] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#151515] text-[#888] border-b border-[#222]">
                    <tr>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Group</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Duration</th>
                      <th className="p-3.5">Active</th>
                      <th className="p-3.5 text-right">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-[#181818]">
                        <td className="p-3.5 font-bold text-white">{s.name}</td>
                        <td className="p-3.5 text-[#aaa]">{s.category}</td>
                        <td className="p-3.5 font-mono text-[#d4af37]">KES {s.price}</td>
                        <td className="p-3.5">{s.durationMin || 45} mins</td>
                        <td className="p-3.5">
                          <span className="text-[10px] text-emerald-400 font-bold">Active</span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => { setEditingService(s); setIsServiceModalOpen(true); }}
                            className="p-1.5 hover:text-[#d4af37] text-[#888]"
                          >
                            <Edit3 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit Modal */}
              {isServiceModalOpen && editingService && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#151515] border border-[#333] rounded-2xl max-w-sm w-full p-6 space-y-4">
                    <h4 className="font-serif text-lg font-bold">Edit Service</h4>
                    <div>
                      <label className="text-[10px] uppercase text-[#888] block mb-1">Name</label>
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-[#888] block mb-1">Price (KES)</label>
                      <input
                        type="number"
                        value={editingService.price}
                        onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                        className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          saveService(editingService);
                          setIsServiceModalOpen(false);
                        }}
                        className="flex-1 h-10 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsServiceModalOpen(false)}
                        className="h-10 px-4 rounded-xl bg-[#222] text-[#888] text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BARBERS, CLIENTS, PAYMENTS, GALLERY */}
          {activeTab === "barbers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold">Barbers & Stylists</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {barbers.map(b => (
                  <div key={b.id} className="p-5 rounded-2xl bg-[#151515] border border-[#262626] space-y-3">
                    <img src={b.photo} alt={b.name} className="w-full h-40 object-cover rounded-xl" />
                    <h4 className="font-bold text-base">{b.name}</h4>
                    <p className="text-xs text-[#d4af37]">{b.specialty}</p>
                    <p className="text-[11px] text-[#888]">Shift: {b.workingHours?.start} - {b.workingHours?.end}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "clients" && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold">Client Directory</h3>
              <div className="rounded-2xl border border-[#222] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#151515] text-[#888]">
                    <tr>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Visits</th>
                      <th className="p-3.5">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {clients.map(c => (
                      <tr key={c.id}>
                        <td className="p-3.5 font-bold text-white">{c.name}</td>
                        <td className="p-3.5 font-mono text-[#888]">{c.phone}</td>
                        <td className="p-3.5">{c.visits} cuts</td>
                        <td className="p-3.5">{c.lastVisit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold">M-Pesa Transactions</h3>
              <div className="rounded-2xl border border-[#222] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#151515] text-[#888]">
                    <tr>
                      <th className="p-3.5">M-Pesa Ref</th>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {appointments.map(a => (
                      <tr key={a.id}>
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">{a.mpesaRef || "SK8892KL"}</td>
                        <td className="p-3.5">{a.clientName}</td>
                        <td className="p-3.5 font-mono text-[#d4af37]">KES {a.depositPaid || 300}</td>
                        <td className="p-3.5">{a.date}</td>
                        <td className="p-3.5 text-emerald-400">Verified</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold">Gallery Management</h3>
              <p className="text-xs text-[#888]">9 active transformation slots configured for Sam Kitiki.</p>
            </div>
          )}

          {/* TAB 8: SETTINGS (Sections stacked as cards: Deposit, Cancellation, Hours, Daily capacity, Message templates. Gold Save at bottom-RIGHT) */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              {/* Deposit Card */}
              <div className={`p-6 rounded-2xl border space-y-4 ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                <h4 className="font-serif text-lg font-bold">M-Pesa Deposit Amount</h4>
                <input
                  type="number"
                  value={settingDeposit}
                  onChange={(e) => setSettingDeposit(Number(e.target.value))}
                  className="w-full h-11 bg-[#0b0b0b] border border-[#333] rounded-xl px-4 text-sm text-white"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSettings(prev => ({ ...prev, depositAmount: settingDeposit }));
                      setSavedSection("deposit");
                    }}
                    className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase"
                  >
                    {savedSection === "deposit" ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>

              {/* Cancellation Card */}
              <div className={`p-6 rounded-2xl border space-y-4 ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                <h4 className="font-serif text-lg font-bold">Cancellation Window (Hours)</h4>
                <input
                  type="number"
                  value={settingCancel}
                  onChange={(e) => setSettingCancel(Number(e.target.value))}
                  className="w-full h-11 bg-[#0b0b0b] border border-[#333] rounded-xl px-4 text-sm text-white"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSettings(prev => ({ ...prev, cancellationWindowHours: settingCancel }));
                      setSavedSection("cancel");
                    }}
                    className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase"
                  >
                    {savedSection === "cancel" ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>

              {/* Hours Card */}
              <div className={`p-6 rounded-2xl border space-y-4 ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                <h4 className="font-serif text-lg font-bold">Studio Hours</h4>
                <input
                  type="text"
                  value={settingHours}
                  onChange={(e) => setSettingHours(e.target.value)}
                  className="w-full h-11 bg-[#0b0b0b] border border-[#333] rounded-xl px-4 text-sm text-white"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setSavedSection("hours")}
                    className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase"
                  >
                    {savedSection === "hours" ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>

              {/* Daily Capacity Card */}
              <div className={`p-6 rounded-2xl border space-y-4 ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                <h4 className="font-serif text-lg font-bold">Daily Capacity & Rest Days</h4>
                <input
                  type="number"
                  value={settingCapacity}
                  onChange={(e) => setSettingCapacity(Number(e.target.value))}
                  className="w-full h-11 bg-[#0b0b0b] border border-[#333] rounded-xl px-4 text-sm text-white"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSettings(prev => ({ ...prev, dailyCapacityLimit: settingCapacity }));
                      setSavedSection("capacity");
                    }}
                    className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase"
                  >
                    {savedSection === "capacity" ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>

              {/* Message Templates Card */}
              <div className={`p-6 rounded-2xl border space-y-4 ${isLight ? "bg-white border-gray-200" : "bg-[#151515] border-[#262626]"}`}>
                <h4 className="font-serif text-lg font-bold">Message Templates</h4>
                <textarea
                  rows={3}
                  defaultValue="Habari! Your chair with Sam Kitiki is booked. Ref: {ref}. See you in the chair!"
                  className="w-full bg-[#0b0b0b] border border-[#333] rounded-xl p-3 text-xs text-white"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setSavedSection("templates")}
                    className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase"
                  >
                    {savedSection === "templates" ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
