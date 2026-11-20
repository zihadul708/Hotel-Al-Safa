import { NextResponse } from "next/server";
import { seedSupabaseDatabase } from "@/lib/supabase-db";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase credentials are not configured in environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 400 }
      );
    }

    const result = await seedSupabaseDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Supabase seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed Supabase database.",
      },
      { status: 500 }
    );
  }
}
