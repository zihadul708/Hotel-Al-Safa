import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackStore, FallbackRoomType } from "@/lib/mock-data";

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

    if (bookings && bookings.length > 0) {
      return NextResponse.json(bookings);
    }
  } catch (error) {
    console.warn("Prisma unavailable, serving fallback bookings:", error);
  }

  return NextResponse.json(fallbackStore.getBookings());
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
      promoCode,
      discountAmount,
    } = body;

    if (!roomTypeId || !guestName || !guestPhone || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    const parsedCheckIn = new Date(checkIn);
    const parsedCheckOut = new Date(checkOut);
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `ALSAFA-${randomDigits}`;

    // Attempt creation with Prisma
    try {
      const roomType = await prisma.roomType.findUnique({
        where: { id: roomTypeId },
      });

      if (roomType) {
        // Count overlapping active bookings
        const overlappingBookings = await prisma.booking.count({
          where: {
            roomTypeId,
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
            AND: [
              { checkIn: { lt: parsedCheckOut } },
              { checkOut: { gt: parsedCheckIn } },
            ],
          },
        });

        if (overlappingBookings >= roomType.availableUnits) {
          return NextResponse.json(
            {
              error: `Sorry, ${roomType.name} is fully booked for these dates (${overlappingBookings}/${roomType.availableUnits} units occupied). Please select different dates or another suite.`,
            },
            { status: 409 }
          );
        }

        const newBooking = await prisma.booking.create({
          data: {
            bookingCode,
            guestName,
            guestEmail: guestEmail || "guest@hotelalsafabd.com",
            guestPhone,
            guestNidPassport: guestNidPassport || null,
            checkIn: parsedCheckIn,
            checkOut: parsedCheckOut,
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
            promoCode: promoCode || null,
            discountAmount: Number(discountAmount) || 0,
            roomTypeId,
          },
          include: {
            roomType: true,
          },
        });

        return NextResponse.json(newBooking, { status: 201 });
      }
    } catch (dbErr) {
      console.warn("Prisma booking insert failed, using fallback in-memory store:", dbErr);
    }

    // Fallback store handling for serverless deployment
    const fallbackRoom: FallbackRoomType | undefined = fallbackStore.getRoomByIdOrSlug(roomTypeId);
    const room = fallbackRoom || fallbackStore.getRooms()[0];

    const fallbackBooking = fallbackStore.addBooking({
      bookingCode,
      guestName,
      guestEmail: guestEmail || "guest@hotelalsafabd.com",
      guestPhone,
      guestNidPassport: guestNidPassport || null,
      checkIn: parsedCheckIn.toISOString(),
      checkOut: parsedCheckOut.toISOString(),
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
      promoCode: promoCode || null,
      discountAmount: Number(discountAmount) || 0,
      roomTypeId: room.id,
      roomType: room,
    });

    return NextResponse.json(fallbackBooking, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
