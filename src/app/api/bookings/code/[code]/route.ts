import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const cleanCode = code?.toUpperCase().trim();

    try {
      const booking = await prisma.booking.findUnique({
        where: { bookingCode: cleanCode },
        include: {
          roomType: true,
        },
      });

      if (booking) {
        return NextResponse.json(booking);
      }
    } catch (dbErr) {
      console.warn("Prisma booking lookup by code failed, checking fallback store:", dbErr);
    }

    const fallbackBooking = fallbackStore.getBookingByCode(cleanCode);
    if (fallbackBooking) {
      return NextResponse.json(fallbackBooking);
    }

    return NextResponse.json(
      { error: "Booking voucher not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Failed to fetch booking by code:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking voucher" },
      { status: 500 }
    );
  }
}
