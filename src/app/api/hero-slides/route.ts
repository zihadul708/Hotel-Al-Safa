import { NextResponse } from "next/server";
import {
  getHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  saveAllHeroSlides,
  resetHeroSlidesToDefault,
} from "@/lib/hero-slides-store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";
    const slides = await getHeroSlides(includeInactive);
    return NextResponse.json(slides);
  } catch (error) {
    console.error("GET /api/hero-slides error:", error);
    return NextResponse.json({ error: "Failed to load hero slides" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "reset") {
      const reset = await resetHeroSlidesToDefault();
      return NextResponse.json({ success: true, slides: reset });
    }

    if (body.action === "reorder" && Array.isArray(body.slides)) {
      const saved = await saveAllHeroSlides(body.slides);
      return NextResponse.json({ success: true, slides: saved });
    }

    // Default: Add single slide
    const { image, tag, title, isActive = true } = body;
    if (!image || !title) {
      return NextResponse.json({ error: "Image URL and title are required" }, { status: 400 });
    }

    const created = await addHeroSlide({
      image,
      tag: tag || "Hotel Al Safa International",
      title,
      isActive,
    });

    return NextResponse.json({ success: true, slide: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/hero-slides error:", error);
    return NextResponse.json({ error: "Failed to process hero slide" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: "Slide ID and updates are required" }, { status: 400 });
    }

    const updated = await updateHeroSlide(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, slide: updated });
  } catch (error) {
    console.error("PUT /api/hero-slides error:", error);
    return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Slide ID is required" }, { status: 400 });
    }

    const deleted = await deleteHeroSlide(id);
    if (!deleted) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/hero-slides error:", error);
    return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 });
  }
}
