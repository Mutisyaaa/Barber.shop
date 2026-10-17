import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Phone, 
  Scissors, 
  ArrowLeft, 
  RefreshCw,
  Info
} from 'lucide-react';
import { CrestLogo } from './CrestLogo';
import Footer from './Footer';

export default function ManageBookingPage() {
  const { 
    appointments, 
    cancelAppointment, 
    rescheduleAppointment, 
    barbers, 
    settings, 
    setCurrentView 
  } = useApp();

  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupRef, setLookupRef] = useState('');
  const [searchError, setSearchError] = useState('');
  const [foundBooking, setFoundBooking] = useState(null);
  
  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Quick Demo Fill helper
  const handleDemoFill = () => {
    const sample = appointments[0];
    if (sample) {
      setLookupPhone(sample.clientPhone);
      setLookupRef(sample.reference);
      setSearchError('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    setRescheduleSuccess(false);
    setIsRescheduling(false);

    const cleanPhone = lookupPhone.trim();
    const cleanRef = lookupRef.trim().toUpperCase();

    if (!cleanPhone || !cleanRef) {
      setSearchError('Please fill in both phone and booking reference.');
      return;
    }

    const match = appointments.find(apt => 
      apt.reference.toUpperCase() === cleanRef && 
      (apt.clientPhone.includes(cleanPhone) || cleanPhone.includes(apt.clientPhone))
    );

    if (match) {
      setFoundBooking(match);
      setNewDate(match.date);
      setNewTime(match.startTime || match.time);
    } else {
      setFoundBooking(null);
      setSearchError("No booking found matching those details. Check the reference code and try again.");
    }
  };

  const handleCancelClick = () => {
    if (!foundBooking) return;
    if (window.confirm("Cancel this booking? Your chair slot will be released.")) {
      cancelAppointment(foundBooking.id);
      setFoundBooking({ ...foundBooking, status: 'cancelled' });
    }
  };

  const handleSaveReschedule = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return;

    rescheduleAppointment(foundBooking.id, newDate, newTime);
    setFoundBooking({ ...foundBooking, date: newDate, startTime: newTime, status: 'confirmed' });
    setIsRescheduling(false);
    setRescheduleSuccess(true);
  };

  return (
    <div className="w-full bg-[#0b0b0b] text-[#f5efe0] selection:bg-[#d4af37] selection:text-[#0b0b0b]">
      
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#a8a29e] hover:text-[#d4af37] transition mb-6 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div className="text-center mb-8">
            <CrestLogo size={48} className="mx-auto mb-3" />
            <h1 className="font-serif text-3xl font-bold text-white">Find Your Booking</h1>
            <p className="text-xs text-[#a8a29e] mt-1">Look up by your phone number and reference code.</p>
          </div>

          {/* Centred form: phone field, reference field, gold "Find my booking" button full width */}
          <div className="bg-[#151515] border border-[#262626] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a8a29e] font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="07... or +254..."
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  className="w-full h-12 md:h-11 bg-[#0b0b0b] border border-[#262626] focus:border-[#d4af37] rounded-xl px-4 text-sm text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a8a29e] font-semibold mb-1">
                  Booking Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. SKK-9821"
                  value={lookupRef}
                  onChange={(e) => setLookupRef(e.target.value)}
                  className="w-full h-12 md:h-11 bg-[#0b0b0b] border border-[#262626] focus:border-[#d4af37] rounded-xl px-4 text-sm font-mono uppercase text-white outline-none"
                  required
                />
              </div>

              {searchError && (
                <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-800/40">
                  {searchError}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 md:h-11 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-sm uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition gold-shimmer cursor-pointer"
              >
                Find my booking
              </button>

              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-2 text-xs text-[#888] hover:text-[#d4af37] cursor-pointer"
              >
                Try sample code (SK-8842)
              </button>
            </form>
          </div>

          {/* After lookup, booking card appears with "Reschedule" (outlined, left) and "Cancel booking" (red text, right) */}
          {foundBooking && (
            <div className="bg-[#151515] border border-[#d4af37]/40 rounded-2xl p-6 space-y-6 shadow-2xl animate-in fade-in duration-200">
              
              {rescheduleSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Reschedule confirmed!</span>
                </div>
              )}

              <div className="border-b border-[#262626] pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{foundBooking.clientName}</h3>
                  <p className="text-xs text-[#888] font-mono">{foundBooking.clientPhone}</p>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#222] text-[#f3d77a] border border-[#d4af37]/30">
                  {foundBooking.reference}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#888]">Service:</span>
                  <span className="font-semibold text-white">{foundBooking.serviceNames}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Barber:</span>
                  <span className="font-semibold text-white">{foundBooking.barberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Date & Time:</span>
                  <span className="font-semibold text-white">{foundBooking.date} at {foundBooking.startTime || foundBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Status:</span>
                  <span className="font-bold text-emerald-400 capitalize">{foundBooking.status}</span>
                </div>
              </div>

              {/* Inline Reschedule Editor */}
              {isRescheduling && (
                <form onSubmit={handleSaveReschedule} className="p-4 rounded-xl bg-[#0b0b0b] border border-[#333] space-y-3">
                  <h4 className="text-xs font-bold uppercase text-[#d4af37]">Choose New Date & Slot</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="bg-[#151515] border border-[#333] rounded-lg p-2 text-xs text-white"
                      required
                    />
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="bg-[#151515] border border-[#333] rounded-lg p-2 text-xs text-white"
                      required
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:30">05:30 PM</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-lg bg-[#d4af37] text-black font-bold text-xs"
                    >
                      Save New Slot
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="px-3 py-2 rounded-lg bg-[#222] text-[#888] text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* "Reschedule" (outlined, left) and "Cancel booking" (red text button, right) */}
              <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsRescheduling(!isRescheduling)}
                  className="h-10 px-5 rounded-xl border border-[#d4af37]/60 text-xs font-semibold text-[#f5efe0] hover:bg-[#1a1a1a] transition cursor-pointer"
                >
                  Reschedule
                </button>

                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 transition cursor-pointer"
                >
                  Cancel booking
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      <Footer />

    </div>
  );
}
