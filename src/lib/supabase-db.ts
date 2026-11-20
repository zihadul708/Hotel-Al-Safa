import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { INITIAL_ROOMS } from "./mock-data";

export interface SupabaseRoomType {
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

export interface SupabaseBooking {
  id: string;
  bookingCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestNidPassport: string | null;
  permanentAddress?: string | null;
  occupation?: string | null;
  nationality?: string | null;
  fatherOrHusbandName?: string | null;
  purposeOfTravel?: string | null;
  allottedRoom?: string | null;
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
  roomType?: SupabaseRoomType;
  createdAt: string;
  updatedAt: string;
}

export interface SupabaseInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface SupabasePromoCode {
  id: string;
  code: string;
  discountPct: number | null;
  discountAmt: number | null;
  minNights: number;
  isActive: boolean;
}

/**
 * Normalizes raw Supabase room row to camelCase
 */
export function formatRoomType(row: any): SupabaseRoomType {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    isAc: row.is_ac ?? row.isAc ?? true,
    basePrice: Number(row.base_price ?? row.basePrice ?? 0),
    capacity: Number(row.capacity ?? 2),
    bedType: row.bed_type ?? row.bedType ?? "1 Bed",
    sizeSqFt: Number(row.size_sq_ft ?? row.sizeSqFt ?? 250),
    description: row.description || "",
    images: typeof row.images === "string" ? JSON.parse(row.images) : (row.images || []),
    amenities: typeof row.amenities === "string" ? JSON.parse(row.amenities) : (row.amenities || []),
    featured: Boolean(row.featured),
    availableUnits: Number(row.available_units ?? row.availableUnits ?? 5),
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  };
}

/**
 * Normalizes raw Supabase booking row to camelCase
 */
export function formatBooking(row: any): SupabaseBooking {
  const roomData = row.room_types || row.room_type || row.roomType;
  return {
    id: row.id,
    bookingCode: row.booking_code ?? row.bookingCode,
    guestName: row.guest_name ?? row.guestName,
    guestEmail: row.guest_email ?? row.guestEmail ?? "guest@hotelalsafabd.com",
    guestPhone: row.guest_phone ?? row.guestPhone,
    guestNidPassport: row.guest_nid_passport ?? row.guestNidPassport ?? null,
    permanentAddress: row.permanent_address ?? row.permanentAddress ?? null,
    occupation: row.occupation ?? null,
    nationality: row.nationality ?? "Bangladeshi",
    fatherOrHusbandName: row.father_or_husband_name ?? row.fatherOrHusbandName ?? null,
    purposeOfTravel: row.purpose_of_travel ?? row.purposeOfTravel ?? null,
    allottedRoom: row.allotted_room ?? row.allottedRoom ?? null,
    checkIn: new Date(row.check_in ?? row.checkIn).toISOString(),
    checkOut: new Date(row.check_out ?? row.checkOut).toISOString(),
    nights: Number(row.nights ?? 1),
    adults: Number(row.adults ?? 2),
    children: Number(row.children ?? 0),
    totalAmount: Number(row.total_amount ?? row.totalAmount ?? 0),
    paidAmount: Number(row.paid_amount ?? row.paidAmount ?? 0),
    paymentStatus: row.payment_status ?? row.paymentStatus ?? "PENDING",
    paymentMethod: row.payment_method ?? row.paymentMethod ?? "PAY_AT_HOTEL",
    status: row.status ?? "CONFIRMED",
    specialRequests: row.special_requests ?? row.specialRequests ?? null,
    airportTransfer: Boolean(row.airport_transfer ?? row.airportTransfer),
    extraBed: Boolean(row.extra_bed ?? row.extraBed),
    breakfast: Boolean(row.breakfast),
    promoCode: row.promo_code ?? row.promoCode ?? null,
    discountAmount: Number(row.discount_amount ?? row.discountAmount ?? 0),
    roomTypeId: row.room_type_id ?? row.roomTypeId,
    roomType: roomData ? formatRoomType(roomData) : undefined,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

/**
 * Normalizes raw Supabase inquiry row to camelCase
 */
export function formatInquiry(row: any): SupabaseInquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject || "General Inquiry",
    message: row.message,
    status: row.status || "NEW",
    createdAt: row.created_at || row.createdAt,
  };
}

/**
 * Normalizes raw Supabase promo row to camelCase
 */
export function formatPromoCode(row: any): SupabasePromoCode {
  return {
    id: row.id,
    code: row.code,
    discountPct: row.discount_pct !== null ? Number(row.discount_pct) : null,
    discountAmt: row.discount_amt !== null ? Number(row.discount_amt) : null,
    minNights: Number(row.min_nights ?? 1),
    isActive: Boolean(row.is_active ?? true),
  };
}

