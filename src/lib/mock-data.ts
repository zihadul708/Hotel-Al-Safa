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
  {
    id: "room-couple-ac-deluxe",
    slug: "couple-ac-deluxe",
    name: "Couple AC Deluxe Room",
    category: "Couple",
    isAc: true,
    basePrice: 3500,
    capacity: 2,
    bedType: "1 Queen Size Bed",
    sizeSqFt: 240,
    description:
      "Designed for couples and transit travelers seeking comfort and peace. Features modern split-air conditioning, high-speed Wi-Fi, en-suite bathroom with 24/7 hot geyser, and cozy ambient lighting.",
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
      "Room Service & Intercom",
      "Electric Kettle & Tea Setup",
      "Work Desk & Chair",
    ],
    featured: true,
    availableUnits: 8,
  },
  {
    id: "room-couple-non-ac-economy",
    slug: "couple-non-ac-economy",
    name: "Couple Economy Room (Non-AC)",
    category: "Economy",
    isAc: false,
    basePrice: 1400,
    capacity: 2,
    bedType: "1 Double Bed",
    sizeSqFt: 200,
    description:
      "Affordable, clean, and ventilated accommodation tailored for budget-conscious transit passengers, short-stay travelers, and Hajj/Umrah pilgrims. Complete with fresh linens and attached bathroom.",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "High-Speed Ceiling Fan & Natural Air Flow",
      "Free Wi-Fi",
      "Attached Bathroom with Shower",
      "Complimentary Bath Towels",
      "Daily Housekeeping",
      "Intercom Calling",
      "Luggage Storage",
    ],
    featured: false,
    availableUnits: 6,
  },
  {
    id: "room-super-deluxe-twin",
    slug: "super-deluxe-twin",
    name: "Super Deluxe Twin Bed AC",
    category: "Deluxe",
    isAc: true,
    basePrice: 4800,
    capacity: 3,
    bedType: "2 Twin Large Beds",
    sizeSqFt: 310,
    description:
      "Spacious luxury room ideal for friends, colleagues, or small families. Furnished with two premium semi-double beds, large soundproof double-glazed windows, mini-fridge, and plush seating corner.",
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507038772120-7ffe76f79d01?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Split Air Conditioner",
      "High-Speed Fiber Wi-Fi",
      "43\" 4K Android TV with Streaming",
      "Mini Refrigerator",
      "Hot Water Rain Shower",
      "Complimentary Buffet Breakfast",
      "Hair Dryer & Shaving Kit",
      "Airport Shuttle Assistance",
    ],
    featured: true,
    availableUnits: 7,
  },
  {
    id: "room-executive-family-suite",
    slug: "executive-family-suite",
    name: "Executive Royal Family Suite",
    category: "Family",
    isAc: true,
    basePrice: 6500,
    capacity: 5,
    bedType: "1 King Bed + 1 Queen Bed",
    sizeSqFt: 460,
    description:
      "Our signature family accommodation featuring dual master beds, private sitting lounge, panoramic city views, dining table, and spacious luggage wardrobes for extended holiday or pilgrim stays.",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Dual Inverter ACs",
      "Ultra-Fast Dedicated Wi-Fi",
      "50\" Smart 4K TV",
      "Living Lounge & Sofa Suite",
      "Tea/Coffee Maker Bar",
      "Complimentary Breakfast for 4",
      "Luxury Toiletries & Bathrobes",
      "Free Airport Pickup / Drop-off",
    ],
    featured: true,
    availableUnits: 4,
  },
  {
    id: "room-presidential-al-safa-suite",
    slug: "presidential-al-safa-suite",
    name: "The Al Safa Presidential Suite",
    category: "Suite",
    isAc: true,
    basePrice: 9500,
    capacity: 4,
    bedType: "1 Grand California King Bed",
    sizeSqFt: 580,
    description:
      "The pinnacle of luxury at Hotel Al Safa. An expansive suite with handcrafted gold-accented furnishings, master bedroom, VIP lounge with leather recliners, jacuzzi bathroom, and 24-hour private butler service.",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Jacuzzi Bathtub & Rain Shower",
      "VIP 24/7 Butler Service",
      "Complimentary Airport Limousine Transfer",
      "Full Continental & Desi Breakfast Buffet",
      "55\" OLED Cinema Display",
      "Espresso Machine & Minibar",
      "Private Balcony Terrace",
      "Complimentary Laundry Service",
    ],
    featured: true,
    availableUnits: 2,
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
    totalAmount: 3850,
    paidAmount: 3850,
    paymentStatus: "PAID",
    paymentMethod: "BKASH",
    status: "CHECKED_IN",
    airportTransfer: true,
    extraBed: false,
    breakfast: true,
    specialRequests: "Arriving on flight BG-042 at 6:30 PM. Needs airport pickup.",
    promoCode: null,
    discountAmount: 0,
    roomTypeId: "room-couple-ac-deluxe",
    roomType: INITIAL_ROOMS[0],
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
    totalAmount: 14300,
    paidAmount: 5000,
    paymentStatus: "PENDING",
    paymentMethod: "PAY_AT_HOTEL",
    status: "CONFIRMED",
    airportTransfer: false,
    extraBed: true,
    breakfast: true,
    specialRequests: "Quiet floor preferred for family pilgrim group.",
    promoCode: null,
    discountAmount: 0,
    roomTypeId: "room-executive-family-suite",
    roomType: INITIAL_ROOMS[3],
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
    totalAmount: 5280,
    paidAmount: 5280,
    paymentStatus: "PAID",
    paymentMethod: "NAGAD",
    status: "CONFIRMED",
    airportTransfer: false,
    extraBed: false,
    breakfast: true,
    specialRequests: null,
    promoCode: null,
    discountAmount: 0,
    roomTypeId: "room-super-deluxe-twin",
    roomType: INITIAL_ROOMS[2],
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
    subject: "Executive Suite booking for 4 nights",
    message: "Can you arrange early check-in around 9:00 AM on Friday for the Executive Family Suite?",
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
