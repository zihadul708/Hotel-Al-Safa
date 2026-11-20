import { createClient } from "@supabase/supabase-js";
import { INITIAL_ROOMS } from "../src/lib/mock-data";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing Supabase environment variables!");
  console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function runSeed() {
  console.log("🚀 Seeding Hotel Al Safa database to Supabase...");
  console.log(`Target Supabase URL: ${supabaseUrl}`);

  // 1. Seed Rooms
  console.log(`\n📦 Upserting ${INITIAL_ROOMS.length} Room Types...`);
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

  const { error: roomErr } = await supabase
    .from("room_types")
    .upsert(roomRecords, { onConflict: "id" });

  if (roomErr) {
    console.error("❌ Failed to upsert rooms:", roomErr.message);
  } else {
    console.log("✅ Room types successfully synced!");
  }

  // 2. Seed Promo Codes
  console.log("\n🎟️ Upserting Promo Codes...");
  const promoRecords = [
    { id: "promo-1", code: "ALSAFA10", discount_pct: 10, discount_amt: null, min_nights: 1, is_active: true },
    { id: "promo-2", code: "TRANSIT500", discount_pct: null, discount_amt: 500, min_nights: 1, is_active: true },
    { id: "promo-3", code: "WELCOME", discount_pct: null, discount_amt: 300, min_nights: 1, is_active: true },
  ];

  const { error: promoErr } = await supabase
    .from("promo_codes")
    .upsert(promoRecords, { onConflict: "code" });

  if (promoErr) {
    console.warn("⚠️ Promo codes notice:", promoErr.message);
  } else {
    console.log("✅ Promo codes successfully synced!");
  }

  // 3. Seed Reviews
  console.log("\n⭐ Upserting Sample Guest Reviews...");
  const reviewRecords = [
    {
      id: "review-1",
      name: "Capt. Farhan Chowdhury",
      location: "Dhaka Airport Transit",
      rating: 5,
      comment: "Super convenient location right by the airport at Mili Super Tower-2! Punctual airport assistance, room was clean with split AC, and the stay was very smooth.",
      room_name: "Deluxe Couple Room (AC)",
      date: "October 2026",
    },
    {
      id: "review-2",
      name: "Haji Mohammad Yunus",
      location: "Chittagong",
      rating: 5,
      comment: "We stayed with family before our Umrah journey. Close to Ashkona Hajj Camp and the family rooms are large and clean.",
      room_name: "Deluxe Family Suite (AC)",
      date: "September 2026",
    },
    {
      id: "review-3",
      name: "Sabrina Mostafa",
      location: "Sylhet",
      rating: 5,
      comment: "Very smooth booking directly through the website with bKash. Hot shower, high-speed Wi-Fi, and 24h desk support.",
      room_name: "Deluxe Twin Bed Room (AC)",
      date: "November 2026",
    },
  ];

  const { error: reviewErr } = await supabase
    .from("reviews")
    .upsert(reviewRecords, { onConflict: "id" });

  if (reviewErr) {
    console.warn("⚠️ Reviews notice:", reviewErr.message);
  } else {
    console.log("✅ Reviews successfully synced!");
  }

  console.log("\n🎉 Supabase database seeding complete!");
}

runSeed().catch((e) => {
  console.error("Fatal seed error:", e);
  process.exit(1);
});
