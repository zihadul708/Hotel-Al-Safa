-- ==============================================================================
-- HOTEL AL SAFA - SUPABASE DATABASE SCHEMA & INITIAL SEED
-- ==============================================================================
-- Run this entire script in the Supabase Dashboard SQL Editor (SQL Editor -> New Query -> Run)
-- to automatically create all tables, indexes, RLS policies, and seed official data.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ROOM TYPES TABLE (10 Official Transit Hotel Categories)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.room_types (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    is_ac BOOLEAN NOT NULL DEFAULT true,
    base_price INTEGER NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    bed_type TEXT NOT NULL,
    size_sq_ft INTEGER NOT NULL,
    description TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT false,
    available_units INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. BOOKINGS TABLE (Guest Reservations & DMP Police Registration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    booking_code TEXT UNIQUE NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL DEFAULT 'guest@hotelalsafabd.com',
    guest_phone TEXT NOT NULL,
    guest_nid_passport TEXT,
    permanent_address TEXT,
    occupation TEXT,
    nationality TEXT DEFAULT 'Bangladeshi',
    father_or_husband_name TEXT,
    purpose_of_travel TEXT,
    allotted_room TEXT,
    check_in TIMESTAMPTZ NOT NULL,
    check_out TIMESTAMPTZ NOT NULL,
    nights INTEGER NOT NULL DEFAULT 1,
    adults INTEGER NOT NULL DEFAULT 2,
    children INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL DEFAULT 0,
    paid_amount INTEGER NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    payment_method TEXT NOT NULL DEFAULT 'PAY_AT_HOTEL',
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    special_requests TEXT,
    airport_transfer BOOLEAN NOT NULL DEFAULT false,
    extra_bed BOOLEAN NOT NULL DEFAULT false,
    breakfast BOOLEAN NOT NULL DEFAULT false,
    promo_code TEXT,
    discount_amount INTEGER NOT NULL DEFAULT 0,
    room_type_id TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. GUEST INQUIRIES & CONTACT MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. PROMO & VOUCHER CODES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    code TEXT UNIQUE NOT NULL,
    discount_pct INTEGER,
    discount_amt INTEGER,
    min_nights INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. REVIEWS & TESTIMONIALS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    room_name TEXT NOT NULL,
    date TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR HIGH-CONCURRENCY PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_room_types_slug ON public.room_types(slug);
CREATE INDEX IF NOT EXISTS idx_room_types_category ON public.room_types(category);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_code ON public.bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_room_type ON public.bookings(room_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Room Types: Anyone can read; service role or admin can write
DROP POLICY IF EXISTS "Public can view room types" ON public.room_types;
CREATE POLICY "Public can view room types" ON public.room_types
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can modify room types" ON public.room_types;
CREATE POLICY "Service role can modify room types" ON public.room_types
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Bookings: Anyone can create; anyone can read their own by voucher code; admin/service role can do all
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
CREATE POLICY "Public can insert bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read bookings" ON public.bookings;
CREATE POLICY "Public can read bookings" ON public.bookings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access on bookings" ON public.bookings;
CREATE POLICY "Service role full access on bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Inquiries: Anyone can insert; service role/admin can view/modify
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public/Admin can read inquiries" ON public.inquiries;
CREATE POLICY "Public/Admin can read inquiries" ON public.inquiries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access on inquiries" ON public.inquiries;
CREATE POLICY "Service role full access on inquiries" ON public.inquiries
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Promo Codes: Anyone can check active codes
DROP POLICY IF EXISTS "Public can view active promo codes" ON public.promo_codes;
CREATE POLICY "Public can view active promo codes" ON public.promo_codes
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access on promo codes" ON public.promo_codes;
CREATE POLICY "Service role full access on promo codes" ON public.promo_codes
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Reviews: Anyone can read reviews
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" ON public.reviews
    FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- INITIAL SEED DATA
-- ------------------------------------------------------------------------------

-- Seed Room Types
INSERT INTO public.room_types (id, slug, name, category, is_ac, base_price, capacity, bed_type, size_sq_ft, description, images, amenities, featured, available_units)
VALUES
(
    'room-couple-deluxe',
    'deluxe-couple',
    'Deluxe Couple Room (AC)',
    'Couple',
    true,
    2500,
    2,
    '1 King Bed',
    280,
    'Premium air-conditioned suite designed specifically for couples and transit travelers seeking comfort and tranquility before or after their flights. Features an ultra-comfortable orthopedic king-size bed, private ensuite bathroom with 24-hour instant geyser water heater, and double-glazed soundproof glass.',
    '["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["Split AC", "King Size Bed", "Ensuite Bathroom", "24/7 Hot Water", "High-Speed Wi-Fi", "LED TV with Satellite", "Work Desk & Ergonomic Chair", "Airport Shuttle Available"]'::jsonb,
    true,
    5
),
(
    'room-couple-non-ac',
    'standard-couple-non-ac',
    'Standard Couple Room (Non-AC)',
    'Couple',
    false,
    1800,
    2,
    '1 Queen Bed',
    240,
    'Cost-effective and well-ventilated double room equipped with modern high-speed ceiling fans, queen-size bed, pristine ensuite bathroom, and fiber-optic Wi-Fi. Ideal for budget-conscious guests and short transit stopovers.',
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["High-Speed Ceiling Fan", "Queen Size Bed", "Ensuite Bathroom", "24/7 Hot Water", "High-Speed Wi-Fi", "Telephone Intercom", "Room Service"]'::jsonb,
    false,
    6
),
(
    'room-twin-deluxe',
    'deluxe-twin',
    'Deluxe Twin Bed Room (AC)',
    'Twin',
    true,
    2800,
    2,
    '2 Single Beds',
    300,
    'Spacious air-conditioned room fitted with two separate luxury single spring mattresses. Tailored for corporate colleagues, friends traveling together, or transit passengers requiring separate beds.',
    '["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["Split AC", "2 Luxury Single Beds", "Ensuite Bathroom", "24/7 Hot Water", "High-Speed Wi-Fi", "LED TV", "Tea/Coffee Kettle", "Full Backup Generator"]'::jsonb,
    true,
    4
),
(
    'room-twin-economy',
    'economy-twin',
    'Economy Twin Room (Non-AC)',
    'Twin',
    false,
    2000,
    2,
    '2 Single Beds',
    260,
    'Budget-friendly twin accommodation featuring two single beds, excellent natural ventilation, wall-mounted high-velocity fans, attached private washroom, and daily housekeeping.',
    '["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["Ceiling Fan", "2 Single Beds", "Attached Washroom", "High-Speed Wi-Fi", "Intercom", "Bottled Water"]'::jsonb,
    false,
    5
),
(
    'room-family-deluxe',
    'deluxe-family',
    'Deluxe Family Suite (AC)',
    'Family',
    true,
    4000,
    4,
    '2 Queen Beds',
    420,
    'Our flagship family suite featuring two queen beds accommodating up to 4 guests comfortably. Designed with generous wardrobe space, seating lounge, large smart TV, and proximity to Ashkona Hajj Camp for Umrah families.',
    '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["Dual Inverter AC", "2 Queen Beds", "Spacious Family Bathroom", "24/7 Hot Water", "43-inch Smart TV", "Mini Fridge", "Sofa Seating Lounge", "Daily Housekeeping"]'::jsonb,
    true,
    3
),
(
    'room-family-economy',
    'economy-family',
    'Economy Family Room (Non-AC)',
    'Family',
    false,
    3000,
    4,
    '2 Double Beds',
    360,
    'Affordable family lodging offering two double beds, ceiling fans, private bathroom, and ample space for luggage and suitcases.',
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["Ceiling Fans", "2 Double Beds", "Attached Bathroom", "24/7 Hot Water", "High-Speed Wi-Fi", "Complimentary Water"]'::jsonb,
    false,
    4
),
(
    'room-super-deluxe-couple',
    'super-deluxe-couple',
    'Super Deluxe King Room (AC)',
    'Deluxe',
    true,
    3200,
    2,
    '1 Super King Bed',
    340,
    'Upgraded luxury room on high floors featuring custom ambient lighting, plush seating area, tea/coffee station, luxury toiletries, and soundproofing.',
    '["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["Whisper-Quiet AC", "Super King Bed", "Luxury Bathroom", "Tea/Coffee Station", "Luggage Rack", "High-Speed Wi-Fi", "Complimentary Airport Drop"]'::jsonb,
    true,
    4
),
(
    'room-single-transit',
    'transit-single',
    'Transit Solo Room (AC)',
    'Single',
    true,
    1600,
    1,
    '1 Single Bed',
    180,
    'Cozy, private room tailored for solo transit flyers with flight layovers at Dhaka Airport. Includes crisp bed linens, private hot shower, and wake-up call services.',
    '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["Split AC", "Single Bed", "Attached Bathroom", "Hot Shower", "Fast Wi-Fi", "Wake-up Call", "Early Check-in Available"]'::jsonb,
    false,
    4
),
(
    'room-single-economy',
    'economy-single',
    'Budget Solo Room (Non-AC)',
    'Single',
    false,
    1200,
    1,
    '1 Single Bed',
    160,
    'The most affordable private room in the Ashkona Airport district. Clean bed, ceiling fan, attached bath, and guaranteed generator electricity.',
    '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["Ceiling Fan", "Single Bed", "Attached Bath", "Wi-Fi", "Generator Backup"]'::jsonb,
    false,
    5
),
(
    'room-presidential-suite',
    'presidential-suite',
    'Presidential Executive Suite (AC)',
    'Suite',
    true,
    6500,
    4,
    '1 King Bed + 1 Queen Bed',
    600,
    'The pinnacle of transit luxury at Hotel Al Safa. Two interconnected chambers featuring a master bedroom with king bed, separate living hall with sofa set, dining area, two luxury washrooms, and panoramic city vistas.',
    '["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["2 Climate Control ACs", "Master King + Queen Bed", "2 Luxury Bathrooms", "Living & Dining Lounge", "Complimentary Airport Shuttle", "55-inch Smart TV", "VIP Welcome Drink"]'::jsonb,
    true,
    2
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    is_ac = EXCLUDED.is_ac,
    base_price = EXCLUDED.base_price,
    capacity = EXCLUDED.capacity,
    bed_type = EXCLUDED.bed_type,
    size_sq_ft = EXCLUDED.size_sq_ft,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    amenities = EXCLUDED.amenities,
    featured = EXCLUDED.featured,
    available_units = EXCLUDED.available_units;

-- Seed Promo Codes
INSERT INTO public.promo_codes (id, code, discount_pct, discount_amt, min_nights, is_active)
VALUES
('promo-1', 'ALSAFA10', 10, NULL, 1, true),
('promo-2', 'TRANSIT500', NULL, 500, 1, true),
('promo-3', 'WELCOME', NULL, 300, 1, true)
ON CONFLICT (code) DO NOTHING;

-- Seed Reviews
INSERT INTO public.reviews (id, name, location, rating, comment, room_name, date)
VALUES
(
    'review-1',
    'Capt. Farhan Chowdhury',
    'Dhaka Airport Transit',
    5,
    'Super convenient location right by the airport at Mili Super Tower-2! Punctual airport assistance, room was clean with split AC, and the stay was very smooth.',
    'Deluxe Couple Room (AC)',
    'October 2026'
),
(
    'review-2',
    'Haji Mohammad Yunus',
    'Chittagong',
    5,
    'We stayed with family before our Umrah journey. Close to Ashkona Hajj Camp and the family rooms are large and clean.',
    'Deluxe Family Suite (AC)',
    'September 2026'
),
(
    'review-3',
    'Sabrina Mostafa',
    'Sylhet',
    5,
    'Very smooth booking directly through the website with bKash. Hot shower, high-speed Wi-Fi, and 24h desk support.',
    'Deluxe Twin Bed Room (AC)',
    'November 2026'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Inquiries
INSERT INTO public.inquiries (id, name, email, phone, subject, message, status)
VALUES
(
    'inq-1',
    'Kamal Hossain',
    'kamal.hossain@gmail.com',
    '+880 1715-998877',
    'Late Night Airport Shuttle (2:30 AM arrival)',
    'We are arriving on flight EK-584 at 2:30 AM with 3 large suitcases. Do you offer shuttle pickup at that time?',
    'NEW'
),
(
    'inq-2',
    'Farhana Yasmin',
    'farhana.y@corporate.bd',
    '+880 1819-445566',
    'Deluxe Family Suite booking for 4 nights',
    'Can you arrange early check-in around 9:00 AM on Friday for the Deluxe Family Suite?',
    'READ'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Bookings
INSERT INTO public.bookings (
    id, booking_code, guest_name, guest_email, guest_phone, guest_nid_passport,
    check_in, check_out, nights, adults, children, total_amount, paid_amount,
    payment_status, payment_method, status, airport_transfer, breakfast,
    special_requests, room_type_id
)
VALUES
(
    'bkg-1',
    'ALSAFA-84291',
    'Tanvir Ahmed',
    'tanvir.ahmed@example.com',
    '+880 1711-234567',
    '1994827162910',
    NOW(),
    NOW() + INTERVAL '1 day',
    1, 2, 0, 2500, 2500,
    'PAID', 'BKASH', 'CHECKED_IN', true, true,
    'Arriving on flight BG-042 at 6:30 PM. Needs airport pickup.',
    'room-couple-deluxe'
),
(
    'bkg-2',
    'ALSAFA-91024',
    'Dr. Rafiqul Islam',
    'rafiqul.islam@hospital.edu.bd',
    '+880 1819-876543',
    '5592817290123',
    NOW(),
    NOW() + INTERVAL '2 days',
    2, 4, 1, 8000, 8000,
    'PAID', 'BANK_TRANSFER', 'CONFIRMED', false, true,
    'Quiet floor preferred for family pilgrim group.',
    'room-family-deluxe'
),
(
    'bkg-3',
    'ALSAFA-63821',
    'Mahbubur Rahman',
    'mahbub.corp@dhakatech.com',
    '+880 1912-349812',
    '8829104829102',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '2 days',
    1, 2, 0, 2000, 2000,
    'PAID', 'NAGAD', 'CONFIRMED', false, true,
    'Transit stay before international flight.',
    'room-twin-economy'
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ADMIN USERS & HERO SLIDES TABLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'ADMIN',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY,
    image TEXT NOT NULL,
    tag TEXT NOT NULL,
    title TEXT NOT NULL,
    "order" INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active hero slides" ON public.hero_slides;
CREATE POLICY "Public can view active hero slides" ON public.hero_slides
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access on hero slides" ON public.hero_slides;
CREATE POLICY "Service role full access on hero slides" ON public.hero_slides
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service role full access on admin users" ON public.admin_users;
CREATE POLICY "Service role full access on admin users" ON public.admin_users
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- SCHEMA & TABLE PERMISSIONS (Required for PostgREST / service_role & anon)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT SELECT ON public.room_types, public.promo_codes, public.reviews, public.hero_slides TO anon, authenticated;
GRANT INSERT, SELECT ON public.bookings, public.inquiries TO anon, authenticated;
