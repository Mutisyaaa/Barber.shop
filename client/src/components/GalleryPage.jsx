import React, { useState, useEffect, useCallback } from "react";
import { GALLERY_ITEMS } from "../data/mockData";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "./Footer";

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Filter chips in one row: All, Fades, Beards, Styled, Colour
  const filterChips = ["All", "Fades", "Beards", "Styled", "Colour"];

  // Mapping items to match filter categories
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Fades") return item.title.toLowerCase().includes("fade") || item.title.toLowerCase().includes("taper");
    if (filter === "Beards") return item.title.toLowerCase().includes("beard");
    if (filter === "Styled") return item.category === "Ladies" || item.title.toLowerCase().includes("part");
    if (filter === "Colour") return item.category === "Colours";
    return true;
  });

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback((e) => {
    if (selectedImageIndex === null) return;
    if (e.key === "Escape") {
      setSelectedImageIndex(null);
    } else if (e.key === "ArrowLeft") {
      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "ArrowRight") {
      setSelectedImageIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    }
  }, [selectedImageIndex, filteredItems.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activeItem = selectedImageIndex !== null ? filteredItems[selectedImageIndex] : null;

  return (
    <div className="w-full bg-[#0b0b0b] text-[#f5efe0] selection:bg-[#d4af37] selection:text-[#0b0b0b]">
      
      {/* Title centred, then filter chips in one row */}
      <div className="pt-16 pb-10 px-4 text-center max-w-[1200px] mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f5efe0] mb-4">
          Client Transformations Gallery
        </h1>
        <p className="text-sm text-[#a8a29e] max-w-lg mx-auto mb-8">
          Browse precision skin fades, beard lineups, platinum color dyes, and ladies' pixie cuts by Sam Kitiki.
        </p>

        {/* Filter chips in one row (All, Fades, Beards, Styled, Colour) */}
        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setFilter(chip);
                setSelectedImageIndex(null);
              }}
              className={`h-10 px-5 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                filter === chip
                  ? "bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold shadow-md shadow-[#d4af37]/20"
                  : "bg-[#151515] text-[#a8a29e] hover:text-white border border-[#262626]"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid: 3 columns on desktop, 2 on mobile */}
      <div className="max-w-[1200px] mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedImageIndex(idx)}
              className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-[#151515] border border-[#262626] hover:border-[#d4af37] transition cursor-pointer shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="font-serif text-sm md:text-base font-bold text-white group-hover:text-[#d4af37] transition">
                  {item.title}
                </span>
                <span className="text-[10px] text-[#aaa] font-mono mt-0.5 line-clamp-1">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX: image centred, close "X" top-RIGHT, arrows on left & right edges, counter bottom-centre. Swipe/arrows work. */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close "X" top-RIGHT */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-[#181818] border border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37] transition z-50 cursor-pointer"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Left Arrow on left edge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#181818]/90 border border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37] transition z-50 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Right Arrow on right edge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#181818]/90 border border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37] transition z-50 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>

          {/* Centred Image */}
          <div 
            className="relative max-w-3xl max-h-[80vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="max-h-[72vh] w-auto max-w-full rounded-2xl object-contain border border-[#d4af37]/40 shadow-2xl"
            />
            <div className="mt-3 text-center">
              <h3 className="font-serif text-lg font-bold text-white">{activeItem.title}</h3>
              <p className="text-xs text-[#aaa] font-mono">{activeItem.label}</p>
            </div>
          </div>

          {/* Counter bottom-centre */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#111] border border-[#333] text-xs font-mono text-[#f3d77a]">
            {selectedImageIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}
