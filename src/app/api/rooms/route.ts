import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getSupabaseRooms,
  updateSupabaseRoom,
  createSupabaseRoom,
  deleteSupabaseRoom,
} from "@/lib/supabase-db";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    {
      error:
        "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    },
    { status: 503, headers: NO_STORE_HEADERS }
  );
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return supabaseNotConfiguredResponse();
  }

  try {
    const rooms = await getSupabaseRooms();
    return NextResponse.json(rooms, { headers: NO_STORE_HEADERS });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch rooms from Supabase";
    console.error("Supabase room fetch failed:", err);
    return NextResponse.json({ error: message }, { status: 503, headers: NO_STORE_HEADERS });
  }
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return supabaseNotConfiguredResponse();
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      category,
      isAc = true,
      basePrice = 2500,
      capacity = 2,
      bedType = "1 King Bed",
      sizeSqFt = 280,
      description = "",
      images = [],
      amenities = [],
      featured = false,
      availableUnits = 5,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Room name is required." }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const roomPayload = {
      name,
      slug: cleanSlug,
      category: category || "Deluxe",
      isAc: Boolean(isAc),
      basePrice: Number(basePrice) || 2500,
      capacity: Number(capacity) || 2,
      bedType: bedType || "1 King Bed",
      sizeSqFt: Number(sizeSqFt) || 280,
      description: description || `Luxury ${name} at Hotel Al Safa Dhaka.`,
      images: Array.isArray(images) && images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
      ],
      amenities: Array.isArray(amenities) && amenities.length > 0 ? amenities : [
        "Split AC", "King Size Bed", "Ensuite Bathroom", "24/7 Hot Water", "High-Speed Wi-Fi"
      ],
      featured: Boolean(featured),
      availableUnits:
        availableUnits !== undefined && availableUnits !== null && availableUnits !== ""
          ? Number(availableUnits)
          : 5,
    };

    const created = await createSupabaseRoom(roomPayload);
    return NextResponse.json(created, { status: 201, headers: NO_STORE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create room";
    console.error("Failed to create room in Supabase:", error);
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function PATCH(req: Request) {
  if (!isSupabaseConfigured()) {
    return supabaseNotConfiguredResponse();
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    const updated = await updateSupabaseRoom(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { headers: NO_STORE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update room";
    console.error("Failed to update room in Supabase:", error);
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function DELETE(req: Request) {
  if (!isSupabaseConfigured()) {
    return supabaseNotConfiguredResponse();
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    await deleteSupabaseRoom(id);
    return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete room";
    console.error("Failed to delete room in Supabase:", error);
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
