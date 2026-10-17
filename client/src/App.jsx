import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import GalleryPage from './components/GalleryPage';
import BookingWizard from './components/BookingWizard';
import ManageBookingPage from './components/ManageBookingPage';
import AdminDashboard from './components/AdminDashboard';
import { 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  MessageCircle, 
  X,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const { currentView, setCurrentView, settings } = useApp();

  // Device simulation mode: 'responsive' | 'mobile' (375px iPhone frame)
  const [deviceMode, setDeviceMode] = useState('responsive');

  const isBookingOrConfirmation = currentView === 'booking';
  const isAdmin = currentView === 'admin';

  // Render the core app content
  const renderAppContent = () => (
    <div className="min-h-screen bg-[#0b0b0b] text-[#f5efe0] flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#0b0b0b] relative w-full overflow-x-hidden">
      {/* Top Navbar (Sticky 64px, hidden inside admin) */}
      {!isAdmin && currentView !== 'booking' && <Navbar />}

      {/* Main Content View */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'services' && <ServicesPage />}
        {currentView === 'gallery' && <GalleryPage />}
        {currentView === 'booking' && <BookingWizard />}
        {currentView === 'manage' && <ManageBookingPage />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating WhatsApp button: bottom-RIGHT, 56px circle, sits 72px above bottom on mobile so it never covers the sticky bar. Hidden on booking flow & admin. */}
      {!isBookingOrConfirmation && !isAdmin && (
        <a
          href={`https://wa.me/${settings.whatsapp || "254724590868"}?text=${encodeURIComponent("Habari Sam Kitiki! I have a question about booking a chair.")}`}
          target="_blank"
          rel="noreferrer"
          className="fixed right-4 bottom-[72px] md:bottom-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      )}

      {/* Mobile sticky bottom bar (public pages only, 56px): full-width gold "Book your chair" button. Hides on booking flow and admin. */}
      {!isBookingOrConfirmation && !isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 h-14 bg-[#0b0b0b] border-t border-[#262626] p-2 md:hidden z-30 flex items-center justify-center">
          <button
            onClick={() => setCurrentView('booking')}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/25 gold-shimmer cursor-pointer"
          >
            Book your chair
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060606] text-[#f5efe0]">
      {/* Interactive Device View Mode Switcher Header */}
      <div className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-[#222] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="font-serif font-bold text-sm tracking-wide text-white">Sam Kitiki Preview</span>
          <span className="text-[#666] hidden sm:inline">•</span>
          <span className="text-[#888] hidden sm:inline">Toggle views to experience mobile Instagram flow</span>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 bg-[#0a0a0a] p-1 rounded-xl border border-[#2a2a2a]">
          <button
            onClick={() => setDeviceMode('responsive')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer ${
              deviceMode === 'responsive'
                ? "bg-[#d4af37] text-black shadow-sm"
                : "text-[#888] hover:text-white"
            }`}
          >
            <Monitor size={14} />
            <span className="hidden sm:inline">Desktop / Full</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer ${
              deviceMode === 'mobile'
                ? "bg-[#d4af37] text-black shadow-sm"
                : "text-[#888] hover:text-white"
            }`}
          >
            <Smartphone size={14} />
            <span>Mobile Device (375px)</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {deviceMode === 'responsive' ? (
        // Standard Responsive View
        renderAppContent()
      ) : (
        // Simulated Mobile Device Frame (iPhone / Instagram In-App Browser Simulation)
        <div className="py-8 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-49px)] bg-[#070707] bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px]">
          
          <div className="mb-4 text-center">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">
              Mobile Instagram View Simulator
            </span>
            <p className="text-xs text-[#888] mt-0.5">375px × 812px viewport with native mobile drawer & sticky bar</p>
          </div>

          {/* Smartphone Hardware Outer Shell */}
          <div className="relative w-[375px] h-[812px] bg-[#000] rounded-[50px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_0_8px_#222,0_0_0_10px_#141414] border-4 border-[#333] flex flex-col overflow-hidden">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#000] rounded-full z-50 flex items-center justify-end pr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]" />
            </div>

            {/* Mobile Status Bar */}
            <div className="h-6 w-full flex items-center justify-between px-6 pt-1 text-[11px] font-semibold text-white select-none z-40 bg-[#0b0b0b]">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span>5G</span>
                <span className="w-4 h-2 rounded-xs border border-white flex items-center p-0.5">
                  <span className="w-full h-full bg-white rounded-2xs" />
                </span>
              </div>
            </div>

            {/* Inner App Screen Viewport */}
            <div className="flex-1 w-full bg-[#0b0b0b] overflow-y-auto overflow-x-hidden rounded-[36px] relative scrollbar-none">
              {renderAppContent()}
            </div>

            {/* Home Indicator Bar */}
            <div className="h-4 w-full bg-[#0b0b0b] flex items-center justify-center z-40">
              <div className="w-32 h-1 bg-white/40 rounded-full" />
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
