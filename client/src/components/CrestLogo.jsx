import React from 'react';

/**
 * Sam Kitiki Monogram Crest Logo
 * Simple gold monogram 'SK' in a luxury crest shield / double circle.
 */
export function CrestLogo({ size = 48, className = "", variant = "badge" }) {
  const isMinimal = variant === "minimal";

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 64 64" 
        width={size} 
        height={size} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="skGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3d77a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9c7a1f" />
          </linearGradient>
          <linearGradient id="skDarkBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0d0d0d" />
          </linearGradient>
          <filter id="skGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shield / Outer Circle Backing */}
        <circle 
          cx="32" 
          cy="32" 
          r="30" 
          fill="url(#skDarkBg)" 
          stroke="url(#skGoldGrad)" 
          strokeWidth="1.2" 
        />

        {/* Dotted luxury inner accent ring */}
        <circle 
          cx="32" 
          cy="32" 
          r="26.5" 
          fill="none" 
          stroke="#d4af37" 
          strokeOpacity="0.4" 
          strokeWidth="1" 
          strokeDasharray="2 3" 
        />

        {/* Inner Solid Crest Ring */}
        <circle 
          cx="32" 
          cy="32" 
          r="23" 
          fill="none" 
          stroke="url(#skGoldGrad)" 
          strokeWidth="1" 
        />

        {/* S Monogram */}
        <path 
          d="M21 24 C21 20.5 24.5 18.5 28.5 18.5 C32.5 18.5 35 20.5 35 23 C35 26.5 31.5 28 27.5 29.5 C23.5 31 20.5 33 20.5 36.5 C20.5 40.5 24 43 28.5 43 C33 43 35.5 40.5 35.5 38" 
          stroke="url(#skGoldGrad)" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* K Monogram */}
        <path 
          d="M41 19 L41 43 M41.5 31.5 L49.5 19 M42.5 31.5 L50.5 43" 
          stroke="url(#skGoldGrad)" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Subtle Crown / Scissors Mini Crest Accent at top */}
        <path
          d="M30 13.5 L32 11.5 L34 13.5"
          stroke="#f3d77a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Subtle Barber Tools Wallpaper SVG Pattern (scissors, comb, razor, clippers)
 * Fixed low-opacity backdrop (4-6% opacity) for rich dark surfaces
 */
export function BarberPatternBackdrop({ opacity = 0.04, className = "" }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="barberToolsPattern" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Scissors Motif */}
            <g transform="translate(15, 15) scale(0.7)" stroke="#d4af37" strokeWidth="1.5" fill="none">
              <circle cx="6" cy="6" r="4" />
              <circle cx="6" cy="22" r="4" />
              <path d="M9 8 L24 20" />
              <path d="M9 20 L24 8" />
            </g>

            {/* Comb Motif */}
            <g transform="translate(70, 20) scale(0.65)" stroke="#d4af37" strokeWidth="1.2" fill="none">
              <rect x="0" y="0" width="36" height="8" rx="2" fill="#d4af37" fillOpacity="0.3" />
              <line x1="4" y1="8" x2="4" y2="20" />
              <line x1="8" y1="8" x2="8" y2="20" />
              <line x1="12" y1="8" x2="12" y2="20" />
              <line x1="16" y1="8" x2="16" y2="20" />
              <line x1="20" y1="8" x2="20" y2="20" />
              <line x1="24" y1="8" x2="24" y2="20" />
              <line x1="28" y1="8" x2="28" y2="20" />
              <line x1="32" y1="8" x2="32" y2="20" />
            </g>

            {/* Straight Razor Motif */}
            <g transform="translate(20, 75) scale(0.7)" stroke="#d4af37" strokeWidth="1.4" fill="none">
              <path d="M4 14 C12 6, 26 4, 34 8" />
              <path d="M4 14 L24 24" />
              <circle cx="4" cy="14" r="1.5" fill="#d4af37" />
            </g>

            {/* Clipper Blade Motif */}
            <g transform="translate(75, 75) scale(0.65)" stroke="#d4af37" strokeWidth="1.2" fill="none">
              <rect x="2" y="4" width="28" height="22" rx="4" />
              <path d="M6 4 L6 0 M10 4 L10 0 M14 4 L14 0 M18 4 L18 0 M22 4 L22 0 M26 4 L26 0" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#barberToolsPattern)" />
      </svg>
    </div>
  );
}

/**
 * Gold Ornamental Section Divider with small Scissors/Comb in center
 */
export function SectionDivider({ icon = "scissors", className = "" }) {
  return (
    <div className={`relative flex items-center justify-center my-12 max-w-5xl mx-auto px-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/35 to-[#d4af37]/70" />
      <div className="mx-4 p-1.5 rounded-full bg-[#151515] border border-[#d4af37]/40 text-[#d4af37] shadow-sm shadow-[#d4af37]/20 flex items-center justify-center">
        {icon === "scissors" ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )}
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#d4af37]/35 to-[#d4af37]/70" />
    </div>
  );
}

