/**
 * Mock Data Store for Sam Kitiki Grooming Lounge
 * Instagram: @kitikisam_the_barber
 * Currency: KES
 */

export const INITIAL_SERVICES = [
  // MEN
  {
    id: "srv_men_1",
    name: "Gentlemen Cut",
    category: "Men",
    price: 1000,
    durationMin: 45,
    description: "Tailored cut, shampoo, scalp massage and light facial massage, with hot towel treatment and styling.",
    badge: "Popular",
    isBookableOnline: true
  },
  {
    id: "srv_men_2",
    name: "Advanced Styled Cut",
    category: "Men",
    price: 1000,
    durationMin: 50,
    description: "Stylized cut personalised to your taste, shampoo, scalp massage and light facial massage, with hot towel treatment and styling.",
    badge: "Signature",
    isBookableOnline: true
  },
  {
    id: "srv_men_3",
    name: "Beard or Mustache Trim",
    category: "Men",
    price: 500,
    durationMin: 20,
    description: "Precision beard sculpt, razor edge detailing, hot towel steam and nourishing conditioning oil.",
    badge: null,
    isBookableOnline: true
  },
  {
    id: "srv_men_4",
    name: "Young Man's Cut",
    category: "Men",
    price: 500,
    durationMin: 30,
    description: "Gentle, tailored haircut and styling for young kings (under 13 years).",
    badge: "Kids",
    isBookableOnline: true
  },
  {
    id: "srv_men_5",
    name: "Caucasian Haircut",
    category: "Men",
    price: 1500,
    durationMin: 45,
    description: "Specialized texturizing, scissor over comb blending, hot towel refresh and custom matte styling.",
    badge: null,
    isBookableOnline: true
  },

  // LADIES
  {
    id: "srv_ladies_1",
    name: "Fresh Cut (BIG CHOP)",
    category: "Ladies",
    price: 1500,
    durationMin: 60,
    description: "Transition from long hair to a unique pixie cut, tapered cut or signature short look with deep wash.",
    badge: "Big Chop",
    isBookableOnline: true
  },
  {
    id: "srv_ladies_2",
    name: "Ladies Cut",
    category: "Ladies",
    price: 1000,
    durationMin: 40,
    description: "Tailored precision cut, shampoo, rejuvenating scalp massage and sleek styling.",
    badge: null,
    isBookableOnline: true
  },
  {
    id: "srv_ladies_3",
    name: "Advanced Styled Cut",
    category: "Ladies",
    price: 1500,
    durationMin: 50,
    description: "Styled cut personalised to your taste, luxury shampoo, scalp soothing treatment and custom design styling.",
    badge: "Signature",
    isBookableOnline: true
  },
  {
    id: "srv_ladies_4",
    name: "Haircut, Style and Black Color",
    category: "Ladies",
    price: 2500,
    durationMin: 75,
    description: "Complete haircut, styling design of your choice and revamping your hair to a glossy rich jet black.",
    badge: "Best Value",
    isBookableOnline: true
  },
  {
    id: "srv_ladies_5",
    name: "Texturizer",
    category: "Ladies",
    price: 1000,
    durationMin: 35,
    description: "Mild texture loosening for natural curl definition, manageable softness, and high shine.",
    badge: null,
    isBookableOnline: true
  },

  // COLOURS
  {
    id: "srv_col_1",
    name: "Black Color Revamp",
    category: "Colours",
    price: 1000,
    durationMin: 40,
    description: "High-definition grey blending and deep jet black gloss treatment for hair or beard.",
    badge: null,
    isBookableOnline: true
  },
  {
    id: "srv_col_2",
    name: "Copper Color",
    category: "Colours",
    price: 2500,
    durationMin: 90,
    description: "A choice of colours ranging from maroon, mahogany, brown, red, blonde or any vibrant shade of your choice.",
    badge: "Vibrant",
    isBookableOnline: true
  },
  {
    id: "srv_col_3",
    name: "White, Silver and Grey",
    category: "Colours",
    price: 5000,
    durationMin: 120,
    description: "Master multi-stage lightening, cool platinum silver toning and deep bond-building conditioning treatment.",
    badge: "Master Work",
    isBookableOnline: true
  },
  {
    id: "srv_col_4",
    name: "Eyebrows Trim",
    category: "Colours",
    price: 200,
    durationMin: 10,
    description: "Clean straight-razor eyebrow arch definition and grooming clean up.",
    badge: null,
    isBookableOnline: true
  },

  // OTHER (Not bookable online, requires call/WhatsApp)
  {
    id: "srv_oth_1",
    name: "Grooming Parties",
    category: "Other",
    price: 0,
    durationMin: 180,
    description: "Exclusive lounge booking for groomsmen, birthdays, executive retreats with VIP refreshments & grooming.",
    badge: "Enquire",
    isBookableOnline: false
  },
  {
    id: "srv_oth_2",
    name: "VIP House Call / Doorstep Service",
    category: "Other",
    price: 0,
    durationMin: 90,
    description: "Sam Kitiki brings the entire luxury barbershop setup directly to your private home, hotel, or office anywhere in Nairobi.",
    badge: "VIP Doorstep",
    isBookableOnline: false
  }
];

