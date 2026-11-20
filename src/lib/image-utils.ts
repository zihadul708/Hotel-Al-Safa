/**
 * Utility functions for optimized image delivery across Hotel Al Safa
 */

/**
 * Ensures Cloudinary images automatically use the most modern format (AVIF/WebP)
 * and intelligent quality compression without loss of visual clarity.
 */
export function optimizeImageUrl(url: string, width?: number): string {
  if (!url) return url;

  // Cloudinary optimization
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const transformations = ["f_auto", "q_auto"];
    if (width) {
      transformations.push(`w_${width}`, "c_limit");
    }
    const transformString = transformations.join(",");

    // If already has transformation
    if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) {
      return url;
    }

    return url.replace("/upload/", `/upload/${transformString}/`);
  }

  // Unsplash image optimization
  if (url.includes("images.unsplash.com")) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("auto", "format");
      // Default to 80 quality for speed
      if (!parsed.searchParams.has("q") || Number(parsed.searchParams.get("q")) > 80) {
        parsed.searchParams.set("q", "80");
      }
      if (width) {
        parsed.searchParams.set("w", String(width));
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
}
