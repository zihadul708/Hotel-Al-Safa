import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function GET() {
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
    console.warn("Prisma unavailable on serverless, serving fallback room catalog:", error);
  }

  // Resilient fallback: returns complete room data even if SQLite/Prisma is unreachable
  return NextResponse.json(fallbackStore.getRooms());
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, basePrice, availableUnits } = body;

    try {
      const updated = await prisma.roomType.update({
        where: { id },
        data: {
          ...(basePrice !== undefined && { basePrice: Number(basePrice) }),
          ...(availableUnits !== undefined && { availableUnits: Number(availableUnits) }),
        },
      });

      return NextResponse.json(updated);
    } catch (dbErr) {
      console.warn("Prisma update failed, updating fallback store:", dbErr);
      const fallbackUpdated = fallbackStore.updateRoom(id, {
        ...(basePrice !== undefined && { basePrice: Number(basePrice) }),
        ...(availableUnits !== undefined && { availableUnits: Number(availableUnits) }),
      });

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
