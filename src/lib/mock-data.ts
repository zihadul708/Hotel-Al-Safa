// In-memory persistent data store & fallback catalog for Hotel Al Safa
// Ensures seamless operation on Vercel Serverless Functions where local SQLite is unavailable.

export interface FallbackRoomType {
  id: string;
  slug: string;
  name: string;
  category: string;
  isAc: boolean;
  basePrice: number;
  capacity: number;
  bedType: string;
  sizeSqFt: number;
  description: string;
  images: string[];
  amenities: string[];
  featured: boolean;
  availableUnits: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FallbackBooking {
  id: string;
  bookingCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestNidPassport: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  status: string;
  specialRequests: string | null;
  airportTransfer: boolean;
  extraBed: boolean;
  breakfast: boolean;
  promoCode: string | null;
  discountAmount: number;
  roomTypeId: string;
  roomType: FallbackRoomType;
  createdAt: string;
  updatedAt: string;
}

export interface FallbackInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export interface FallbackPromoCode {
  id: string;
  code: string;
  discountPct: number | null;
  discountAmt: number | null;
  minNights: number;
  isActive: boolean;
}

export const INITIAL_ROOMS: FallbackRoomType[] = [
  // 1. Deluxe Single (AC) - 2000tk
  {
    id: "room-deluxe-single",
    slug: "deluxe-single",
    name: "Deluxe Single Room (AC)",
    category: "Deluxe",
    isAc: true,
    basePrice: 2000,
    capacity: 1,
    bedType: "1 Single Bed",
    sizeSqFt: 180,
    description:
      "Quiet, comfortable air-conditioned single room designed for solo travelers and airport transit. Includes split AC, high-speed Wi-Fi, desk, and attached hot geyser bathroom.",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Split Air Conditioner",
      "High-Speed Wi-Fi",
      "En-suite Bathroom & Hot Water Geyser",
      "32\" LED TV",
      "Work Desk & Chair",
      "Room Service",
    ],
    featured: false,
    availableUnits: 6,
  },

