import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface UploadResult {
  url: string;
  publicId?: string;
}

/**
 * Upload an image buffer to Cloudinary using server-side signature,
 * or fallback to local disk storage if Cloudinary credentials are not configured.
 */
export async function uploadImageToStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // If Cloudinary credentials are provided, perform signed upload to Cloudinary
  if (cloudName && apiKey && apiSecret) {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "portfolio-projects";

    // Signature formula: sha1(params sorted alphabetically + apiSecret)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    formData.append("file", blob, filename);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errText}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  }

  // Fallback for local development if Cloudinary is not yet configured:
  // Save directly to /public/uploads/
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const targetPath = path.join(uploadsDir, safeFilename);
  fs.writeFileSync(targetPath, buffer);

  return {
    url: `/uploads/${safeFilename}`,
  };
}