export const INITIAL_BARBERS = [
  {
    id: "barb_1",
    name: "Sam Kitiki",
    title: "Master Barber & Founder",
    instagram: "@kitikisam_the_barber",
    photoLabel: "Photo of Sam Kitiki",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    specialty: "Celebrity Grooming, Flat Tops & Hair Art",
    rating: 5.0,
    reviews: 684,
    workingHours: { start: "08:30", end: "20:00" },
    active: true
  },
  {
    id: "barb_2",
    name: "Brayo (Senior Barber)",
    title: "Fade & Shave Specialist",
    instagram: "@brayo_kutz",
    photoLabel: "Photo of Senior Barber Brayo",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    specialty: "Drop Tapers, Skin Fades & Hot Towel Beards",
    rating: 4.9,
    reviews: 312,
    workingHours: { start: "09:00", end: "19:30" },
    active: true
  },
  {
    id: "barb_3",
    name: "Eric (Color & Styling)",
    title: "Creative Colorist & Stylist",
    instagram: "@eric_styles_ke",
    photoLabel: "Photo of Stylist Eric",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
    specialty: "Silver Blonde Color, Waves & Ladies Pixie Cuts",
    rating: 4.9,
    reviews: 245,
    workingHours: { start: "08:30", end: "18:30" },
    active: true
  }
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Signature Flat Top & Crisp Mid-Fade",
    category: "Men",
    label: "Placeholder: Geometric Flat Top with crisp clean razor lineup",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    title: "Platinum Silver & Cool Grey Dye",
    category: "Colours",
    label: "Placeholder: Master platinum silver transformation with smooth fade",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    title: "Royal Beard Sculpt & Razor Line",
    category: "Men",
    label: "Placeholder: High definition beard contour and hot towel steam",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    title: "Ladies Big Chop & Textured Pixie",
    category: "Ladies",
    label: "Placeholder: Ladies bold big chop tapered fade transition",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    title: "Drop Taper Fade with Surgical Part",
    category: "Men",
    label: "Placeholder: Surgical parting design and skin drop taper",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    title: "Vibrant Copper Mahogany Color",
    category: "Colours",
    label: "Placeholder: Rich warm copper and burgundy hair revamping",
    image: "https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    title: "Young King's Fade & Star Hair Art",
    category: "Men",
    label: "Placeholder: Clean junior boy haircut with razor art accent",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    title: "Executive Doorstep House Call",
    category: "VIP",
    label: "Placeholder: VIP on-location cut setup in executive suite",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    title: "Black Gloss Revamp & Wave Detailing",
    category: "Colours",
    label: "Placeholder: Jet black gloss treatment and 360 wave finish",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80"
  }
];

