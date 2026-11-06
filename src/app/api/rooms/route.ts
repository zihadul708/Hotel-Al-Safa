import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.roomType.findMany({
      orderBy: {
        basePrice: "asc",
      },
    });

    const parsedRooms = rooms.map((r) => ({
      ...r,
      images: JSON.parse(r.images),
      amenities: JSON.parse(r.amenities),
    }));

    return NextResponse.json(parsedRooms);
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, basePrice, availableUnits } = body;

    const updated = await prisma.roomType.update({
      where: { id },
      data: {
        ...(basePrice !== undefined && { basePrice: Number(basePrice) }),
        ...(availableUnits !== undefined && { availableUnits: Number(availableUnits) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update room:", error);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}
