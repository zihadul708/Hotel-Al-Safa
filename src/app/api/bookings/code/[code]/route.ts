import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseBookingByCode } from "@/lib/supabase-db";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const cleanCode = code?.toUpperCase().trim();

    if (!cleanCode) {
      return NextResponse.json({ error: "Booking code required" }, { status: 400 });
    }

    // 1. Primary Cloud Backend: Supabase
    if (isSupabaseConfigured()) {
      try {
        const booking = await getSupabaseBookingByCode(cleanCode);
        if (booking) {
          return NextResponse.json(booking);
        }
      } catch (err) {
        console.warn("Supabase booking lookup by code failed, checking secondary fallbacks:", err);
      }
    }

    // 2. Secondary Local Backend: Prisma
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

    // 3. Fallback store lookup
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