export const INITIAL_SETTINGS = {
  shopName: "Sam Kitiki Kutz",
  tagline: "Celebrity Grooming & Master Barber Lounge",
  barberName: "Sam Kitiki",
  instagram: "kitikisam_the_barber",
  phone: "+254 724 590 868",
  whatsapp: "254724590868",
  location: "Utawala & Executive Mobile VIP, Nairobi, Kenya",
  openingTime: "08:30",
  closingTime: "20:00",
  depositAmount: 300,
  dailyCapacityLimit: 24,
  cancellationWindowHours: 2,
  currency: "KES"
};

// Generate seed mock appointments
const getTodayStr = () => new Date().toISOString().split("T")[0];

export const INITIAL_APPOINTMENTS = [
  {
    id: "apt_101",
    reference: "SKK-9821",
    clientName: "Governor Johnson Sakaja",
    clientPhone: "+254 722 100 200",
    barberId: "barb_1",
    barberName: "Sam Kitiki",
    serviceIds: ["srv_men_1"],
    serviceNames: "Gentlemen Cut",
    totalPrice: 1000,
    depositPaid: 300,
    mpesaRef: "QHJ891K20L",
    date: getTodayStr(),
    startTime: "09:30",
    endTime: "10:15",
    status: "arrived", // arrived, confirmed, completed, cancelled, no_show
    createdAt: new Date().toISOString()
  },
  {
    id: "apt_102",
    reference: "SKK-7412",
    clientName: "Khaligraph Jones",
    clientPhone: "+254 711 445 566",
    barberId: "barb_1",
    barberName: "Sam Kitiki",
    serviceIds: ["srv_men_2", "srv_men_3"],
    serviceNames: "Advanced Styled Cut + Beard Trim",
    totalPrice: 1500,
    depositPaid: 300,
    mpesaRef: "QLP458M92X",
    date: getTodayStr(),
    startTime: "11:00",
    endTime: "12:10",
    status: "confirmed",
    createdAt: new Date().toISOString()
  },
  {
    id: "apt_103",
    reference: "SKK-5519",
    clientName: "Wanjiru Kamau",
    clientPhone: "+254 700 889 900",
    barberId: "barb_3",
    barberName: "Eric (Color & Styling)",
    serviceIds: ["srv_ladies_1"],
    serviceNames: "Fresh Cut (BIG CHOP)",
    totalPrice: 1500,
    depositPaid: 300,
    mpesaRef: "QRS712J01K",
    date: getTodayStr(),
    startTime: "14:00",
    endTime: "15:00",
    status: "confirmed",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_WALKINS = [
  {
    id: "wk_1",
    clientName: "Dennis Kipchumba",
    clientPhone: "0720987654",
    serviceId: "srv_men_1",
    serviceName: "Gentlemen Cut",
    barberId: "barb_1",
    barberName: "Sam Kitiki",
    estimatedWaitMin: 15,
    status: "waiting"
  }
];

export const INITIAL_CLIENTS = [
  {
    id: "cli_1",
    name: "Governor Johnson Sakaja",
    phone: "+254 722 100 200",
    visits: 12,
    lastVisit: getTodayStr(),
    noShowCount: 0,
    notes: "VIP client. Prefers extra hot towel."
  },
  {
    id: "cli_2",
    name: "Khaligraph Jones",
    phone: "+254 711 445 566",
    visits: 8,
    lastVisit: "2026-10-10",
    noShowCount: 0,
    notes: "Beard shaping with argan oil."
  },
  {
    id: "cli_3",
    name: "Wanjiru Kamau",
    phone: "+254 700 889 900",
    visits: 3,
    lastVisit: "2026-10-12",
    noShowCount: 0,
    notes: "Loves short textured pixie cuts."
  },
  {
    id: "cli_4",
    name: "Kevin Maina",
    phone: "+254 733 456 789",
    visits: 6,
    lastVisit: "2026-09-28",
    noShowCount: 1,
    notes: "1 no-show recorded."
  }
];

export const INITIAL_BLOCKED_SLOTS = [
  {
    id: "blk_1",
    barberId: "barb_1",
    date: getTodayStr(),
    time: "13:00",
    reason: "Lunch Break"
  },
  {
    id: "blk_2",
    barberId: "barb_2",
    date: getTodayStr(),
    time: "13:30",
    reason: "Lunch Break"
  }
];