// ------------------------------------------------------------------------------
// ROOMS SERVICE
// ------------------------------------------------------------------------------

export async function getSupabaseRooms(): Promise<SupabaseRoomType[]> {
  const { data, error } = await supabaseAdmin
    .from("room_types")
    .select("*")
    .order("base_price", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch room types from Supabase: ${error.message}`);
  }

  return (data || []).map(formatRoomType);
}

export async function getSupabaseRoomByIdOrSlug(idOrSlug: string): Promise<SupabaseRoomType | null> {
  const { data, error } = await supabaseAdmin
    .from("room_types")
    .select("*")
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .maybeSingle();

  if (error || !data) return null;
  return formatRoomType(data);
}

export async function createSupabaseRoom(
  room: Partial<SupabaseRoomType>
): Promise<SupabaseRoomType> {
  const generatedSlug = (room.slug || room.name || "room")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const id = room.id || `room-${generatedSlug}-${Date.now()}`;

  const record = {
    id,
    slug: generatedSlug,
    name: room.name || "New Suite",
    category: room.category || "Deluxe",
    is_ac: room.isAc ?? true,
    base_price: Number(room.basePrice ?? 2500),
    capacity: Number(room.capacity ?? 2),
    bed_type: room.bedType || "1 King Bed",
    size_sq_ft: Number(room.sizeSqFt ?? 280),
    description: room.description || "Luxury transit hotel room at Hotel Al Safa.",
    images: Array.isArray(room.images) && room.images.length > 0
      ? room.images
      : ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"],
    amenities: Array.isArray(room.amenities) && room.amenities.length > 0
      ? room.amenities
      : ["Split AC", "King Size Bed", "Ensuite Bathroom", "24/7 Hot Water", "High-Speed Wi-Fi"],
    featured: Boolean(room.featured),
    available_units: Number(room.availableUnits ?? 5),
  };

  const { data, error } = await supabaseAdmin
    .from("room_types")
    .insert(record)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create room in Supabase: ${error.message}`);
  }

  return formatRoomType(data);
}

export async function updateSupabaseRoom(
  id: string,
  updates: Partial<SupabaseRoomType> & { basePrice?: number; availableUnits?: number }
): Promise<SupabaseRoomType | null> {
  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.isAc !== undefined) payload.is_ac = Boolean(updates.isAc);
  if (updates.basePrice !== undefined) payload.base_price = Number(updates.basePrice);
  if (updates.capacity !== undefined) payload.capacity = Number(updates.capacity);
  if (updates.bedType !== undefined) payload.bed_type = updates.bedType;
  if (updates.sizeSqFt !== undefined) payload.size_sq_ft = Number(updates.sizeSqFt);
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.images !== undefined) payload.images = updates.images;
  if (updates.amenities !== undefined) payload.amenities = updates.amenities;
  if (updates.featured !== undefined) payload.featured = Boolean(updates.featured);
  if (updates.availableUnits !== undefined) payload.available_units = Number(updates.availableUnits);

  const { data, error } = await supabaseAdmin
    .from("room_types")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update room in Supabase: ${error.message}`);
  }

  return formatRoomType(data);
}

export async function deleteSupabaseRoom(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("room_types")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete room in Supabase: ${error.message}`);
  }

  return true;
}

// ------------------------------------------------------------------------------
// BOOKINGS SERVICE
// ------------------------------------------------------------------------------

