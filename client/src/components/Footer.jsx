import React from "react";
import { useApp } from "../context/AppContext";
import { CrestLogo } from "./CrestLogo";
import { InstagramIcon } from "./InstagramIcon";
import { Phone, MessageCircle } from "lucide-react";

export default function Footer() {
  const { setCurrentView, settings } = useApp();

  return (
    <footer id="contact" className="w-full bg-[#0b0b0b] border-t border-[#262626] pt-14 pb-20 md:pb-12 text-[#a8a29e]">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* 3 Columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#1f1f1f]">
          {/* Col 1: Brand + short line */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CrestLogo size={40} />
              <span className="font-serif font-bold text-xl text-[#f5efe0]">Sam Kitiki</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Nairobi's premier grooming lounge. Precision fades, bespoke razor lines, and royal hot towel rituals tailored to your character.
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#f5efe0]">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => { setCurrentView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  Services & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView("gallery"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView("manage"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  Find / Manage Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView("admin"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-xs text-[#d4af37] hover:underline cursor-pointer"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact (phone, WhatsApp, Instagram @kitikisam_the_barber, hours) */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#f5efe0]">Contact & Hours</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${settings.phone || "+254724590868"}`} className="hover:text-[#f5efe0]">
                  {settings.phone || "+254 724 590 868"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp || "254724590868"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#25D366]"
                >
                  WhatsApp: +254 724 590 868
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a
                  href="https://instagram.com/kitikisam_the_barber"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#d4af37]"
                >
                  @kitikisam_the_barber
                </a>
              </li>
              <li className="text-xs text-[#888] pt-1">
                Mon – Sat: 8:30 AM – 8:00 PM <br />
                Sunday: By Appointment • Utawala, Nairobi
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright line centred at the bottom */}
        <div className="pt-8 text-center text-xs text-[#737373]">
          <p>© {new Date().getFullYear()} Sam Kitiki The Barber. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

