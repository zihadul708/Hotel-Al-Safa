import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: code.toUpperCase() },
      include: {
        roomType: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking voucher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Failed to fetch booking by code:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking voucher" },
      { status: 500 }
    );
  }
}
