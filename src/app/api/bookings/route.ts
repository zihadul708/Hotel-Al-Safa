import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getSupabaseBookings,
  createSupabaseBooking,
  checkSupabaseRoomAvailability,
} from "@/lib/supabase-db";
import { prisma } from "@/lib/prisma";
import { fallbackStore, FallbackRoomType } from "@/lib/mock-data";

export async function GET() {
  // 1. Primary Cloud Backend: Supabase
  if (isSupabaseConfigured()) {
    try {
      const bookings = await getSupabaseBookings();
      if (bookings && bookings.length > 0) {
        return NextResponse.json(bookings);
      }
    } catch (err) {
      console.warn("Supabase booking fetch failed, falling back to secondary:", err);
    }
  }

  // 2. Secondary Local Backend: Prisma
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
    console.warn("Prisma unavailable, serving fallback bookings:", error);
  }

  // 3. In-memory fallback
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
      permanentAddress,
      occupation,
      nationality,
      fatherOrHusbandName,
      purposeOfTravel,
      allottedRoom,
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
        { error: "Required fields missing (room, name, phone, check-in, check-out)" },
        { status: 400 }
      );
    }

    const parsedCheckIn = new Date(checkIn);
    const parsedCheckOut = new Date(checkOut);
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `ALSAFA-${randomDigits}`;

    // 1. Primary Cloud Backend: Supabase
    if (isSupabaseConfigured()) {
      try {
        const availability = await checkSupabaseRoomAvailability(
          roomTypeId,
          parsedCheckIn,
          parsedCheckOut
        );

        if (!availability.available && availability.room) {
          return NextResponse.json(
            {
              error: `Sorry, ${availability.room.name} is fully booked for these dates (${availability.occupied}/${availability.totalUnits} units occupied). Please select different dates or another suite.`,
            },
            { status: 409 }
          );
        }

        const newSupabaseBooking = await createSupabaseBooking({
          bookingCode,
          roomTypeId,
          guestName,
          guestEmail: guestEmail || "guest@hotelalsafabd.com",
          guestPhone,
          guestNidPassport: guestNidPassport || null,
          permanentAddress: permanentAddress || null,
          occupation: occupation || null,
          nationality: nationality || "Bangladeshi",
          fatherOrHusbandName: fatherOrHusbandName || null,
          purposeOfTravel: purposeOfTravel || null,
          allottedRoom: allottedRoom || null,
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
        });

        return NextResponse.json(newSupabaseBooking, { status: 201 });
      } catch (err) {
        console.warn("Supabase booking creation failed, attempting local fallback:", err);
      }
    }

    // 2. Secondary Local Backend: Prisma
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
            permanentAddress: permanentAddress || null,
            occupation: occupation || null,
            nationality: nationality || "Bangladeshi",
            fatherOrHusbandName: fatherOrHusbandName || null,
            purposeOfTravel: purposeOfTravel || null,
            allottedRoom: allottedRoom || null,
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

    // 3. Fallback store handling for offline dev / serverless without DB
    const fallbackRoom: FallbackRoomType | undefined = fallbackStore.getRoomByIdOrSlug(roomTypeId);
    const room = fallbackRoom || fallbackStore.getRooms()[0];

    const fallbackBooking = fallbackStore.addBooking({
      bookingCode,
      guestName,
      guestEmail: guestEmail || "guest@hotelalsafabd.com",
      guestPhone,
      guestNidPassport: guestNidPassport || null,
      permanentAddress: permanentAddress || null,
      occupation: occupation || null,
      nationality: nationality || "Bangladeshi",
      fatherOrHusbandName: fatherOrHusbandName || null,
      purposeOfTravel: purposeOfTravel || null,
      allottedRoom: allottedRoom || null,
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
