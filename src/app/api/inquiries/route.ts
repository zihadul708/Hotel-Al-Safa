import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseInquiries, createSupabaseInquiry } from "@/lib/supabase-db";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function GET() {
  // 1. Primary Cloud Backend: Supabase
  if (isSupabaseConfigured()) {
    try {
      const inquiries = await getSupabaseInquiries();
      if (inquiries && inquiries.length > 0) {
        return NextResponse.json(inquiries);
      }
    } catch (err) {
      console.warn("Supabase inquiry fetch failed, checking secondary fallbacks:", err);
    }
  }

  // 2. Secondary Local Backend: Prisma
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (inquiries && inquiries.length > 0) {
      return NextResponse.json(inquiries);
    }
  } catch (error) {
    console.warn("Prisma unavailable, serving fallback inquiries:", error);
  }

  // 3. Fallback store
  return NextResponse.json(fallbackStore.getInquiries());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone number, and message are required." },
        { status: 400 }
      );
    }

    // 1. Primary Cloud Backend: Supabase
    if (isSupabaseConfigured()) {
      try {
        const created = await createSupabaseInquiry({
          name,
          email: email || "guest@hotelalsafabd.com",
          phone,
          subject: subject || "General Inquiry",
          message,
        });

        return NextResponse.json(created, { status: 201 });
      } catch (err) {
        console.warn("Supabase inquiry creation failed, attempting local fallback:", err);
      }
    }

    // 2. Secondary Local Backend: Prisma
    try {
      const inquiry = await prisma.inquiry.create({
        data: {
          name,
          email: email || "guest@hotelalsafabd.com",
          phone,
          subject: subject || "General Inquiry",
          message,
          status: "NEW",
        },
      });

      return NextResponse.json(inquiry, { status: 201 });
    } catch (dbErr) {
      console.warn("Prisma inquiry insert failed, saving to fallback store:", dbErr);
    }

    // 3. In-memory fallback
    const fallbackInquiry = fallbackStore.addInquiry({
      name,
      email: email || "guest@hotelalsafabd.com",
      phone,
      subject: subject || "General Inquiry",
      message,
      status: "NEW",
    });

    return NextResponse.json(fallbackInquiry, { status: 201 });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
