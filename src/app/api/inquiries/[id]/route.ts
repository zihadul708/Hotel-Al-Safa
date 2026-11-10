import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    try {
      const updated = await prisma.inquiry.update({
        where: { id },
        data: { status },
      });

      return NextResponse.json(updated);
    } catch (dbErr) {
      console.warn("Prisma inquiry update failed, updating fallback store:", dbErr);
      const fallbackUpdated = fallbackStore.updateInquiry(id, status);
      if (fallbackUpdated) {
        return NextResponse.json(fallbackUpdated);
      }
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to update inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await prisma.inquiry.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } catch (dbErr) {
      console.warn("Prisma inquiry delete failed, deleting from fallback store:", dbErr);
      const deleted = fallbackStore.deleteInquiry(id);
      if (deleted) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
