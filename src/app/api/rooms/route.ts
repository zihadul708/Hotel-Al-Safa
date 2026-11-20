import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getSupabaseRooms,
  updateSupabaseRoom,
  createSupabaseRoom,
  deleteSupabaseRoom,
} from "@/lib/supabase-db";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function GET() {
  // 1. Primary Cloud Backend: Supabase
  if (isSupabaseConfigured()) {
    try {
      const rooms = await getSupabaseRooms();
      if (rooms && rooms.length > 0) {
        return NextResponse.json(rooms);
      }
    } catch (err) {
      console.warn("Supabase room fetch failed, checking secondary fallbacks:", err);
    }
  }

  // 2. Secondary Local Backend: Prisma (SQLite)
  try {
    const rooms = await prisma.roomType.findMany({
      orderBy: {
        basePrice: "asc",
      },
    });

    if (rooms && rooms.length > 0) {
      const parsedRooms = rooms.map((r) => ({
        ...r,
        images: typeof r.images === "string" ? JSON.parse(r.images) : r.images,
        amenities: typeof r.amenities === "string" ? JSON.parse(r.amenities) : r.amenities,
      }));

      return NextResponse.json(parsedRooms);
    }
  } catch (error) {
    console.warn("Prisma unavailable, serving in-memory room catalog fallback:", error);
  }

  // 3. Resilient fallback: returns complete room data even if database is initializing
  return NextResponse.json(fallbackStore.getRooms());
}

export async function POST(req: Request) {
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
      availableUnits: Number(availableUnits) || 5,
    };

    // 1. Primary: Supabase
    if (isSupabaseConfigured()) {
      try {
        const created = await createSupabaseRoom(roomPayload);
        if (created) {
          return NextResponse.json(created, { status: 201 });
        }
      } catch (err) {
        console.warn("Supabase room creation failed, falling back to local:", err);
      }
    }

    // 2. Secondary: Prisma
    try {
      const created = await prisma.roomType.create({
        data: {
          slug: roomPayload.slug,
          name: roomPayload.name,
          category: roomPayload.category,
          isAc: roomPayload.isAc,
          basePrice: roomPayload.basePrice,
          capacity: roomPayload.capacity,
          bedType: roomPayload.bedType,
          sizeSqFt: roomPayload.sizeSqFt,
          description: roomPayload.description,
          images: JSON.stringify(roomPayload.images),
          amenities: JSON.stringify(roomPayload.amenities),
          featured: roomPayload.featured,
          availableUnits: roomPayload.availableUnits,
        },
      });

      return NextResponse.json({
        ...created,
        images: roomPayload.images,
        amenities: roomPayload.amenities,
      }, { status: 201 });
    } catch (dbErr) {
      console.warn("Prisma room create failed, saving to fallback store:", dbErr);
    }

    // 3. Fallback store
    const fallbackCreated = fallbackStore.addRoom(roomPayload);
    return NextResponse.json(fallbackCreated, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create room:", error);
    return NextResponse.json({ error: error.message || "Failed to create room" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    // 1. Primary Cloud Backend: Supabase
    if (isSupabaseConfigured()) {
      try {
        const updated = await updateSupabaseRoom(id, updates);
        if (updated) {
          return NextResponse.json(updated);
        }
      } catch (err) {
        console.warn("Supabase room update failed, falling back to local store:", err);
      }
    }

    // 2. Secondary Local Backend: Prisma
    try {
      const dataToUpdate: Record<string, any> = {};
      if (updates.name !== undefined) dataToUpdate.name = updates.name;
      if (updates.slug !== undefined) dataToUpdate.slug = updates.slug;
      if (updates.category !== undefined) dataToUpdate.category = updates.category;
      if (updates.isAc !== undefined) dataToUpdate.isAc = Boolean(updates.isAc);
      if (updates.basePrice !== undefined) dataToUpdate.basePrice = Number(updates.basePrice);
      if (updates.capacity !== undefined) dataToUpdate.capacity = Number(updates.capacity);
      if (updates.bedType !== undefined) dataToUpdate.bedType = updates.bedType;
      if (updates.sizeSqFt !== undefined) dataToUpdate.sizeSqFt = Number(updates.sizeSqFt);
      if (updates.description !== undefined) dataToUpdate.description = updates.description;
      if (updates.images !== undefined) dataToUpdate.images = JSON.stringify(updates.images);
      if (updates.amenities !== undefined) dataToUpdate.amenities = JSON.stringify(updates.amenities);
      if (updates.featured !== undefined) dataToUpdate.featured = Boolean(updates.featured);
      if (updates.availableUnits !== undefined) dataToUpdate.availableUnits = Number(updates.availableUnits);

      const updated = await prisma.roomType.update({
        where: { id },
        data: dataToUpdate,
      });

      return NextResponse.json({
        ...updated,
        images: typeof updated.images === "string" ? JSON.parse(updated.images) : updated.images,
        amenities: typeof updated.amenities === "string" ? JSON.parse(updated.amenities) : updated.amenities,
      });
    } catch (dbErr) {
      console.warn("Prisma update failed, updating fallback store:", dbErr);
      const fallbackUpdated = fallbackStore.updateRoom(id, updates);
      if (fallbackUpdated) {
        return NextResponse.json(fallbackUpdated);
      }
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to update room:", error);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    // 1. Primary: Supabase
    if (isSupabaseConfigured()) {
      try {
        const deleted = await deleteSupabaseRoom(id);
        if (deleted) {
          return NextResponse.json({ success: true });
        }
      } catch (err) {
        console.warn("Supabase room delete failed, trying fallback:", err);
      }
    }

    // 2. Secondary: Prisma
    try {
      await prisma.roomType.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } catch (dbErr) {
      console.warn("Prisma room delete failed, deleting from fallback store:", dbErr);
      const deleted = fallbackStore.deleteRoom(id);
      if (deleted) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Failed to delete room:", error);
    return NextResponse.json({ error: error.message || "Failed to delete room" }, { status: 500 });
  }
}
