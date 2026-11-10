import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackStore } from "@/lib/mock-data";

export async function POST(req: Request) {
  try {
    const { code, nights = 1, baseAmount = 0 } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, message: "Please enter a valid coupon code." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    let promo: {
      code: string;
      discountPct: number | null;
      discountAmt: number | null;
      minNights: number;
      isActive: boolean;
    } | null | undefined = null;

    try {
      promo = await prisma.promoCode.findUnique({
        where: { code: cleanCode },
      });
    } catch (dbErr) {
      console.warn("Prisma promo lookup failed, searching fallback store:", dbErr);
    }

    if (!promo) {
      promo = fallbackStore.findPromo(cleanCode);
    }

    if (!promo || !promo.isActive) {
      return NextResponse.json(
        { valid: false, message: "Invalid or expired promo code." },
        { status: 404 }
      );
    }

    if (promo.minNights && nights < promo.minNights) {
      return NextResponse.json(
        {
          valid: false,
          message: `This promo requires a minimum stay of ${promo.minNights} night(s).`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (promo.discountPct) {
      discount = Math.round((baseAmount * promo.discountPct) / 100);
    } else if (promo.discountAmt) {
      discount = Math.min(promo.discountAmt, baseAmount);
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountAmount: discount,
      message: promo.discountPct
        ? `Promo applied! ${promo.discountPct}% discount (৳${discount.toLocaleString()} off)`
        : `Promo applied! ৳${discount.toLocaleString()} discount`,
    });
  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to validate promo code." },
      { status: 500 }
    );
  }
}
