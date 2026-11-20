import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const authResult = await authenticateAdmin(username, password);
    if (!authResult) {
      return NextResponse.json(
        { error: "Invalid username or password. Please try again." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: authResult.user,
      token: authResult.token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Authentication server error. Please try again." },
      { status: 500 }
    );
  }
}
