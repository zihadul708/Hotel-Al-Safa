import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    try {
      const updated = await prisma.booking.update({
        where: { id },
        data: {
          ...(body.status && { status: body.status }),
          ...(body.paymentStatus && { paymentStatus: body.paymentStatus }),
          ...(body.paidAmount !== undefined && { paidAmount: Number(body.paidAmount) }),
        },
        include: {
          roomType: true,
        },
      });

      return NextResponse.json(updated);
    } catch (dbErr) {
      console.warn("Prisma booking update failed, updating fallback store:", dbErr);
      const fallbackUpdated = fallbackStore.updateBooking(id, {
        ...(body.status && { status: body.status }),
        ...(body.paymentStatus && { paymentStatus: body.paymentStatus }),
        ...(body.paidAmount !== undefined && { paidAmount: Number(body.paidAmount) }),
      });

      if (fallbackUpdated) {
        return NextResponse.json(fallbackUpdated);
      }
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to update booking:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await prisma.booking.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    } catch (dbErr) {
      console.warn("Prisma booking delete failed, deleting from fallback store:", dbErr);
      const deleted = fallbackStore.deleteBooking(id);
      if (deleted) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
