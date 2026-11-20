import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "supabase", "schema.sql");
    const sql = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(sql, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load schema" }, { status: 500 });
  }
}
