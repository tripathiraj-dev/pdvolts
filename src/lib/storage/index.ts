import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface IStorageProvider {
  save(buffer: Buffer, originalName: string, mimeType: string, subfolder?: string): Promise<UploadResult>;
  delete(fileUrl: string): Promise<boolean>;
}

// Local File System Storage Provider
export class LocalStorageProvider implements IStorageProvider {
  private baseUploadDir: string;

  constructor() {
    this.baseUploadDir = path.join(process.cwd(), "public", "uploads");
  }

  private async ensureDir(dirPath: string) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async save(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    subfolder: string = "general"
  ): Promise<UploadResult> {
    const targetDir = path.join(this.baseUploadDir, subfolder);
    await this.ensureDir(targetDir);

    const ext = path.extname(originalName).toLowerCase() || "";
    const cleanBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const safeFileName = `${cleanBase}-${uniqueSuffix}${ext}`;
    const filePath = path.join(targetDir, safeFileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subfolder}/${safeFileName}`;

    return {
      url: publicUrl,
      fileName: safeFileName,
      fileSize: buffer.length,
      mimeType,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith("/uploads/")) return false;
      const relativePath = fileUrl.replace("/uploads/", "");
      const fullPath = path.join(this.baseUploadDir, relativePath);
      await fs.unlink(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

// Allowed MIME types & file extension validation
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export function validateUploadFile(
  fileSize: number,
  mimeType: string,
  maxSizeBytes: number = 10 * 1024 * 1024 // 10MB
): { valid: boolean; error?: string } {
  if (fileSize > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds limit of ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB`,
    };
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    return {
      valid: false,
      error: `File type "${mimeType}" is not permitted. Only standard images, PDFs, and Office documents are allowed.`,
    };
  }

  return { valid: true };
}

// Storage provider factory
export const storageProvider: IStorageProvider = new LocalStorageProvider();
