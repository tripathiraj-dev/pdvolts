import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { storageProvider, validateUploadFile } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size and mime type
    const validation = validateUploadFile(file.size, file.type);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize folder
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");

    const result = await storageProvider.save(buffer, file.name, file.type, safeFolder);

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: result.fileName,
      fileSize: result.fileSize,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "File upload processing failed" }, { status: 500 });
  }
}
