import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Clock, Phone, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import Footer from "./Footer";

export default function ServicesPage() {
  const { services, navigateToBookingWithService, settings } = useApp();
  const [activeTab, setActiveTab] = useState("Men");

  const groups = ["Men", "Ladies", "Colours", "Other"];

  const scrollToGroup = (grp) => {
    setActiveTab(grp);
    const el = document.getElementById(`group-${grp.toLowerCase()}`);
    if (el) {
      const yOffset = -140; // navbar + sticky tab height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#0b0b0b] text-[#f5efe0] selection:bg-[#d4af37] selection:text-[#0b0b0b] pb-16">
      
      {/* Page title and short intro at the top, centred */}
      <div className="pt-16 pb-12 px-4 text-center max-w-[1200px] mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515] border border-[#d4af37]/35 text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRANSPARENT MENU</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f5efe0] mb-3">
          Services & Price List
        </h1>
        <p className="text-sm sm:text-base text-[#a8a29e] max-w-xl mx-auto leading-relaxed">
          Tailored precision haircuts, royal beard grooming, vibrant hair colours, and executive VIP doorstep services.
        </p>
      </div>

      {/* Sticky tab bar under the navbar (Men | Ladies | Colours | Other) */}
      <div className="sticky top-16 z-30 w-full bg-[#0b0b0b]/95 backdrop-blur-md border-y border-[#262626] py-3">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => scrollToGroup(grp)}
              className={`h-10 px-5 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === grp
                  ? "bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold shadow-md shadow-[#d4af37]/20"
                  : "bg-[#151515] text-[#a8a29e] hover:text-white border border-[#262626]"
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Service Groups */}
      <div className="max-w-[1200px] mx-auto px-4 pt-12 space-y-16">
        {groups.map((grp) => {
          const groupServices = services.filter((s) => s.category === grp);
          const isOther = grp === "Other";

          return (
            <div key={grp} id={`group-${grp.toLowerCase()}`} className="space-y-6 scroll-mt-36">
              <div className="border-b border-[#262626] pb-3 flex items-baseline justify-between">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5efe0]">
                  {grp === "Men" && "Men's Cuts & Beard Care"}
                  {grp === "Ladies" && "Ladies Precision Cuts & Styling"}
                  {grp === "Colours" && "Artisan Hair Colours"}
                  {grp === "Other" && "Grooming Parties & House Calls"}
                </h2>
                <span className="text-[10px] font-mono uppercase text-[#d4af37]">
                  {groupServices.length} {groupServices.length === 1 ? "Option" : "Options"}
                </span>
              </div>

              {/* Menu-style List */}
              <div className="space-y-4">
                {groupServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#151515] border border-[#222] hover:border-[#d4af37]/40 luxury-card-glow transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Name left, duration chip, dotted leader line, price right (gold) */}
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                            {service.name}
                          </h3>
                          <span className="text-[10px] font-mono text-[#888] px-2 py-0.5 rounded bg-[#1f1f1f] border border-[#2a2a2a]">
                            ~{service.durationMin || 45} mins
                          </span>
                        </div>

                        {/* Dotted leader on desktop */}
                        <div className="hidden md:block flex-1 border-b border-dotted border-[#333] mx-3" />

                        {/* Price right (gold) */}
                        {!isOther ? (
                          <span className="font-serif text-lg sm:text-xl font-bold text-[#f3d77a] whitespace-nowrap">
                            KES {service.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
                            Custom Quote
                          </span>
                        )}
                      </div>

                      {/* Description under name in small cream text */}
                      <p className="text-xs text-[#f5efe0]/80 mt-1 max-w-2xl leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Book button on desktop sits at far right; on mobile goes full-width under description */}
                    <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
                      {!isOther ? (
                        <button
                          onClick={() => navigateToBookingWithService(service)}
                          className="w-full md:w-auto h-12 md:h-11 px-6 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition gold-shimmer cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                          <a
                            href={`https://wa.me/${settings.whatsapp || "254724590868"}?text=${encodeURIComponent(`Hi Sam Kitiki, I would like to enquire about ${service.name}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full md:w-auto h-12 md:h-11 px-5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#20b858] transition"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Call or WhatsApp to enquire</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20">
        <Footer />
      </div>

    </div>
  );
}
