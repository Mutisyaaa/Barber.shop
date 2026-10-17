import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import GalleryPage from './components/GalleryPage';
import BookingWizard from './components/BookingWizard';
import ManageBookingPage from './components/ManageBookingPage';
import AdminDashboard from './components/AdminDashboard';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const { currentView, setCurrentView, settings } = useApp();

  const isBookingOrConfirmation = currentView === 'booking';
  const isAdmin = currentView === 'admin';

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#f5efe0] flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#0b0b0b] relative">
      
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
}
