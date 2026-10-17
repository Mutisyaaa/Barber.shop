import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  ArrowLeft, 
  X, 
  Check, 
  CalendarPlus, 
  MessageCircle, 
  Phone,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { CrestLogo } from "./CrestLogo";

export default function BookingWizard() {
  const { 
    services, 
    barbers, 
    settings, 
    blockedSlots, 
    appointments, 
    addAppointment, 
    preselectedService, 
    preselectedBarber, 
    setCurrentView 
  } = useApp();

  // Wizard Steps: 1: Service | 2: Barber | 3: Time | 4: Details | 5: Pay | 6: Confirmation
  const [step, setStep] = useState(preselectedService ? 2 : 1);

  // Selections
  const [selectedServices, setSelectedServices] = useState(() => preselectedService ? [preselectedService] : []);
  const [serviceTab, setServiceTab] = useState("Men"); // Men | Ladies | Colours
  const [selectedBarber, setSelectedBarber] = useState(() => preselectedBarber || null); // null = "Any available"

  // Date & Time
  const getTodayStr = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Client Details
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [errors, setErrors] = useState({});

  // Pay / STK Simulation Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payCountdown, setPayCountdown] = useState(8);
  const [completedAppt, setCompletedAppt] = useState(null);

  // Mobile Summary Sheet Collapsible
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Running calculations
  const runningTotal = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const depositDue = settings.depositAmount || 300;

  // 14 Days Date Strip
  const next14Days = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString("en-US", { month: "short" });
      dates.push({ iso, weekday, dayNum, month });
    }
    return dates;
  }, []);

  // Time Slots with capacity & blocking
  const timeSlots = useMemo(() => {
    const rawSlots = [
      "09:00", "09:45", "10:30", "11:15", "12:00",
      "13:00", "13:45", "14:30", "15:15", "16:00",
      "16:45", "17:30", "18:15", "19:00"
    ];

    const currentDayAppts = appointments.filter(
      (a) => a.date === selectedDate && a.status !== "cancelled"
    );

    const isDayFull = currentDayAppts.length >= (settings.dailyCapacityLimit || 24);

    return rawSlots.map((time) => {
      const isBlocked = blockedSlots.some(
        (b) => b.date === selectedDate && b.time === time && (!selectedBarber || b.barberId === selectedBarber.id)
      );

      const isBooked = currentDayAppts.some((a) => {
        if (selectedBarber && a.barberId !== selectedBarber.id) return false;
        return a.startTime === time;
      });

      const available = !isDayFull && !isBlocked && !isBooked;

      const [h, m] = time.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 || 12;
      const formatted = `${displayH}:${m < 10 ? "0" + m : m} ${period}`;

      return { time, formatted, available };
    });
  }, [selectedDate, selectedBarber, blockedSlots, appointments, settings.dailyCapacityLimit]);

  const toggleService = (service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const validateDetails = () => {
    const newErrors = {};
    if (!clientName.trim()) newErrors.name = "Please enter your full name.";
    const cleanPhone = clientPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 9) newErrors.phone = "Enter a valid 9-digit Kenyan phone number (e.g. 722 000 000).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // M-Pesa Countdown Trigger
  const handleStartMpesaPayment = () => {
    setShowPayModal(true);
    setPayCountdown(8);
  };

  useEffect(() => {
    let timer;
    if (showPayModal && payCountdown > 0) {
      timer = setTimeout(() => setPayCountdown(payCountdown - 1), 1000);
    } else if (showPayModal && payCountdown === 0) {
      // Completed STK simulation
      const appt = addAppointment({
        clientName: clientName.trim(),
        clientPhone: "+254" + clientPhone.replace(/[^0-9]/g, "").slice(-9),
        barberId: selectedBarber ? selectedBarber.id : "barb_1",
        barberName: selectedBarber ? selectedBarber.name : "Sam Kitiki (Master)",
        serviceIds: selectedServices.map((s) => s.id),
        serviceNames: selectedServices.map((s) => s.name).join(" + "),
        totalPrice: runningTotal,
        depositPaid: depositDue,
        mpesaRef: "SK" + Math.random().toString(36).substring(2, 7).toUpperCase() + "9L",
        date: selectedDate,
        startTime: selectedSlot ? selectedSlot.time : "10:30",
        notes: clientNotes.trim()
      });

      setCompletedAppt(appt);
      setShowPayModal(false);
      setStep(6);
    }
    return () => clearTimeout(timer);
  }, [showPayModal, payCountdown]);

  // Can Continue validator
  const canContinue = useMemo(() => {
    if (step === 1) return selectedServices.length > 0;
    if (step === 2) return true; // Selected specific or "Any available"
    if (step === 3) return selectedSlot !== null;
    if (step === 4) return clientName.trim().length > 0 && clientPhone.trim().length >= 9;
    if (step === 5) return true;
    return false;
  }, [step, selectedServices, selectedSlot, clientName, clientPhone]);

  const handleNext = () => {
    if (step === 4) {
      if (!validateDetails()) return;
    }
    if (step === 5) {
      handleStartMpesaPayment();
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else setCurrentView("home");
  };

  // Calendar file generation
  const handleAddToCalendar = () => {
    if (!completedAppt) return;
    const [h, m] = completedAppt.startTime.split(":");
    const dStr = completedAppt.date.replace(/-/g, "");
    const dtStart = `${dStr}T${h}${m}00`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sam Kitiki The Barber//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Cut with ${completedAppt.barberName} (${completedAppt.serviceNames})`,
      `DESCRIPTION:Appointment at Sam Kitiki Kutz. Ref: ${completedAppt.reference}. Deposit KES ${completedAppt.depositPaid} verified.`,
      `LOCATION:${settings.location || "Utawala, Nairobi"}`,
      `DTSTART:${dtStart}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sam_kitiki_${completedAppt.reference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsappMessage = completedAppt
    ? `Habari Sam Kitiki! My booking is confirmed.\n\nRef: ${completedAppt.reference}\nServices: ${completedAppt.serviceNames}\nBarber: ${completedAppt.barberName}\nDate: ${completedAppt.date} at ${completedAppt.startTime}\nDeposit: KES ${completedAppt.depositPaid}\n\nLooking forward to my session!`
    : "";

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#f5efe0] flex flex-col justify-between selection:bg-[#d4af37] selection:text-[#0b0b0b]">
      
      {/* 1. TOP BAR: Back arrow LEFT, "Book your chair" title centre, close "X" RIGHT */}
      <div className="h-16 w-full border-b border-[#262626] bg-[#0b0b0b] px-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="p-2 text-[#a8a29e] hover:text-white transition cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="font-serif text-lg md:text-xl font-bold text-[#f5efe0]">
          Book your chair
        </h1>

        <button
          onClick={() => setCurrentView("home")}
          className="p-2 text-[#a8a29e] hover:text-white transition cursor-pointer"
          aria-label="Close booking"
        >
          <X size={22} />
        </button>
      </div>

      {/* 2. PROGRESS BAR: Directly under top bar. 5 steps with labels (Service, Barber, Time, Details, Pay). Active is gold, completed show check */}
      {step <= 5 && (
        <div className="w-full bg-[#111] border-b border-[#262626] py-3 px-4">
          <div className="max-w-[800px] mx-auto flex items-center justify-between">
            {[
              { num: 1, label: "Service" },
              { num: 2, label: "Barber" },
              { num: 3, label: "Time" },
              { num: 4, label: "Details" },
              { num: 5, label: "Pay" }
            ].map((st) => {
              const isCurrent = step === st.num;
              const isDone = step > st.num;
              return (
                <div key={st.num} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCurrent
                        ? "bg-[#d4af37] text-[#0b0b0b] shadow-md shadow-[#d4af37]/30"
                        : isDone
                        ? "bg-[#25D366] text-black"
                        : "bg-[#1f1f1f] text-[#666] border border-[#333]"
                    }`}
                  >
                    {isDone ? <Check size={14} className="stroke-[3]" /> : st.num}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider mt-1 ${
                      isCurrent ? "text-[#d4af37] font-bold" : "text-[#777]"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MAIN STEP LAYOUT */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-8">
        
        {step <= 5 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Desktop LEFT (65% = 8 cols): Current Step Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* STEP 1: SERVICE */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Tabs: Men | Ladies | Colours at the top */}
                  <div className="flex gap-2 border-b border-[#262626] pb-3 overflow-x-auto">
                    {["Men", "Ladies", "Colours"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setServiceTab(tab)}
                        className={`h-10 px-5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                          serviceTab === tab
                            ? "bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold"
                            : "bg-[#151515] text-[#a8a29e] hover:text-white border border-[#262626]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Grouped Selectable Cards with Checkboxes in top-right corner */}
                  <div className="space-y-3">
                    {services
                      .filter((s) => s.category === serviceTab && s.isBookableOnline)
                      .map((srv) => {
                        const isSelected = selectedServices.some((s) => s.id === srv.id);
                        return (
                          <div
                            key={srv.id}
                            onClick={() => toggleService(srv)}
                            className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                              isSelected
                                ? "bg-[#1a170f] border-[#d4af37] shadow-md shadow-[#d4af37]/10"
                                : "bg-[#151515] border-[#222] hover:border-[#333]"
                            }`}
                          >
                            <div className="flex-1">
                              <h3 className="font-serif text-lg font-bold text-white">{srv.name}</h3>
                              <p className="text-xs text-[#a8a29e] mt-0.5 line-clamp-2">{srv.description}</p>
                              <span className="text-[10px] text-[#777] block mt-1">~{srv.durationMin || 45} mins</span>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                                  isSelected
                                    ? "bg-[#d4af37] border-[#d4af37] text-black"
                                    : "border-[#444] bg-[#0b0b0b]"
                                }`}
                              >
                                {isSelected && <Check size={14} className="stroke-[3]" />}
                              </div>
                              <span className="font-serif text-base font-bold text-[#f3d77a]">
                                KES {srv.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* STEP 2: BARBER */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-white mb-2">Select Your Barber</h2>

                  {/* First card is "Any available" */}
                  <div
                    onClick={() => setSelectedBarber(null)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      selectedBarber === null
                        ? "bg-[#1a170f] border-[#d4af37]"
                        : "bg-[#151515] border-[#222] hover:border-[#333]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#222] border border-[#333] flex items-center justify-center text-[#d4af37] font-bold">
                        SK
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Any available</h4>
                        <p className="text-xs text-[#a8a29e]">Fastest seat with the next open master barber.</p>
                      </div>
                    </div>
                    {selectedBarber === null && <Check className="text-[#d4af37] stroke-[3]" size={20} />}
                  </div>

                  {/* Barbers Cards in row (grid on mobile) with photo, name, specialty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {barbers.map((b) => {
                      const isSelected = selectedBarber?.id === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBarber(b)}
                          className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition ${
                            isSelected
                              ? "bg-[#1a170f] border-[#d4af37]"
                              : "bg-[#151515] border-[#222] hover:border-[#333]"
                          }`}
                        >
                          <div className="space-y-3">
                            <img
                              src={b.photo}
                              alt={b.name}
                              className="w-full h-36 object-cover rounded-xl border border-[#333]"
                            />
                            <div>
                              <h4 className="font-bold text-white text-sm">{b.name}</h4>
                              <p className="text-xs text-[#d4af37]">{b.specialty}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#d4af37] font-bold">
                              <Check size={14} className="stroke-[3]" />
                              <span>Selected</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: TIME */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold text-white mb-2">Pick Date & Time</h2>

                  {/* Horizontal 14-day date strip, scrollable */}
                  <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none">
                    {next14Days.map((d) => {
                      const isSel = selectedDate === d.iso;
                      return (
                        <button
                          key={d.iso}
                          onClick={() => { setSelectedDate(d.iso); setSelectedSlot(null); }}
                          className={`min-w-[70px] p-3 rounded-xl border text-center transition cursor-pointer ${
                            isSel
                              ? "bg-[#d4af37] text-[#0b0b0b] border-[#d4af37] font-bold shadow-md shadow-[#d4af37]/30"
                              : "bg-[#151515] text-[#a8a29e] border-[#262626] hover:border-[#444]"
                          }`}
                        >
                          <span className="text-[10px] uppercase block tracking-wider">{d.weekday}</span>
                          <span className="font-serif text-lg font-bold block">{d.dayNum}</span>
                          <span className="text-[9px] uppercase tracking-widest block">{d.month}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time-slot grid (4 columns desktop, 3 on mobile). Disabled slots greyed out with line-through */}
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                    {timeSlots.map((slot) => {
                      const isSel = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`h-12 md:h-11 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                            isSel
                              ? "bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-md shadow-[#d4af37]/30"
                              : slot.available
                              ? "bg-[#151515] text-white border-[#262626] hover:border-[#d4af37]"
                              : "bg-[#0d0d0d] text-[#444] border-[#181818] line-through cursor-not-allowed"
                          }`}
                        >
                          {slot.formatted}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: DETAILS */}
              {step === 4 && (
                <div className="space-y-5">
                  <h2 className="font-serif text-2xl font-bold text-white mb-2">Guest Details</h2>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a8a29e] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dennis Kipchumba"
                      value={clientName}
                      onChange={(e) => { setClientName(e.target.value); setErrors({ ...errors, name: null }); }}
                      className="w-full h-12 md:h-11 bg-[#151515] border border-[#262626] focus:border-[#d4af37] rounded-xl px-4 text-sm text-white outline-none"
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone field with +254 prefix */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a8a29e] mb-1.5">
                      Safaricom M-Pesa Phone *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#888]">
                        +254
                      </span>
                      <input
                        type="tel"
                        placeholder="722 000 000"
                        value={clientPhone}
                        onChange={(e) => { setClientPhone(e.target.value); setErrors({ ...errors, phone: null }); }}
                        className="w-full h-12 md:h-11 bg-[#151515] border border-[#262626] focus:border-[#d4af37] rounded-xl pl-16 pr-4 text-sm text-white font-mono outline-none"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Optional notes field */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a8a29e] mb-1.5">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Low fade, extra hot towel steam..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full bg-[#151515] border border-[#262626] focus:border-[#d4af37] rounded-xl p-4 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: PAY */}
              {step === 5 && (
                <div className="space-y-6 text-center">
                  <h2 className="font-serif text-2xl font-bold text-white">M-Pesa Deposit</h2>
                  <p className="text-xs text-[#a8a29e] max-w-md mx-auto">
                    A commitment deposit locks your slot on the master calendar. The balance is settled upon cut completion.
                  </p>

                  {/* Deposit amount large and centred */}
                  <div className="py-6 border-y border-[#262626]">
                    <span className="text-xs uppercase tracking-widest text-[#888] block mb-1">Deposit Due Now</span>
                    <p className="font-serif text-4xl sm:text-5xl font-bold text-[#f3d77a]">
                      KES {depositDue.toLocaleString()}
                    </p>
                  </div>

                  {/* Phone field pre-filled */}
                  <div className="max-w-sm mx-auto text-left">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a8a29e] mb-1.5">
                      Target Safaricom Line
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#888]">+254</span>
                      <input
                        type="tel"
                        readOnly
                        value={clientPhone.replace(/[^0-9]/g, "").slice(-9)}
                        className="w-full h-12 md:h-11 bg-[#151515] border border-[#262626] rounded-xl pl-16 pr-4 text-sm font-mono text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Desktop RIGHT (35% = 4 cols): Sticky "Your booking" summary card */}
            <div className="hidden lg:block lg:col-span-4 sticky top-24 bg-[#151515] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-white border-b border-[#262626] pb-3">
                Your booking
              </h3>

              {/* Selected Service(s) */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#888]">Services</span>
                {selectedServices.length === 0 ? (
                  <p className="text-xs text-[#666] italic">None selected</p>
                ) : (
                  selectedServices.map((s) => (
                    <div key={s.id} className="flex justify-between items-center text-xs">
                      <span className="text-[#f5efe0]">{s.name}</span>
                      <span className="font-mono text-[#f3d77a]">KES {s.price.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Barber */}
              <div className="pt-3 border-t border-[#222] text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#888] block mb-0.5">Barber</span>
                <p className="text-white">{selectedBarber ? selectedBarber.name : "Any available"}</p>
              </div>

              {/* Date & Time */}
              <div className="pt-3 border-t border-[#222] text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#888] block mb-0.5">Date & Time</span>
                <p className="text-white">{selectedDate} {selectedSlot ? `at ${selectedSlot.formatted}` : ""}</p>
              </div>

              {/* Deposit Due and Total */}
              <div className="pt-4 border-t border-[#262626] space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[#a8a29e]">
                  <span>Total Fee:</span>
                  <span className="font-serif text-base font-bold text-white">KES {runningTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[#d4af37] font-semibold">
                  <span>Deposit Due:</span>
                  <span>KES {depositDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* STEP 6: CONFIRMATION PAGE */
          <div className="w-full flex flex-col items-center justify-center py-6">
            
            {/* Centred ticket-style card (max-width 420px) */}
            <div className="w-full max-w-[420px] bg-[#151515] border border-[#d4af37]/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto mb-2">
                  <Check size={24} className="stroke-[3]" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">You're booked</h2>
                <p className="text-xs font-mono text-[#f3d77a] uppercase tracking-wider">
                  Ref: {completedAppt?.reference}
                </p>
              </div>

              {/* Details rows: service, barber, date, time, deposit paid, balance due */}
              <div className="space-y-3 text-xs border-y border-[#262626] py-4">
                <div className="flex justify-between">
                  <span className="text-[#888]">Service:</span>
                  <span className="font-semibold text-white">{completedAppt?.serviceNames}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Barber:</span>
                  <span className="font-semibold text-white">{completedAppt?.barberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Date:</span>
                  <span className="font-semibold text-white">{completedAppt?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Time:</span>
                  <span className="font-semibold text-white">{completedAppt?.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Deposit Paid:</span>
                  <span className="font-mono text-emerald-400 font-bold">KES {completedAppt?.depositPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Balance Due:</span>
                  <span className="font-serif text-sm font-bold text-[#f3d77a]">
                    KES {Math.max(0, (completedAppt?.totalPrice || 0) - (completedAppt?.depositPaid || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Under the card: three buttons in a stack (Add to calendar, Message on WhatsApp, Manage booking) */}
              <div className="space-y-2.5">
                <button
                  onClick={handleAddToCalendar}
                  className="w-full h-12 md:h-11 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase tracking-wider shadow-md shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition gold-shimmer cursor-pointer flex items-center justify-center gap-2"
                >
                  <CalendarPlus size={16} />
                  <span>Add to calendar</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsapp || "254724590868"}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-12 md:h-11 rounded-xl border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span>Message on WhatsApp</span>
                </a>

                <button
                  onClick={() => setCurrentView("manage")}
                  className="w-full py-2 text-xs text-[#a8a29e] hover:text-[#d4af37] underline cursor-pointer"
                >
                  Manage booking
                </button>
              </div>

              {/* Preview box titled "Your confirmation message" showing WhatsApp/SMS text */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#888] block mb-1.5 text-center">
                  Your confirmation message
                </span>
                <div className="p-3 rounded-xl bg-[#0e0e0e] border border-[#222] text-[11px] font-mono text-[#aaa] leading-relaxed">
                  <p>{whatsappMessage}</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 4. MOBILE COLLAPSED SUMMARY BAR (pinned above bottom buttons) */}
      {step <= 5 && (
        <div className="lg:hidden w-full bg-[#151515] border-t border-[#262626]">
          <div
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="px-4 py-2 flex items-center justify-between text-xs text-[#a8a29e] cursor-pointer"
          >
            <span>
              {selectedServices.length} {selectedServices.length === 1 ? "item" : "items"}, KES {runningTotal.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-[#d4af37] font-semibold text-[11px]">
              <span>{mobileSummaryOpen ? "Tap to collapse" : "Tap to expand"}</span>
              {mobileSummaryOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
          </div>

          {/* Expanded Drawer on mobile */}
          {mobileSummaryOpen && (
            <div className="px-4 pb-3 space-y-2 text-xs border-t border-[#222] pt-2">
              <div className="flex justify-between text-[#888]">
                <span>Barber:</span>
                <span className="text-white">{selectedBarber ? selectedBarber.name : "Any available"}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Date & Time:</span>
                <span className="text-white">{selectedDate} {selectedSlot ? `at ${selectedSlot.formatted}` : ""}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Deposit Due:</span>
                <span className="text-[#f3d77a] font-bold">KES {depositDue.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. BOTTOM ACTION ROW: Back on LEFT, Gold Continue on RIGHT (disabled until valid). On Pay step says "Pay deposit with M-Pesa" */}
      {step <= 5 && (
        <div className="sticky bottom-0 z-30 w-full bg-[#0b0b0b] border-t border-[#262626] p-4">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              className="h-12 md:h-11 px-6 rounded-xl border border-[#333] hover:border-[#555] text-xs font-semibold uppercase tracking-wider text-[#a8a29e] hover:text-white transition cursor-pointer"
            >
              Back
            </button>

            <button
              disabled={!canContinue}
              onClick={handleNext}
              className="h-12 md:h-11 px-8 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition gold-shimmer cursor-pointer"
            >
              {step === 5 ? "Pay deposit with M-Pesa" : "Continue"}
            </button>
          </div>
        </div>
      )}

      {/* M-PESA POPUP MODAL ("Check your phone and enter your PIN", countdown, Cancel text button) */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#25D366]/40 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full border-2 border-[#25D366] border-t-transparent animate-spin mx-auto" />
            <h3 className="font-serif text-xl font-bold text-white">Check your phone</h3>
            <p className="text-xs text-[#a8a29e]">
              Enter your M-Pesa PIN on your phone to authorize <strong className="text-white">KES {depositDue}</strong>.
            </p>
            <div className="text-xs font-mono text-[#25D366]">
              Auto-verifying in {payCountdown}s...
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowPayModal(false)}
                className="text-xs text-[#888] hover:text-red-400 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