  // 2. Deluxe Couple (AC) - 2500tk
  {
    id: "room-deluxe-couple",
    slug: "deluxe-couple",
    name: "Deluxe Couple Room (AC)",
    category: "Deluxe",
    isAc: true,
    basePrice: 2500,
    capacity: 2,
    bedType: "1 Queen Bed",
    sizeSqFt: 240,
    description:
      "Elegant air-conditioned couple room featuring a queen-size bed, ambient lighting, high-speed Wi-Fi, 24/7 hot water geyser, and attached bathroom for a peaceful stay.",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Split Air Conditioner",
      "Free High-Speed Wi-Fi",
      "En-suite Bathroom & Hot Water Geyser",
      "32\" LED Smart TV",
      "Complimentary Toiletries & Towels",
      "Electric Kettle & Tea Setup",
      "Room Service & Intercom",
    ],
    featured: true,
    availableUnits: 8,
  },

  // 3. Deluxe Twin (AC) - 3000tk
  {
    id: "room-deluxe-twin",
    slug: "deluxe-twin",
    name: "Deluxe Twin Room (AC)",
    category: "Deluxe",
    isAc: true,
    basePrice: 3000,
    capacity: 2,
    bedType: "2 Separate Single Beds",
    sizeSqFt: 270,
    description:
      "Spacious AC room with two separate single beds, ideal for colleagues, friends, or pilgrims traveling in pairs. Equipped with split AC, fast Wi-Fi, and work desk.",
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507038772120-7ffe76f79d01?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Split Air Conditioner",
      "High-Speed Fiber Wi-Fi",
      "32\" Smart TV",
      "Hot Water Rain Shower",
      "Work Table & Chairs",
      "Daily Housekeeping",
      "Luggage Storage",
    ],
    featured: true,
    availableUnits: 7,
  },

  // 4. Deluxe Double (AC) - 3500tk
  {
    id: "room-deluxe-double",
    slug: "deluxe-double",
    name: "Deluxe Double Room (AC)",
    category: "Deluxe",
    isAc: true,
    basePrice: 3500,
    capacity: 2,
    bedType: "1 King Bed",
    sizeSqFt: 300,
    description:
      "Premium spacious double room with modern split AC, king-size bed, 43\" LED TV, seating area, wardrobe, and luxury toiletries for an elevated transit experience.",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Split Air Conditioner",
      "King Size Bed",
      "43\" Smart LED TV",
      "Mini Fridge",
      "En-suite Bathroom with Hot Geyser",
      "Complimentary Toiletries & Towels",
      "24/7 Room Service",
    ],
    featured: true,
    availableUnits: 6,
  },

  // 5. Deluxe Family (AC) - 4000tk
  {
    id: "room-deluxe-family",
    slug: "deluxe-family",
    name: "Deluxe Family Suite (AC)",
    category: "Deluxe",
    isAc: true,
    basePrice: 4000,
    capacity: 4,
    bedType: "2 Double / Queen Beds",
    sizeSqFt: 380,
    description:
      "Spacious air-conditioned family suite featuring two large beds, comfortable lounge seating, split AC, LED TV, and ample luggage space for families or pilgrim groups.",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Split Air Conditioner",
      "2 Queen / Double Beds",
      "50\" Smart 4K TV",
      "Living Lounge & Sofa Suite",
      "Tea/Coffee Maker Bar",
      "Luxury Toiletries & Towels",
      "Airport Shuttle Assistance",
    ],
    featured: true,
    availableUnits: 5,
  },

  // 6. Economy Single (Non-AC) - 1500tk
  {
    id: "room-economy-single",
    slug: "economy-single",
    name: "Economy Single Room (Non-AC)",
    category: "Economy",
    isAc: false,
    basePrice: 1500,
    capacity: 1,
    bedType: "1 Single Bed",
    sizeSqFt: 160,
    description:
      "Affordable, well-ventilated single room with ceiling fan, high-speed Wi-Fi, clean fresh linens, and attached private bathroom tailored for budget solo travelers.",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "High-Speed Ceiling Fan & Natural Air Flow",
      "Free Wi-Fi",
      "Attached Bathroom with Shower",
      "Clean Bed Linens & Towels",
      "Daily Housekeeping",
      "Luggage Storage",
    ],
    featured: false,
    availableUnits: 6,
  },

  // 7. Economy Couple (Non-AC) - 2000tk
  {
    id: "room-economy-couple",
    slug: "economy-couple",
    name: "Economy Couple Room (Non-AC)",
    category: "Economy",
    isAc: false,
    basePrice: 2000,
    capacity: 2,
    bedType: "1 Double Bed",
    sizeSqFt: 210,
    description:
      "Clean and ventilated budget-friendly room with double bed, high-speed fan, free Wi-Fi, and attached bathroom. Perfect for cost-conscious transit couples and Hajj pilgrims.",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "High-Speed Ceiling Fan",
      "Free Wi-Fi",
      "Attached Bathroom",
      "Fresh Bedding & Towels",
      "Intercom Calling",
      "Daily Housekeeping",
    ],
    featured: false,
    availableUnits: 8,
  },

  // 8. Economy Twin (Non-AC) - 2500tk
  {
    id: "room-economy-twin",
    slug: "economy-twin",
    name: "Economy Twin Room (Non-AC)",
    category: "Economy",
    isAc: false,
    basePrice: 2500,
    capacity: 2,
    bedType: "2 Separate Single Beds",
    sizeSqFt: 240,
    description:
      "Budget twin room featuring two separate beds, ceiling fan, natural airflow, free Wi-Fi, and attached bathroom for partners traveling together on a budget.",
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507038772120-7ffe76f79d01?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "2 Single Beds",
      "High-Speed Ceiling Fan",
      "Free Wi-Fi",
      "Attached Bathroom with Shower",
      "Luggage Rack",
      "Housekeeping",
    ],
    featured: false,
    availableUnits: 6,
  },

  // 9. Economy Double (Non-AC) - 2500tk
  {
    id: "room-economy-double",
    slug: "economy-double",
    name: "Economy Double Room (Non-AC)",
    category: "Economy",
    isAc: false,
    basePrice: 2500,
    capacity: 2,
    bedType: "1 Large Double Bed",
    sizeSqFt: 250,
    description:
      "Airy, spacious double bedroom with high-speed ceiling fan, large windows, free Wi-Fi, table, and private bathroom at an economical daily rate.",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Large Double Bed",
      "High-Speed Ceiling Fan",
      "Free Wi-Fi",
      "Private Bathroom & Shower",
      "Natural Ventilation",
      "Room Service",
    ],
    featured: false,
    availableUnits: 6,
  },

  // 10. Economy Family (Non-AC) - 3000tk
  {
    id: "room-economy-family",
    slug: "economy-family",
    name: "Economy Family Room (Non-AC)",
    category: "Economy",
    isAc: false,
    basePrice: 3000,
    capacity: 4,
    bedType: "2 Double Beds",
    sizeSqFt: 340,
    description:
      "Large, well-ventilated family room accommodating up to 4 guests with two double beds, high-speed ceiling fans, free Wi-Fi, and private bathroom for family transit.",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "2 Double Beds (Sleeps 4)",
      "Dual Ceiling Fans",
      "Attached Bathroom with Shower",
      "Free Wi-Fi",
      "Ample Wardrobe & Luggage Area",
      "24/7 Front Desk Support",
    ],
    featured: true,
    availableUnits: 5,
  },
];

