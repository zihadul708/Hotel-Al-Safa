import { NextResponse } from "next/server";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET() {
  return NextResponse.json({
    configured: isCloudinaryConfigured(),
  });
}

export async function POST(req: Request) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            "Cloudinary credentials are missing. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file.",
        },
        { status: 400 }
      );
    }

    const cld = getCloudinary();
    if (!cld) {
      return NextResponse.json(
        { error: "Could not initialize Cloudinary client." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in request." },
        { status: 400 }
      );
    }

    // Validate type (must be image)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP, etc.) are supported." },
        { status: 400 }
      );
    }

    // Limit size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit. Please upload a smaller photo." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cld.uploader.upload_stream(
        {
          folder: "hotel-al-safa/rooms",
          resource_type: "image",
          transformation: [
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image to Cloudinary." },
      { status: 500 }
    );
  }
}