export async function getSupabaseBookings(): Promise<SupabaseBooking[]> {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*, room_types(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch bookings from Supabase: ${error.message}`);
  }

  return (data || []).map(formatBooking);
}

export async function getSupabaseBookingByCode(code: string): Promise<SupabaseBooking | null> {
  const cleanCode = code.trim().toUpperCase();
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*, room_types(*)")
    .ilike("booking_code", cleanCode)
    .maybeSingle();

  if (error || !data) return null;
  return formatBooking(data);
}

export async function getSupabaseBookingById(id: string): Promise<SupabaseBooking | null> {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*, room_types(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return formatBooking(data);
}

export async function checkSupabaseRoomAvailability(
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date
): Promise<{ available: boolean; room: SupabaseRoomType | null; occupied: number; totalUnits: number }> {
  // Get room specs
  const room = await getSupabaseRoomByIdOrSlug(roomTypeId);
  if (!room) {
    return { available: false, room: null, occupied: 0, totalUnits: 0 };
  }

  // Find overlapping active bookings
  // A booking overlaps if: check_in < checkOut AND check_out > checkIn
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("room_type_id", room.id)
    .in("status", ["CONFIRMED", "CHECKED_IN"])
    .lt("check_in", checkOut.toISOString())
    .gt("check_out", checkIn.toISOString());

  if (error) {
    console.warn("Supabase availability check error:", error);
    return { available: true, room, occupied: 0, totalUnits: room.availableUnits };
  }

  const occupied = data?.length || 0;
  const available = occupied < room.availableUnits;

  return {
    available,
    room,
    occupied,
    totalUnits: room.availableUnits,
  };
}

export async function createSupabaseBooking(payload: any): Promise<SupabaseBooking> {
  const checkInDate = new Date(payload.checkIn);
  const checkOutDate = new Date(payload.checkOut);

  // If roomTypeId is slug, resolve to id
  let targetRoomId = payload.roomTypeId;
  const room = await getSupabaseRoomByIdOrSlug(payload.roomTypeId);
  if (room) {
    targetRoomId = room.id;
  }

  const record = {
    booking_code: payload.bookingCode,
    guest_name: payload.guestName,
    guest_email: payload.guestEmail || "guest@hotelalsafabd.com",
    guest_phone: payload.guestPhone,
    guest_nid_passport: payload.guestNidPassport || null,
    permanent_address: payload.permanentAddress || null,
    occupation: payload.occupation || null,
    nationality: payload.nationality || "Bangladeshi",
    father_or_husband_name: payload.fatherOrHusbandName || null,
    purpose_of_travel: payload.purposeOfTravel || null,
    allotted_room: payload.allottedRoom || null,
    check_in: checkInDate.toISOString(),
    check_out: checkOutDate.toISOString(),
    nights: Number(payload.nights) || 1,
    adults: Number(payload.adults) || 2,
    children: Number(payload.children) || 0,
    total_amount: Number(payload.totalAmount) || 0,
    paid_amount: Number(payload.paidAmount) || 0,
    payment_status: payload.paymentStatus || (payload.paymentMethod === "PAY_AT_HOTEL" ? "PENDING" : "PAID"),
    payment_method: payload.paymentMethod || "PAY_AT_HOTEL",
    status: payload.status || "CONFIRMED",
    special_requests: payload.specialRequests || null,
    airport_transfer: Boolean(payload.airportTransfer),
    extra_bed: Boolean(payload.extraBed),
    breakfast: Boolean(payload.breakfast),
    promo_code: payload.promoCode || null,
    discount_amount: Number(payload.discountAmount) || 0,
    room_type_id: targetRoomId,
  };

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert(record)
    .select("*, room_types(*)")
    .single();

  if (error) {
    throw new Error(`Failed to insert booking in Supabase: ${error.message}`);
  }

  return formatBooking(data);
}

export async function updateSupabaseBooking(id: string, updates: any): Promise<SupabaseBooking | null> {
  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.paymentStatus !== undefined) payload.payment_status = updates.paymentStatus;
  if (updates.paidAmount !== undefined) payload.paid_amount = Number(updates.paidAmount);
  if (updates.allottedRoom !== undefined) payload.allotted_room = updates.allottedRoom;
  if (updates.guestNidPassport !== undefined) payload.guest_nid_passport = updates.guestNidPassport;
  if (updates.permanentAddress !== undefined) payload.permanent_address = updates.permanentAddress;
  if (updates.occupation !== undefined) payload.occupation = updates.occupation;
  if (updates.nationality !== undefined) payload.nationality = updates.nationality;
  if (updates.fatherOrHusbandName !== undefined) payload.father_or_husband_name = updates.fatherOrHusbandName;
  if (updates.purposeOfTravel !== undefined) payload.purpose_of_travel = updates.purposeOfTravel;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update(payload)
    .eq("id", id)
    .select("*, room_types(*)")
    .single();

  if (error) {
    throw new Error(`Failed to update booking in Supabase: ${error.message}`);
  }

  return formatBooking(data);
}

export async function deleteSupabaseBooking(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete booking in Supabase: ${error.message}`);
  }

  return true;
}

// ------------------------------------------------------------------------------
// INQUIRIES SERVICE
// ------------------------------------------------------------------------------