export const INITIAL_PROMOS: FallbackPromoCode[] = [
  {
    id: "promo-1",
    code: "ALSAFA10",
    discountPct: 10,
    discountAmt: null,
    minNights: 1,
    isActive: true,
  },
  {
    id: "promo-2",
    code: "TRANSIT500",
    discountPct: null,
    discountAmt: 500,
    minNights: 1,
    isActive: true,
  },
  {
    id: "promo-3",
    code: "WELCOME",
    discountPct: null,
    discountAmt: 300,
    minNights: 1,
    isActive: true,
  },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

export const INITIAL_BOOKINGS: FallbackBooking[] = [
  {
    id: "booking-1",
    bookingCode: "ALSAFA-84291",
    guestName: "Tanvir Ahmed",
    guestEmail: "tanvir.ahmed@example.com",
    guestPhone: "+880 1711-234567",
    guestNidPassport: "1994827162910",
    checkIn: today.toISOString(),
    checkOut: tomorrow.toISOString(),
    nights: 1,
    adults: 2,
    children: 0,
    totalAmount: 2500,
    paidAmount: 2500,
    paymentStatus: "PAID",
    paymentMethod: "BKASH",
    status: "CHECKED_IN",
    airportTransfer: true,
    extraBed: false,
    breakfast: true,
    specialRequests: "Arriving on flight BG-042 at 6:30 PM. Needs airport pickup.",
    promoCode: null,
    discountAmount: 0,
    roomTypeId: "room-deluxe-couple",
    roomType: INITIAL_ROOMS[1],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "booking-2",
    bookingCode: "ALSAFA-91024",
    guestName: "Dr. Rafiqul Islam",
    guestEmail: "rafiqul.islam@hospital.edu.bd",
    guestPhone: "+880 1819-876543",
    guestNidPassport: null,
    checkIn: today.toISOString(),
    checkOut: dayAfter.toISOString(),
    nights: 2,
    adults: 4,
    children: 1,
    totalAmount: 8000,
    paidAmount: 8000,
    paymentStatus: "PAID",
    paymentMethod: "BANK_TRANSFER",
    status: "CONFIRMED",
    airportTransfer: false,
    extraBed: true,
    breakfast: true,
    specialRequests: "Quiet floor preferred for family pilgrim group.",
    promoCode: null,
    discountAmount: 0,
    roomTypeId: "room-deluxe-family",
    roomType: INITIAL_ROOMS[4],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "booking-3",
    bookingCode: "ALSAFA-63821",
    guestName: "Mahbubur Rahman",
    guestEmail: "mahbub.corp@dhakatech.com",
    guestPhone: "+880 1912-349812",
    guestNidPassport: null,
    checkIn: tomorrow.toISOString(),
    checkOut: dayAfter.toISOString(),
    nights: 1,
    adults: 2,
    children: 0,
    totalAmount: 2500,
    paidAmount: 2500,
    paymentStatus: "PAID",
    paymentMethod: "NAGAD",
    status: "CONFIRMED",
    airportTransfer: false,
    extraBed: false,
    breakfast: true,
    specialRequests: null,
    promoCode: null,
    discountAmount: 0,
    roomTypeId: "room-economy-twin",
    roomType: INITIAL_ROOMS[7],
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_INQUIRIES: FallbackInquiry[] = [
  {
    id: "inquiry-1",
    name: "Kamal Hossain",
    email: "kamal.hossain@gmail.com",
    phone: "+880 1715-998877",
    subject: "Late Night Airport Shuttle (2:30 AM arrival)",
    message: "We are arriving on flight EK-584 at 2:30 AM with 3 large suitcases. Do you offer shuttle pickup at that time?",
    status: "NEW",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "inquiry-2",
    name: "Farhana Yasmin",
    email: "farhana.y@corporate.bd",
    phone: "+880 1819-445566",
    subject: "Deluxe Family Suite booking for 4 nights",
    message: "Can you arrange early check-in around 9:00 AM on Friday for the Deluxe Family Suite?",
    status: "READ",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

// Global in-memory cache to preserve runtime modifications across API invocations
const globalStore = globalThis as unknown as {
  __AL_SAFA_ROOMS?: FallbackRoomType[];
  __AL_SAFA_BOOKINGS?: FallbackBooking[];
  __AL_SAFA_INQUIRIES?: FallbackInquiry[];
  __AL_SAFA_PROMOS?: FallbackPromoCode[];
};

if (!globalStore.__AL_SAFA_ROOMS) {
  globalStore.__AL_SAFA_ROOMS = [...INITIAL_ROOMS];
}
if (!globalStore.__AL_SAFA_BOOKINGS) {
  globalStore.__AL_SAFA_BOOKINGS = [...INITIAL_BOOKINGS];
}
if (!globalStore.__AL_SAFA_INQUIRIES) {
  globalStore.__AL_SAFA_INQUIRIES = [...INITIAL_INQUIRIES];
}
if (!globalStore.__AL_SAFA_PROMOS) {
  globalStore.__AL_SAFA_PROMOS = [...INITIAL_PROMOS];
}

export const fallbackStore = {
  getRooms(): FallbackRoomType[] {
    return globalStore.__AL_SAFA_ROOMS ?? INITIAL_ROOMS;
  },

  getRoomByIdOrSlug(identifier: string): FallbackRoomType | undefined {
    return this.getRooms().find(
      (r) => r.id === identifier || r.slug === identifier
    );
  },

  updateRoom(id: string, data: Partial<FallbackRoomType>): FallbackRoomType | null {
    const rooms = this.getRooms();
    const idx = rooms.findIndex((r) => r.id === id || r.slug === id);
    if (idx === -1) return null;
    rooms[idx] = { ...rooms[idx], ...data, updatedAt: new Date().toISOString() };
    return rooms[idx];
  },

  getBookings(): FallbackBooking[] {
    return globalStore.__AL_SAFA_BOOKINGS ?? INITIAL_BOOKINGS;
  },

  getBookingByCode(code: string): FallbackBooking | undefined {
    return this.getBookings().find(
      (b) => b.bookingCode.toUpperCase() === code.trim().toUpperCase()
    );
  },

  getBookingById(id: string): FallbackBooking | undefined {
    return this.getBookings().find((b) => b.id === id);
  },

  addBooking(bookingData: Omit<FallbackBooking, "id" | "createdAt" | "updatedAt">): FallbackBooking {
    const bookings = this.getBookings();
    const newBooking: FallbackBooking = {
      ...bookingData,
      id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    return newBooking;
  },

  updateBooking(id: string, data: Partial<FallbackBooking>): FallbackBooking | null {
    const bookings = this.getBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    bookings[idx] = { ...bookings[idx], ...data, updatedAt: new Date().toISOString() };
    return bookings[idx];
  },

  deleteBooking(id: string): boolean {
    const bookings = this.getBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    bookings.splice(idx, 1);
    return true;
  },

  getInquiries(): FallbackInquiry[] {
    return globalStore.__AL_SAFA_INQUIRIES ?? INITIAL_INQUIRIES;
  },

  addInquiry(inquiryData: Omit<FallbackInquiry, "id" | "createdAt">): FallbackInquiry {
    const inquiries = this.getInquiries();
    const newInquiry: FallbackInquiry = {
      ...inquiryData,
      id: `inquiry-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    return newInquiry;
  },

  updateInquiry(id: string, status: string): FallbackInquiry | null {
    const inquiries = this.getInquiries();
    const idx = inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    inquiries[idx] = { ...inquiries[idx], status };
    return inquiries[idx];
  },

  deleteInquiry(id: string): boolean {
    const inquiries = this.getInquiries();
    const idx = inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    inquiries.splice(idx, 1);
    return true;
  },

  getPromos(): FallbackPromoCode[] {
    return globalStore.__AL_SAFA_PROMOS ?? INITIAL_PROMOS;
  },

  findPromo(code: string): FallbackPromoCode | undefined {
    return this.getPromos().find(
      (p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive
    );
  },
};
