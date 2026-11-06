import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        roomType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      roomTypeId,
      guestName,
      guestEmail,
      guestPhone,
      guestNidPassport,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      totalAmount,
      paidAmount,
      paymentMethod,
      paymentStatus,
      specialRequests,
      airportTransfer,
      extraBed,
      breakfast,
    } = body;

    if (!roomTypeId || !guestName || !guestPhone || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // Generate readable random booking code
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `ALSAFA-${randomDigits}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingCode,
        guestName,
        guestEmail: guestEmail || "guest@hotelalsafabd.com",
        guestPhone,
        guestNidPassport: guestNidPassport || null,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nights: Number(nights) || 1,
        adults: Number(adults) || 2,
        children: Number(children) || 0,
        totalAmount: Number(totalAmount) || 0,
        paidAmount: Number(paidAmount) || 0,
        paymentStatus: paymentStatus || (paymentMethod === "PAY_AT_HOTEL" ? "PENDING" : "PAID"),
        paymentMethod: paymentMethod || "PAY_AT_HOTEL",
        status: "CONFIRMED",
        specialRequests: specialRequests || null,
        airportTransfer: Boolean(airportTransfer),
        extraBed: Boolean(extraBed),
        breakfast: Boolean(breakfast),
        roomTypeId,
      },
      include: {
        roomType: true,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