export async function getSupabaseInquiries(): Promise<SupabaseInquiry[]> {
  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch inquiries from Supabase: ${error.message}`);
  }

  return (data || []).map(formatInquiry);
}

export async function createSupabaseInquiry(data: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}): Promise<SupabaseInquiry> {
  const record = {
    name: data.name,
    email: data.email || "guest@hotelalsafabd.com",
    phone: data.phone,
    subject: data.subject || "General Inquiry",
    message: data.message,
    status: "NEW",
  };

  const { data: created, error } = await supabaseAdmin
    .from("inquiries")
    .insert(record)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create inquiry in Supabase: ${error.message}`);
  }

  return formatInquiry(created);
}

export async function updateSupabaseInquiryStatus(id: string, status: string): Promise<SupabaseInquiry | null> {
  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update inquiry in Supabase: ${error.message}`);
  }

  return formatInquiry(data);
}

export async function deleteSupabaseInquiry(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("inquiries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete inquiry in Supabase: ${error.message}`);
  }

  return true;
}

// ------------------------------------------------------------------------------
// PROMO CODES SERVICE
// ------------------------------------------------------------------------------

export async function getSupabasePromoCode(code: string): Promise<SupabasePromoCode | null> {
  const cleanCode = code.trim().toUpperCase();
  const { data, error } = await supabaseAdmin
    .from("promo_codes")
    .select("*")
    .ilike("code", cleanCode)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return formatPromoCode(data);
}

// ------------------------------------------------------------------------------
// DIAGNOSTICS & SEEDING SERVICE
// ------------------------------------------------------------------------------

export async function checkSupabaseHealth(): Promise<{
  configured: boolean;
  connected: boolean;
  error?: string;
  counts: {
    rooms: number;
    bookings: number;
    inquiries: number;
    promoCodes: number;
  };
}> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      error: "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and key) are not set.",
      counts: { rooms: 0, bookings: 0, inquiries: 0, promoCodes: 0 },
    };
  }

  try {
    const [roomsCheck, roomsCount, bookingsCount, inquiriesCount, promoCount] = await Promise.all([
      supabaseAdmin.from("room_types").select("id").limit(1),
      supabaseAdmin.from("room_types").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("bookings").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("inquiries").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("promo_codes").select("*", { count: "exact", head: true }),
    ]);

    if (roomsCheck.error) {
      return {
        configured: true,
        connected: false,
        error: `Database connected, but tables are missing: ${roomsCheck.error.message}. Please execute supabase/schema.sql in Supabase SQL Editor.`,
        counts: { rooms: 0, bookings: 0, inquiries: 0, promoCodes: 0 },
      };
    }

    return {
      configured: true,
      connected: true,
      counts: {
        rooms: roomsCount.count ?? 0,
        bookings: bookingsCount.count ?? 0,
        inquiries: inquiriesCount.count ?? 0,
        promoCodes: promoCount.count ?? 0,
      },
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      error: err.message || "Failed to connect to Supabase",
      counts: { rooms: 0, bookings: 0, inquiries: 0, promoCodes: 0 },
    };
  }
}

/**
 * Programmatically seeds Supabase database tables with official Hotel Al Safa data.
 */
export async function seedSupabaseDatabase(): Promise<{
  success: boolean;
  message: string;
  seededRooms: number;
  seededPromos: number;
}> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  // 1. Seed Rooms
  const roomRecords = INITIAL_ROOMS.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    is_ac: r.isAc,
    base_price: r.basePrice,
    capacity: r.capacity,
    bed_type: r.bedType,
    size_sq_ft: r.sizeSqFt,
    description: r.description,
    images: r.images,
    amenities: r.amenities,
    featured: r.featured,
    available_units: r.availableUnits,
  }));

  const { error: roomError } = await supabaseAdmin
    .from("room_types")
    .upsert(roomRecords, { onConflict: "id" });

  if (roomError) {
    throw new Error(`Failed to seed room_types in Supabase: ${roomError.message}`);
  }

  // 2. Seed Promo Codes
  const promoRecords = [
    { id: "promo-1", code: "ALSAFA10", discount_pct: 10, discount_amt: null, min_nights: 1, is_active: true },
    { id: "promo-2", code: "TRANSIT500", discount_pct: null, discount_amt: 500, min_nights: 1, is_active: true },
    { id: "promo-3", code: "WELCOME", discount_pct: null, discount_amt: 300, min_nights: 1, is_active: true },
  ];

  const { error: promoError } = await supabaseAdmin
    .from("promo_codes")
    .upsert(promoRecords, { onConflict: "code" });

  if (promoError) {
    console.warn("Promo code seed notice:", promoError.message);
  }

  return {
    success: true,
    message: "Successfully seeded Hotel Al Safa room types and promo codes into Supabase!",
    seededRooms: roomRecords.length,
    seededPromos: promoRecords.length,
  };
}
