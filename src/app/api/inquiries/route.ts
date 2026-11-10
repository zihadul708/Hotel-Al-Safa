import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function GET() {
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
