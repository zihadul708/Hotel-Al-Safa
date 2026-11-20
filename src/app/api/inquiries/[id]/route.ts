import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { updateSupabaseInquiryStatus, deleteSupabaseInquiry } from "@/lib/supabase-db";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // 1. Primary Cloud Backend: Supabase
    if (isSupabaseConfigured()) {
      try {
        const updated = await updateSupabaseInquiryStatus(id, status);
        if (updated) {
          return NextResponse.json(updated);
        }
      } catch (err) {
        console.warn("Supabase inquiry update failed, attempting local fallback:", err);
      }
    }

    // 2. Secondary Local Backend: Prisma
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

    // 1. Primary Cloud Backend: Supabase
    if (isSupabaseConfigured()) {
      try {
        const deleted = await deleteSupabaseInquiry(id);
        if (deleted) {
          return NextResponse.json({ success: true });
        }
      } catch (err) {
        console.warn("Supabase inquiry delete failed, attempting local fallback:", err);
      }
    }

    // 2. Secondary Local Backend: Prisma
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
