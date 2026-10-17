import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  ChevronDown, 
  Flame, 
  Droplets, 
  HeartHandshake, 
  Award, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Scissors,
  Star
} from "lucide-react";
import { BarberPatternBackdrop } from "./CrestLogo";
import Footer from "./Footer";

export default function HomePage() {
  const { setCurrentView, navigateToBookingWithService, services } = useApp();

  // Before / After Slider handle position (0 to 100)
  const [sliderPos, setSliderPos] = useState(50);

  // Testimonials state
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    {
      name: "Brian Omondi",
      service: "Gentlemen Cut & Beard Trim",
      quote: "The hot towel steam and precision razor line are unlike anywhere else in Nairobi. When you leave Sam's chair, you walk out like an executive.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Brenda Wanjiku",
      service: "Fresh Cut (Big Chop)",
      quote: "I was terrified to transition to a pixie cut, but Sam tailored the shape specifically to my facial bone structure. Confidence booster!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "David Kimani",
      service: "Advanced Styled Cut",
      quote: "Flawless drop fade and crisp hairline. Clean hospital-grade equipment and zero waiting delays when you book online.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  ];

  // Specific 3 featured services required
  const featured = [
    services.find(s => s.id === "srv_men_1") || {
      id: "srv_men_1",
      name: "Gentlemen Cut",
      price: 1000,
      description: "Tailored cut, shampoo, scalp massage and light facial massage, with hot towel treatment and styling."
    },
    services.find(s => s.id === "srv_men_2") || {
      id: "srv_men_2",
      name: "Advanced Styled Cut",
      price: 1000,
      description: "Stylized cut personalised to your taste, shampoo, scalp massage and light facial massage, with hot towel treatment and styling."
    },
    services.find(s => s.id === "srv_men_3") || {
      id: "srv_men_3",
      name: "Beard or Mustache Trim",
      price: 500,
      description: "Precision beard sculpt, razor edge detailing, hot towel steam and nourishing conditioning oil."
    }
  ];

  // 6 Gallery images for preview
  const gallery6 = [
    { id: 1, title: "Mid-Fade & Crisp Part", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Platinum Silver Color", img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Royal Beard Sculpt", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Ladies Big Chop", img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Drop Taper Fade", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Copper Hair Color", img: "https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&w=600&q=80" },
  ];

  const handleScrollToServices = () => {
    const el = document.getElementById("featured-services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-[#0b0b0b] text-[#f5efe0] selection:bg-[#d4af37] selection:text-[#0b0b0b]">
      
      {/* 1. HERO (100vh): Dark photo with gradient overlay. Content LEFT on desktop, centred on mobile. */}
      <section className="relative h-[calc(100vh-64px)] min-h-[580px] w-full flex items-center justify-center overflow-hidden border-b border-[#262626]">
        {/* Dark photo with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-95"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b]/95 via-[#0b0b0b]/85 to-[#0b0b0b]/60 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-[#0b0b0b]/40" />
        
        {/* Ambient radial gold backlight */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[500px] h-[350px] bg-[#d4af37]/10 blur-[130px] pointer-events-none rounded-full" />
        <BarberPatternBackdrop opacity={0.04} />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col justify-center h-full">
          <div className="max-w-xl text-center md:text-left space-y-4">
            
            {/* Small gold label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515]/90 border border-[#d4af37]/40 text-[#d4af37] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span>NAIROBI BARBERSHOP</span>
            </div>

            {/* Large serif headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#f5efe0] leading-[1.06]">
              The Art of <br />
              <span className="text-gold-gradient italic">Precision Barbering.</span>
            </h1>

            {/* One-line tagline */}
            <p className="text-sm sm:text-base md:text-lg text-[#a8a29e] font-light leading-relaxed">
              Nairobi's celebrity grooming lounge for master fades, big chops, and royal beard care.
            </p>

            {/* Two buttons: Primary gold "Book your chair", Secondary outlined "View price list" */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setCurrentView("booking")}
                className="w-full sm:w-auto h-12 md:h-11 px-8 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#d4af37]/25 hover:brightness-110 active:scale-95 transition gold-shimmer cursor-pointer"
              >
                Book your chair
              </button>

              <button
                onClick={() => setCurrentView("services")}
                className="w-full sm:w-auto h-12 md:h-11 px-7 rounded-xl border border-[#d4af37]/60 hover:border-[#d4af37] text-[#f5efe0] font-semibold text-sm tracking-wider hover:bg-[#1a1a1a] active:scale-95 transition cursor-pointer"
              >
                View price list
              </button>
            </div>
          </div>
        </div>

        {/* Scroll cue (small animated chevron) centred at the bottom */}
        <button
          onClick={handleScrollToServices}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#d4af37] opacity-80 hover:opacity-100 transition cursor-pointer z-10"
          aria-label="Scroll to featured services"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </section>

      {/* 2. TRUST STRIP: 4 items (Hot towel finish, Shampoo and scalp massage, Walk-ins welcome, House calls). 2x2 grid on mobile, 1 row on desktop */}
      <section className="w-full bg-[#111] border-b border-[#262626] py-7">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#151515]/60 border border-[#222] space-y-1.5 transition hover:border-[#d4af37]/40">
              <div className="p-2 rounded-lg bg-[#1a1a1a] text-[#d4af37]">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#f5efe0]">Hot towel finish</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#151515]/60 border border-[#222] space-y-1.5 transition hover:border-[#d4af37]/40">
              <div className="p-2 rounded-lg bg-[#1a1a1a] text-[#d4af37]">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#f5efe0]">Shampoo & scalp massage</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#151515]/60 border border-[#222] space-y-1.5 transition hover:border-[#d4af37]/40">
              <div className="p-2 rounded-lg bg-[#1a1a1a] text-[#d4af37]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#f5efe0]">Walk-ins welcome</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#151515]/60 border border-[#222] space-y-1.5 transition hover:border-[#d4af37]/40">
              <div className="p-2 rounded-lg bg-[#1a1a1a] text-[#d4af37]">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#f5efe0]">House calls</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES: Section title centred, 3 cards in a row (stacked on mobile) */}
      <section id="featured-services" className="w-full py-24 border-b border-[#262626]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] block mb-1">
              SIGNATURE MENU
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe0]">
              Featured Services
            </h2>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featured.map((srv) => (
              <div
                key={srv.id}
                className="bg-[#151515] border border-[#262626] rounded-2xl p-6 flex flex-col justify-between hover:border-[#d4af37]/50 luxury-card-glow transition group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-serif text-xl font-bold text-[#f5efe0] group-hover:text-[#d4af37] transition">
                      {srv.name}
                    </h3>
                    <span className="font-serif text-lg font-bold text-[#f3d77a] whitespace-nowrap">
                      KES {srv.price.toLocaleString()}
                    </span>
                  </div>

                  {/* 2-line description */}
                  <p className="text-xs text-[#a8a29e] line-clamp-2 leading-relaxed mb-6">
                    {srv.description}
                  </p>
                </div>

                {/* "Book this" text button bottom-left */}
                <div>
                  <button
                    onClick={() => navigateToBookingWithService(srv)}
                    className="text-xs font-bold text-[#d4af37] hover:text-[#f3d77a] flex items-center gap-1.5 uppercase tracking-wider cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>Book this</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Below the cards: Centred outlined button "See full price list" */}
          <div className="text-center">
            <button
              onClick={() => setCurrentView("services")}
              className="h-12 md:h-11 px-8 rounded-xl border border-[#d4af37]/60 hover:border-[#d4af37] text-[#f5efe0] font-semibold text-sm uppercase tracking-wider hover:bg-[#1a1a1a] transition cursor-pointer"
            >
              See full price list
            </button>
          </div>
        </div>
      </section>

      {/* 4. MEET SAM: Two columns on desktop (portrait LEFT, text RIGHT with "Book with Sam" button under text). Image on top on mobile. */}
      <section id="about" className="w-full py-24 border-b border-[#262626] bg-[#0e0e0e]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Portrait placeholder LEFT on desktop, top on mobile */}
            <div className="relative mx-auto md:mx-0 max-w-md w-full aspect-4/5 rounded-2xl overflow-hidden bg-[#151515] border border-[#262626] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
                alt="Sam Kitiki Master Barber"
                className="w-full h-full object-cover object-top filter contrast-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-[#d4af37] bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-[#d4af37]/35 flex items-center justify-between">
                <span>[Portrait of Sam Kitiki]</span>
                <span className="text-[10px] text-[#aaa]">Utawala Lounge</span>
              </div>
            </div>

            {/* Text RIGHT */}
            <div className="space-y-6 text-left">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                ABOUT THE FOUNDER
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efe0] leading-tight">
                Master Barber <br />
                <span className="text-gold-gradient font-serif italic">Sam Kitiki</span>
              </h2>

              <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed">
                With years of focused dedication to hair aesthetics and precision grooming in Nairobi, Sam Kitiki has elevated traditional barbering into an art form. Every consultation is unhurried, analyzing head contours, hair growth patterns, and personal lifestyle before a single cut is made.
              </p>

              <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed">
                From high-stakes boardrooms to media shoots, each client receives hospital-grade sterilized tools, soothing eucalyptus steam, and immaculate finishing lines that command respect.
              </p>

              <div>
                <button
                  onClick={() => setCurrentView("booking")}
                  className="h-12 md:h-11 px-8 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-sm tracking-wider uppercase shadow-md shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition gold-shimmer cursor-pointer"
                >
                  Book with Sam
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. GALLERY PREVIEW: 6 images in a masonry grid, with centred outlined "View full gallery" button */}
      <section className="w-full py-24 border-b border-[#262626]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] block mb-1">
              PORTFOLIO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe0]">
              Recent Client Transformations
            </h2>
          </div>

          {/* 6 images grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {gallery6.map((item) => (
              <div
                key={item.id}
                onClick={() => setCurrentView("gallery")}
                className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-[#151515] border border-[#262626] hover:border-[#d4af37] transition-all duration-300 cursor-pointer shadow-md hover:-translate-y-1"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
                  <span className="font-serif text-sm font-bold text-white group-hover:text-[#d4af37] transition">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentView("gallery")}
              className="h-12 md:h-11 px-8 rounded-xl border border-[#d4af37]/60 hover:border-[#d4af37] text-[#f5efe0] font-semibold text-sm uppercase tracking-wider hover:bg-[#1a1a1a] transition cursor-pointer"
            >
              View full gallery
            </button>
          </div>
        </div>
      </section>

      {/* 6. BEFORE/AFTER SLIDER: One large slider centred, draggable handle, "Before" / "After" labels in top corners */}
      <section className="w-full py-24 border-b border-[#262626] bg-[#0e0e0e]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] block mb-1">
              PRECISION WORK
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe0]">
              Before & After Precision
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a29e] mt-1">
              Drag the golden slider to inspect the razor line work and texture transformation.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl aspect-16/10 rounded-2xl overflow-hidden border border-[#d4af37]/50 shadow-2xl select-none bg-[#151515]">
            {/* After Image */}
            <img
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=1200&q=80"
              alt="After Transformation"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* After label top-right */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/85 text-[#d4af37] text-xs font-bold uppercase tracking-wider border border-[#d4af37]/50 backdrop-blur-md">
              After
            </div>

            {/* Before Image (clipped overlay) */}
            <div 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80"
                alt="Before Transformation"
                className="absolute inset-0 w-[800px] md:w-[900px] h-full object-cover max-w-none"
                loading="lazy"
              />
            </div>
            {/* Before label top-left */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-black/85 text-[#aaa] text-xs font-bold uppercase tracking-wider border border-[#333] backdrop-blur-md">
              Before
            </div>

            {/* Draggable gold divider handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0b0b0b] border-2 border-[#d4af37] shadow-xl flex items-center justify-center text-[#d4af37]">
                <Scissors className="w-3.5 h-3.5" />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Before after comparison slider"
            />
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS: Carousel with 3 cards visible on desktop (1 on mobile), arrows left/right on desktop, dots below on mobile */}
      <section className="w-full py-24 border-b border-[#262626]">
        <div className="max-w-[1200px] mx-auto px-4 relative">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] block mb-1">
              REVIEWS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5efe0]">
              What Our Clients Say
            </h2>
          </div>

          {/* Desktop 3 Cards Visible */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#151515] border border-[#262626] rounded-2xl p-6 flex flex-col justify-between hover:border-[#d4af37]/40 transition">
                <div>
                  <div className="flex gap-1 text-[#d4af37] mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-[#d4af37]" />
                    ))}
                  </div>
                  <p className="font-serif italic text-sm text-[#f5efe0] leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[#222]">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#d4af37]" />
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-[#d4af37]">{t.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Single Card Carousel */}
          <div className="md:hidden">
            <div className="bg-[#151515] border border-[#262626] rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex gap-1 text-[#d4af37] mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#d4af37]" />
                  ))}
                </div>
                <p className="font-serif italic text-base text-[#f5efe0] leading-relaxed mb-6">
                  "{testimonials[testimonialIndex].quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#222]">
                <img 
                  src={testimonials[testimonialIndex].avatar} 
                  alt={testimonials[testimonialIndex].name} 
                  className="w-10 h-10 rounded-full object-cover border border-[#d4af37]" 
                />
                <div>
                  <p className="text-sm font-bold text-white">{testimonials[testimonialIndex].name}</p>
                  <p className="text-[11px] text-[#d4af37]">{testimonials[testimonialIndex].service}</p>
                </div>
              </div>
            </div>

            {/* Dots below on mobile */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                    testimonialIndex === i ? "bg-[#d4af37] w-6" : "bg-[#333]"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION BAND: Full-width gold-outlined box, centred headline, one gold "Book your chair" button */}
      <section className="w-full py-24 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="rounded-3xl border border-[#d4af37]/60 bg-gradient-to-r from-[#181818] via-[#141414] to-[#181818] p-10 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efe0] max-w-xl mx-auto leading-tight">
              Ready for Nairobi's Finest Grooming Experience?
            </h2>
            <p className="text-sm text-[#a8a29e] max-w-md mx-auto">
              Your chair is waiting. Select your preferred slot and confirm instantly via Safaricom M-Pesa.
            </p>
            <div>
              <button
                onClick={() => setCurrentView("booking")}
                className="h-12 md:h-11 px-10 rounded-xl bg-gradient-to-r from-[#f3d77a] via-[#d4af37] to-[#9c7a1f] text-[#0b0b0b] font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#d4af37]/25 hover:brightness-110 active:scale-95 transition gold-shimmer cursor-pointer"
              >
                Book your chair
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <Footer />

    </div>
  );
}
