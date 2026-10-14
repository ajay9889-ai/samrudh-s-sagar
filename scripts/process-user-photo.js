const { removeBackground } = require("@imgly/background-removal-node");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function main() {
  const inputPath = path.resolve(
    "C:/Users/ajayh/.gemini/antigravity-ide/brain/b5a45f7d-1fbe-49f6-9e28-cd83f89230d9/.user_uploaded/media_1791906404083.jpg"
  );
  const outputPath = path.resolve("public/me.png");

  console.log("Reading user photo:", inputPath);
  const fileBuffer = fs.readFileSync(inputPath);
  const inputBlob = new Blob([fileBuffer], { type: "image/jpeg" });

  console.log("Removing background with AI model...");
  const resultBlob = await removeBackground(inputBlob);
  const outputBuffer = Buffer.from(await resultBlob.arrayBuffer());

  console.log("Processing with sharp into high-contrast B&W portrait...");

  // Convert to high-contrast monochrome
  const processed = await sharp(outputBuffer)
    .trim()
    .grayscale()
    .linear(1.2, -15) // Deepen shadows, crisp contrast
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  fs.writeFileSync(outputPath, processed);
  console.log("Successfully saved cut-out portrait to:", outputPath);
}

main().catch((err) => {
  console.error("Error processing user photo:", err);
  process.exit(1);
});
