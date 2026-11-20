import fs from "fs";
import path from "path";
import { isSupabaseConfigured, supabaseAdmin } from "./supabase";
import { HeroSlide, INITIAL_HERO_SLIDES } from "./hero-slides-types";

export type { HeroSlide };
export { INITIAL_HERO_SLIDES };

const DATA_FILE = path.join(process.cwd(), "data", "hero-slides.json");
let inMemorySlides: HeroSlide[] = [...INITIAL_HERO_SLIDES];

function ensureDataDirectory() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadFromFile(): HeroSlide[] | null {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read hero slides from file:", err);
  }
  return null;
}

function saveToFile(slides: HeroSlide[]) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(slides, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist hero slides to file:", err);
  }
}

export async function getHeroSlides(includeInactive = false): Promise<HeroSlide[]> {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const query = supabaseAdmin
        .from("hero_slides")
        .select("*")
        .order("order", { ascending: true });

      if (!includeInactive) {
        query.eq("is_active", true);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          image: d.image,
          tag: d.tag,
          title: d.title,
          order: d.order,
          isActive: d.is_active ?? true,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Fallback
    }
  }

  // 2. Try Local File
  const fileSlides = loadFromFile();
  if (fileSlides) {
    inMemorySlides = fileSlides;
  }

  // Return sorted
  const sorted = [...inMemorySlides].sort((a, b) => a.order - b.order);
  if (includeInactive) {
    return sorted;
  }
  return sorted.filter((s) => s.isActive);
}

export async function saveAllHeroSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
  // Normalize orders
  const normalized = slides.map((slide, idx) => ({
    ...slide,
    order: idx + 1,
    updatedAt: new Date().toISOString(),
  }));

  inMemorySlides = normalized;
  saveToFile(normalized);

  // Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const records = normalized.map((s) => ({
        id: s.id,
        image: s.image,
        tag: s.tag,
        title: s.title,
        order: s.order,
        is_active: s.isActive,
        updated_at: s.updatedAt,
      }));
      await supabaseAdmin.from("hero_slides").upsert(records, { onConflict: "id" });
    } catch (err) {
      console.warn("Supabase hero slides sync notice:", err);
    }
  }

  return normalized;
}

export async function addHeroSlide(slide: Omit<HeroSlide, "id" | "order" | "createdAt" | "updatedAt">): Promise<HeroSlide> {
  const current = await getHeroSlides(true);
  const newSlide: HeroSlide = {
    ...slide,
    id: `slide-${Date.now()}`,
    order: current.length + 1,
    isActive: slide.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [...current, newSlide];
  await saveAllHeroSlides(updated);
  return newSlide;
}

export async function updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide | null> {
  const current = await getHeroSlides(true);
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveAllHeroSlides(current);
  return current[index];
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  const current = await getHeroSlides(true);
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) return false;

  await saveAllHeroSlides(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("hero_slides").delete().eq("id", id);
    } catch {
      // Ignored
    }
  }

  return true;
}

export async function resetHeroSlidesToDefault(): Promise<HeroSlide[]> {
  inMemorySlides = [...INITIAL_HERO_SLIDES];
  saveToFile(inMemorySlides);

  if (isSupabaseConfigured()) {
    try {
      const records = inMemorySlides.map((s) => ({
        id: s.id,
        image: s.image,
        tag: s.tag,
        title: s.title,
        order: s.order,
        is_active: s.isActive,
      }));
      await supabaseAdmin.from("hero_slides").upsert(records, { onConflict: "id" });
    } catch {
      // Ignored
    }
  }

  return inMemorySlides;
}
