import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Menu, X } from "lucide-react";
import { CrestLogo } from "./CrestLogo";

export default function Navbar() {
  const { currentView, setCurrentView, resetPreselected } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view) => {
    resetPreselected();
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Gallery" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const handleLinkClick = (id) => {
    if (id === "about" || id === "contact") {
      if (currentView !== "home") {
        setCurrentView("home");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      handleNav(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-16 w-full bg-[#0b0b0b] border-b border-[#d4af37]/40 flex items-center">
        <div className="w-full max-w-[1200px] mx-auto px-4 flex items-center justify-between h-full">
          {/* LEFT: Logo "SK" crest + "Sam Kitiki" */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav("home")}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <CrestLogo size={36} className="group-hover:scale-105 transition-transform" />
              <span className="font-serif font-bold text-lg md:text-xl text-[#f5efe0] tracking-wide group-hover:text-[#d4af37] transition">
                Sam Kitiki
              </span>
            </button>
          </div>

          {/* CENTRE (Desktop): Home, Services, Gallery, About, Contact */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-sm font-medium transition cursor-pointer py-1 ${
                    isActive
                      ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                      : "text-[#f5efe0] hover:text-[#d4af37]"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT (Desktop): Gold "Book now" button + Admin demo pill */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => handleNav("admin")}
              className="text-xs text-[#a8a29e] hover:text-[#d4af37] px-2 py-1 rounded border border-[#262626] cursor-pointer"
            >
              Admin
            </button>
            <button
              onClick={() => handleNav("booking")}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-sm tracking-wider uppercase shadow-md shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition gold-shimmer cursor-pointer"
            >
              Book now
            </button>
          </div>

          {/* Mobile Right: Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNav("admin")}
              className="text-[10px] text-[#d4af37] font-semibold px-2 py-1 rounded border border-[#d4af37]/30"
            >
              Admin
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#f5efe0] hover:text-[#d4af37] focus:outline-none cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b0b0b] flex flex-col justify-between p-6 animate-in fade-in duration-200">
          {/* Top Bar with crest and close button */}
          <div className="flex items-center justify-between h-16 border-b border-[#262626]">
            <div className="flex items-center gap-3">
              <CrestLogo size={36} />
              <span className="font-serif font-bold text-xl text-[#f5efe0]">Sam Kitiki</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#f5efe0] hover:text-[#d4af37] cursor-pointer"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          {/* Stacked Links in the centre */}
          <div className="flex flex-col items-center justify-center gap-6 my-auto text-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="font-serif text-2xl text-[#f5efe0] hover:text-[#d4af37] transition cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                handleNav("manage");
              }}
              className="text-xs uppercase tracking-widest text-[#a8a29e] hover:text-[#d4af37] mt-4"
            >
              Lookup Booking
            </button>
          </div>

          {/* Bottom full-width "Book now" button */}
          <div className="w-full pt-4 border-t border-[#262626]">
            <button
              onClick={() => handleNav("booking")}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#d4af37]/25 gold-shimmer cursor-pointer"
            >
              Book now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
