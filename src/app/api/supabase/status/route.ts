import { NextResponse } from "next/server";
import { checkSupabaseHealth } from "@/lib/supabase-db";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    const configured = isSupabaseConfigured();
    const health = await checkSupabaseHealth();

    return NextResponse.json({
      provider: "supabase",
      configured,
      connected: health.connected,
      error: health.error || null,
      counts: health.counts,
      environment: {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
        hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
        hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        provider: "supabase",
        configured: false,
        connected: false,
        error: error.message || "Diagnostic failed",
      },
      { status: 500 }
    );
  }
}
